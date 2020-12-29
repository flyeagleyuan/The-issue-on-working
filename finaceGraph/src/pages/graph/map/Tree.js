import d3 from '@/pages/graph/d3.lib';
import Base from './Base';
import Util from './Util';
import SvgBox from './SvgBox';

export default class Tree extends Base {
  init(data) {
    this.root = d3.hierarchy((this.data = data || this.data));
    this.rendered = false;
  }
  resize(width, height) {
    this.width = width || this.width;
    this.height = height || this.height;
    this.update();
    this.render();
  }
  update() {
    var root = this.root;
    this.cut(root.children || []);
    let nodes = root.descendants(),
      links = nodes.slice(1),
      leaves = 0;

    setTimeout(() => {
      nodes.forEach(node => {
        if (node.data._isCategory && node.tipBox) {
          if (!node.children) {
            node.tipBox.hide();
          } else {
            node.tipBox.show();
          }
        }
      });
    }, 200);

    if (!this.selected) this.selected = root;

    for (let d of nodes) {
      if (!d.id) d.id = Util.uuid();

      if (!d.data.children.length) leaves++;
    }

    var width = this.width,
      height = Math.max(this.height, leaves * 26),
      offset = (height - this._height || 0) * 0.5;

    for (let d of nodes) {
      'x' in d && (d._x = d.x + offset);
      'y' in d && (d._y = d.y);
    }

    d3
      .tree()
      .size([height, width * 0.4])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)(root);

    root.x = height * 0.5;
    this.nodes = nodes;
    this.links = links;
    this._height = height;

    let beforeNode = {};
    let beforeLeave = {};
    const categories = [];
    root.eachAfter(d => {
      if (d.data._isCategory) {
        categories.push(d);
      }
      if (d.depth === beforeNode.depth) {
        let gaps = Object.keys(beforeNode).length > 0 ? d.x - beforeNode.x : 0;
        if (d.data._isCategory && beforeNode.data._isCategory) {
          if (gaps < 100) {
            d.x += 100 - gaps;
          }
        } else {
          if (gaps < 20) {
            d.x += 20 - gaps;
          }
        }
      }
      beforeNode = d;

      d.y = this.nodeDistance(d);
      !('_x' in d) && (d._x = d.x + offset);
      !('_y' in d) && (d._y = d.y);
    });

    // 第二次遍历以防不同层级的叶子节点被遮盖
    const treeLeaves = root.leaves();
    treeLeaves.forEach(d => {
      const gaps = d.x - (beforeLeave.x || 0);
      if (gaps < 25) {
        d.x += 25 - gaps;
      }
      const gap = d.x - beforeLeave.x;
      if (beforeLeave.parent !== d.parent && gap < 45) {
        d.x += gap < 0 ? 45 - gap : 45;
      }
      beforeLeave = d;
    });

    // 第三次遍历，保证父级节点在其子节点的中心位置
    const firstDepCategories = categories.filter(c => c.depth === 1);
    if (firstDepCategories.length > 1) {
      treeLeaves.forEach((d, index) => {
        const currentNodeParent = d.parent;
        const lastNodeParent = index !== 0 && treeLeaves[index - 1].parent;
        if (index !== 0 && currentNodeParent !== lastNodeParent) {
          const currentNodes = currentNodeParent.children || currentNodeParent.__children__;
          const currentStartNode = currentNodes[0];
          const currentEndNode = currentNodes[currentNodes.length - 1];
          const nodeHalfOffset = (currentEndNode.x - currentStartNode.x) / 2;
          if (Math.abs(nodeHalfOffset - currentNodeParent.x) > 50 && !currentNodeParent.data._isRoot) {
            currentNodeParent.x = currentEndNode.x - nodeHalfOffset;
          }
        }
      });
    }

    // 保证子节点伸缩时父节点变化位置不会覆盖
    let lastCategory = {};
    let lastSameDepthCategory = {};
    categories.forEach(category => {
      if (
        (lastCategory.parent &&
          category.parent !== lastCategory.parent &&
          (category.children || category.__children__) &&
          (category.children || category.__children__).indexOf(lastCategory) === -1) ||
        category.depth === lastCategory.depth
      ) {
        const gap = category.x - lastCategory.x;
        if (gap < 60) {
          category.x += 60 - gap;
        }
      }
      if (category.depth < lastCategory.depth) {
        const children = category.children;
        const firstChild = children[0];
        const lastChild = children[children.length - 1];
        const halfOffset = (lastChild.x - firstChild.x) / 2;
        if (Math.abs(halfOffset - category.x) > this.nodeWidth(category)) {
          category.x = lastChild.x - halfOffset;
        }
      }
      let g;
      if (
        lastSameDepthCategory[category.depth] &&
        (g = category.x - lastSameDepthCategory[category.depth].x) < 60 /*this.nodeWidth(category)*/
      ) {
        category.x += 60 - g;
      }
      lastCategory = category;
      lastSameDepthCategory[category.depth] = category;
    });
  }
  x(x) {
    return Math.round(x + this.width * 0.5);
  }
  y(y) {
    return Math.round(y + (this.height - this._height) * 0.5);
  }
  nodeWidth(d) {
    const { _isRoot, isLeave: _isLeave } = d.data;
    switch (true) {
      case _isRoot:
        return 18;
      case _isLeave:
        return 174;
      default:
        return 70;
    }
  }
  nodeDistance(d) {
    let width = 70;
    const { _isRoot, _isCategory, tips } = d.data;
    if (_isRoot) {
      width = 70;
    } else if (_isCategory) {
      width += this.nodeWidth(d) * 0.5 - 30;
    } else {
      width = tips ? 100 : 50;
    }
    return d.depth ? this.nodeDistance(d.parent) + this.nodeWidth(d.parent) * 0.5 + width : 0;
  }
  cut(nodes) {
    for (let node of nodes) {
      if (!node.collapsed) {
        this.slice(node);
        node.children && this.cut(node.children);
      }
    }
  }
  toggle(node) {
    if (node.depth) {
      if (node.collapsed) {
        this.slice(node);
        node.data._hideTips = false;
        node.tipBox &&
          d3
            .select(node.tipBox.el)
            .transition()
            .duration(this.duration)
            .style('opacity', '1');
      } else {
        node.children = undefined;
        node.data._hideTips = true;
        node.tipBox &&
          d3
            .select(node.tipBox.el)
            .transition()
            .duration(this.duration)
            .style('opacity', '0');
      }
      node.collapsed = !node.collapsed;
    }
  }
  slice(node) {
    var children = node.__children__ || (node.__children__ = node.children);
    if (children) {
      var size = node.data._size || children.length,
        limit = this.limit;
      if ('children' in node) {
        if (node.data._isCategory && this.limit < size && !node.unlimited) {
          node.children = children.slice(0, limit);
          var child =
            node.child ||
            (node.child = Tree.createNode({
              id: '_' + node.id,
              plus: true,
              children: [],
            }));
          child.data.name = `更多 ( ${size - limit} )`;
          child.parent = node;
          child._isLeave = true;
          child._isCategory = false;
          child.depth = node.depth + 1;
          child.height = node.height - 1;
          node.children.push(child);
        } else {
          node.children = children;
        }
      }
    }
  }
  render() {
    this.renderNodes();
    this.renderLinks();
    this.rendered = true;
  }
  renderLinks() {
    const link = this.g.selectAll(`.link-${this.css}`).data(this.links, d => d.id),
      enter = link
        .enter()
        .append('path')
        .attr('class', `link link-${this.css}`)
        .attr('d', this.linkTransformFrom.bind(this))
        .attr('opacity', 0),
      update = enter
        .merge(link)
        .transition()
        .duration(this.duration)
        .attr('d', this.linkTransformTo.bind(this))
        .attr('opacity', 1);
    link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
    for (var el of update.nodes()) {
      var parent = el.parentNode;
      parent.removeChild(el);
      parent.insertBefore(el, parent.firstChild);
    }
  }
  renderNodes() {
    const node = this.g.selectAll(`.node-${this.css}`).data(this.nodes, d => d.id),
      enter = node
        .enter()
        .append('g')
        .attr('class', d =>
          `node node-${this.css} ${d.data._isRoot ? 'node-root' : ''} ${d.data._isLeave ? 'node-leave' : ''} ${
            d.data._isCategory ? `node-category${d.data._categoryType ? ' node-type-' + d.data._categoryType : ''}` : ''
          }`.trim()
        )
        .attr('transform', this.nodeTransformFrom.bind(this))
        .attr('opacity', 0)
        .on('click', d => this.parent.onTreeNodeClick(d, this));
    enter.nodes().forEach(this.renderNodeShape, this);
    const update = enter
      .merge(node)
      .transition()
      .duration(this.duration)
      .attr('transform', this.nodeTransformTo.bind(this))
      .attr('opacity', 1);
    update.nodes().forEach(this.renderNodeText, this);
    node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }
  renderNodeShape(el) {
    const d = el.__data__,
      data = d.data,
      // tags = data.tags,
      tips = data.tips,
      warn = data.warn,
      flow = new SvgBox({
        root: el,
        depth: d.depth,
        hasPercentNode: data.link ? 0 : data,
        css: `flow rate-${parseInt(data.rate)}`,
      }),
      label = flow.append({
        root: el,
        css: `label rate-${parseInt(data.rate)} ${data.name.indexOf('更多 (') === 0 ? 'plus' : ''}`.trim(),
      });

    /*if(data._isLeave && !data._hideTips) {
      const p = d.parent;
    }*/

    /*let tips;
    if (data._isLeave && !d.parent.collapsed) {
      tips = d.parent.data.tips;
    }
    if (data._isCategory && !d.collapsed) {
      tips = d.tips;
    }*/

    if (tips) {
      d.tipBox = new SvgBox({
        root: el,
        css: `tips ${data.link ? 'anchor' : ''}`.trim(),
        text: tips,
        isPercent: data.link ? 0 : 1,
        link: data.link,
        title: tips,
      });
    }

    // data.symbol 非空判断 为 上市公司 （瞿确认）
    if (data.symbol) {
      flow.append({
        root: el,
        css: `tags rate-${parseInt(data.rate)} ` + 'stockCode',
        text: `[${data.symbol}]`,
        title: data.symbol,
      });
    }

    if (warn) {
      flow.append({
        root: el,
        css: `warn warn-${warn}`,
      });
    }
    if (data._isLeave) {
      flow.anchor = this.direction > 0 ? 'start' : 'end';
    }

    d.flow = flow;
    d.label = label;
  }
  renderNodeText(el) {
    const d = el.__data__,
      data = d.data,
      flow = d.flow,
      label = d.label,
      tipBox = d.tipBox;
    el.classList[data.active ? 'add' : 'remove']('active');
    label.text = data.alias || data.name;
    label.title = data.title;
    flow.update();
    flow.render();
    if (tipBox) {
      tipBox.update();
      if (!data._isCategory) {
        tipBox.render(data.tips.length * 2 * -this.direction);
      } else {
        tipBox.render();
      }
    }
  }
  linkTransformFrom(d) {
    var p = this.rendered ? d.parent : this.root,
      x = this.x(p._y * this.direction),
      y = this.y(p._x);
    return `
                M${x}, ${y}
                L${x}, ${y}
                ${x}, ${y}
                ${x}, ${y}
            `.replace(/\s+/g, ' ');
  }
  linkTransformTo(d) {
    let p = d.parent,
      data = d.data,
      d0 = this.direction,
      x0 = this.x(p.y * d0),
      y0 = this.y(p.x),
      x1 = this.x(d.y * d0),
      y1 = this.y(d.x),
      split = 0.92;
    const { _isRoot, _isCategory, tips } = p.data;
    if (_isRoot) {
      x0 += this.nodeWidth(p) * 0.5 * d0;
      x1 -= this.nodeWidth(d) * 0.5 * d0;
      split = 0.8;
    } else if (_isCategory) {
      x0 += this.nodeWidth(p) * 0.5 * d0;
      x1 -= 5 * d0;
      split = 0.6;

      if (tips) {
        const tLen = tips.length;
        const tipX = tLen * 3 * d0 + this.nodeWidth(p) * 0.5 * d0;
        const stLen = data.tips ? data.tips.length : 0;
        return `
                    M${x0 - 20 * d0}, ${y0}
                    L${x0 + tipX}, ${y0}
                     ${x0 + tipX}, ${y1}
                     ${x1 + (tips.length + stLen) * 3 * d0} , ${y1}
                `.replace(/\s+/g, ' ');
      }
      return `
                    M${x0 - 20 * d0}, ${y0}
                    L${x0 + (x1 - x0) * split}, ${y0}
                     ${x0 + (x1 - x0) * split}, ${y1}
                     ${x1 - 8 * d0} , ${y1}
                `.replace(/\s+/g, ' ');
    } else {
      x0 += p.flow.outerWidth * d0;
      x1 -= this.nodeWidth(d) * 0.5 * d0;
    }
    return `
                M${x0}, ${y0}
                L${x0 + (x1 - x0) * split}, ${y0}
                 ${x0 + (x1 - x0) * split}, ${y1}
                 ${x1 + 20 * d0}, ${y1}
            `.replace(/\s+/g, ' ');
  }
  nodeTransformFrom(d) {
    var p = this.rendered ? d.parent : this.root;
    return `translate(${this.x(p._y * this.direction)}, ${this.y(p._x)})`;
  }
  nodeTransformTo(d) {
    const p = d.parent;
    if (p) {
      const { tips } = p.data;
      if (tips) {
        const { tips: selfTips } = d.data;
        const tLen = tips.length,
          stLen = selfTips ? selfTips.length : 0;
        const addWidth = selfTips ? (stLen + tLen) * 3 : tLen * 3;
        return `translate(${this.x((d.y + addWidth) * this.direction)}, ${this.y(d.x)})`;
      }
    }
    return `translate(${this.x(d.y * this.direction)}, ${this.y(d.x)})`;
  }
  static generator(nodes, depth) {
    var children = [];
    for (var node of nodes) {
      if (depth < Util.random(2, 2)) {
        var size = Util.random(1, 5),
          list = [];
        for (var i = 0; i < size; i++) {
          list.push(`${node}-${i + 1}`);
        }
        children.push({
          name: node,
          children: this.generator(list, depth + 1),
        });
      } else {
        children.push({
          name: node,
          children: [],
        });
      }
    }
    return children;
  }
  static createNode() {
    return d3.hierarchy(Object.assign({}, ...arguments));
  }
  static addNode(child, parent) {
    var node = this.createNode(child);
    node.parent = parent;
    node.depth = parent.depth + 1;
    node.height = parent.height - 1;
    if (!parent.children) {
      parent.children = [];
      parent.data.children = [];
    }
    parent.children.push(node);
    parent.data.children.push(node.data);
    return node;
  }
  static removeNode(child) {
    var parent = child.parent;
    if (parent) {
      var index = parent.children.indexOf(child);
      if (index > -1) {
        parent.children.splice(index, 1);
        parent.data.children.splice(index, 1);
      }
      if (!parent.children.length) {
        delete parent.children;
        delete parent.__children__;
      }
      return child;
    }
  }
}
