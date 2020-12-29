import d3 from '@/pages/graph/d3.lib';
import Emitter from './Emitter';
import Tree from './Tree';

export default class MindMap extends Emitter {
  init(data) {
    if (this.g) this.g.remove();
    this.g = this.svg.append('g').attr('class', 'mind');
    this.svg.call(
      d3
        .zoom()
        .scaleExtent(this.scale)
        .on('zoom', this.zoom.bind(this))
    );

    d3.zoom().scaleTo(this.svg, this.svgRate);

    addEventListener('resize', this.resize.bind(this));
    this.left = this.createLeftTree();
    this.right = this.createRightTree();

    this.isInit = true;

    this.initPos = {
      x: ((1 - this.svgRate) * document.documentElement.offsetWidth) / 2,
      y: ((1 - this.svgRate) * document.documentElement.offsetHeight) / 2,
    };

    this.adjustPositionObj = Object.assign({}, this.initPos);
    this.g.attr('transform', 'translate(' + this.initPos.x + ',' + this.initPos.y + ') scale(' + this.svgRate + ')');

    this.transform = Object.assign({ k: this.svgRate }, this.initPos);

    var i = Math.ceil(data.children.length * 0.5);
    this.left.init(
      Object.assign(Object.create(data), {
        children: data.children.slice(0, i),
      })
    );
    this.right.init(
      Object.assign(Object.create(data), {
        children: data.children.slice(i),
      })
    );
    this.resize();
  }
  setZoom(stop) {
    if (stop) {
      this.svg.on('.zoom', null);
    } else {
      this.svg.call(
        d3
          .zoom()
          .scaleExtent(this.scale)
          .on('zoom', this.zoom.bind(this))
      );
    }
  }
  zoom() {
    if (window.stopMove) return;

    var t = d3.event.transform;

    if (this.isInit) {
      t.k = this.svgRate;

      this.adjustPositionObj.x = t.x;
      this.adjustPositionObj.y = t.y;
      this.isInit = false;

      this.g.attr('transform', Object.assign(Object.create(t), { k: this.svgRate }));
    } else {
      var tempObj = {
        x: Math.round(t.x - this.adjustPositionObj.x + ((1 - this.svgRate) * document.documentElement.offsetWidth) / 2),
        y: Math.round(
          t.y - this.adjustPositionObj.y + ((1 - this.svgRate) * document.documentElement.offsetHeight) / 2
        ),
      };

      this.emit('treeTransform', t);
      this.g.attr('transform', Object.assign(Object.create(t), tempObj));
      this.transform = tempObj;
    }
  }
  resize() {
    var width = this.svg.property('clientWidth'),
      height = this.svg.property('clientHeight');
    this.width = width;
    this.height = height;
    this.left.width = width;
    this.left.height = height;
    this.right.width = width;
    this.right.height = height;
    this.update();
    this.render();
  }
  update() {
    this.left.update();
    this.right.update();
  }
  render() {
    this.left.render();
    this.right.render();
  }
  nodes() {
    return [].concat(this.left.nodes, this.right.nodes);
  }
  onTreeNodeClick(d, tree) {
    this.activeTree = tree;
    this.activeNode = d;

    this.emit('treeNodeClick', d, tree);
  }
  createLeftTree() {
    return new Tree({
      parent: this,
      css: 'left',
      direction: -1,
      g: this.g,
      limit: this.limit,
      duration: this.duration,
    });
  }
  createRightTree() {
    return new Tree({
      parent: this,
      css: 'right',
      direction: 1,
      g: this.g,
      limit: this.limit,
      duration: this.duration,
    });
  }
}
