import Base from './Base';
import SvgWrap from './SvgWrap';
import Util from './Util';

const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

export default class SvgBox extends Base {
  constructor() {
    super(
      {
        root: null,
        el: null,
        css: '',
        text: '',
        spans: [],
        children: [],
        x: 0,
        y: 0,
      },
      ...arguments
    );
    this.create();
  }
  create() {
    const groupWrap = new SvgWrap(this.node || 'g').appendTo(this.root);
    this.el = groupWrap.el;
    this.groupWrap = groupWrap.attr('class', `svg-box ${this.css}`.trim());
    this.titleWrap = groupWrap.append('title');
    var groupStyle = groupWrap.style();
    this.graphics = groupStyle.func('graphics').map(this.createGraphic, this);
    this.textWrap = groupWrap.append('text');
    var textStyle = this.textWrap.html('\b\t\b').style(),
      style = textStyle.style;
    this.fontWeight = style.fontWeight;
    this.fontSize = parseInt(style.fontSize);
    this.fontFamily = style.fontFamily;
    this.anchor = groupStyle.prop('anchor', 'middle');
    this.width = Number(groupStyle.prop('width', NaN));
    this.height = Number(groupStyle.prop('height', NaN));
    this.maxWidth = Number(groupStyle.prop('max-width', NaN));
    this.maxHeight = Number(groupStyle.prop('max-height', NaN));
    this.minWidth = Number(groupStyle.prop('min-width', NaN));
    this.minHeight = Number(groupStyle.prop('min-height', NaN));
    this.marginTop = Number(groupStyle.prop('margin-top'));
    this.marginRight = Number(groupStyle.prop('margin-right'));
    this.marginBottom = Number(groupStyle.prop('margin-bottom'));
    this.marginLeft = Number(groupStyle.prop('margin-left'));
    this.paddingTop = Number(groupStyle.prop('padding-top'));
    this.paddingRight = Number(groupStyle.prop('padding-right'));
    this.paddingBottom = Number(groupStyle.prop('padding-bottom'));
    this.paddingLeft = Number(groupStyle.prop('padding-left'));
    this.multiLine = !!groupStyle.prop('multi-line');
    this.ellipsis = groupStyle.prop('ellipsis');
    this.lineHeight = parseInt(style.lineHeight) || this.textWrap.el.clientHeight;
    this.textAnchor = style.textAnchor || 'middle';
    this.verticalAlign = style.verticalAlign || 'middle';
    this.transform = groupStyle.prop('transform');

    return this;
  }
  createGraphic(cfg) {
    const tag = cfg.name,
      args = cfg.args,
      wrap = this.groupWrap.append(tag);
    for (let key in args) {
      if (args.hasOwnProperty(key)) {
        wrap.attr(key, args[key]);
      }
    }
    return wrap;
  }
  append(cfg) {
    const children = this.children,
      child = new SvgBox(
        Object.assign(cfg, {
          parent: this,
        })
      );
    children.push(child);
    return child;
  }
  prepend(cfg) {
    const children = this.children,
      child = new SvgBox(
        Object.assign(cfg, {
          parent: this,
        })
      );
    children.unshift(child);
    return child;
  }
  update() {
    let width = this.width,
      height = this.height,
      maxWidth = this.maxWidth,
      maxHeight = this.maxHeight,
      minWidth = this.minWidth,
      minHeight = this.minHeight,
      innerWidth = NaN,
      innerHeight = NaN,
      adjustWidth = 0,
      adjustHeight = 0,
      lineWidth = 0,
      lineHeight = this.lineHeight,
      spanWidth = 0,
      multiLine = this.multiLine,
      text = this.text,
      ellipsis = this.ellipsis,
      size = text.length,
      list = text.split('\n'),
      ctx = Util.context();

    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

    const rate = ctx.measureText('中文').width / 26;

    for (let i = 0, l = list.length; i < l; i++) {
      const w = ctx.measureText(list[i]).width / rate;
      spanWidth = Math.max(spanWidth, w);
      lineWidth += w;
    }
    if (multiLine) {
      adjustWidth = spanWidth;
      if (!isNaN(maxWidth)) {
        innerWidth = adjustWidth > maxWidth ? maxWidth : adjustWidth;
      } else if (!isNaN(minWidth)) {
        innerWidth = adjustWidth < minWidth ? minWidth : adjustWidth;
      } else {
        innerWidth = isNaN(width) ? adjustWidth : width;
      }
      if (adjustWidth > innerWidth) {
        let textStart = 0;
        spanWidth = 0;
        adjustWidth = 0;
        list.length = 0;
        for (let i = 0; i < size; i++) {
          const char = text[i];
          if (char === '\n') {
            list.push(text.slice(textStart, i));
            adjustWidth = Math.max(adjustWidth, spanWidth);
            textStart = i + 1;
            spanWidth = 0;
          } else {
            const w = ctx.measureText(char).width / rate;
            if ((spanWidth += w) > innerWidth) {
              list.push(text.slice(textStart, i));
              adjustWidth = Math.max(adjustWidth, spanWidth - w);
              textStart = i;
              spanWidth = w;
            }
          }
        }
        list.push(text.slice(textStart));
        adjustWidth = Math.max(adjustWidth, spanWidth);
      }
      adjustHeight = list.length * lineHeight;
      if (!isNaN(maxHeight)) {
        innerHeight = adjustHeight > maxHeight ? maxHeight : adjustHeight;
      } else if (!isNaN(minHeight)) {
        innerHeight = adjustHeight < minHeight ? minHeight : adjustHeight;
      } else {
        innerHeight = isNaN(height) ? adjustHeight : height;
      }
      if (adjustHeight > innerHeight) {
        const limit = Math.floor(innerHeight / lineHeight);
        this.spans = list.slice(0, limit);
        if (!this.title) {
          this.title = text;
        }
      } else {
        this.spans = list;
      }
    } else {
      adjustWidth = lineWidth;
      if (!isNaN(maxWidth)) {
        innerWidth = adjustWidth > maxWidth ? maxWidth : adjustWidth;
      } else if (!isNaN(minWidth)) {
        innerWidth = adjustWidth < minWidth ? minWidth : adjustWidth;
      } else {
        innerWidth = isNaN(width) ? adjustWidth : width;
      }
      if (adjustWidth > innerWidth) {
        let start = 0;
        adjustWidth = ctx.measureText(ellipsis).width / rate;
        list.length = 0;
        for (let i = 0; i < size; i++) {
          const char = text[i];
          if (char === '\n') {
            list.push(text.slice(start, i));
            start = i + 1;
          } else {
            const w = ctx.measureText(char).width / rate;
            if (adjustWidth + w > innerWidth) {
              list.push(text.slice(start, i) + ellipsis);
              if (!isNaN(maxWidth) || !isNaN(minWidth)) {
                innerWidth = adjustWidth;
              }
              break;
            } else {
              adjustWidth += w;
            }
          }
        }
      }
      adjustHeight = lineHeight;
      if (!isNaN(maxHeight)) {
        innerHeight = adjustHeight > maxHeight ? maxHeight : adjustHeight;
      } else if (!isNaN(minHeight)) {
        innerHeight = adjustHeight < minHeight ? minHeight : adjustHeight;
      } else {
        innerHeight = isNaN(height) ? adjustHeight : height;
      }
      if (adjustHeight > innerHeight) {
        this.spans = [];
        if (!this.title) {
          this.title = text;
        }
      } else {
        this.spans = list;
      }
    }
    this.lineWidth = lineWidth;
    this.adjustWidth = adjustWidth;
    this.adjustHeight = adjustHeight;
    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;
    this.outerWidth = innerWidth + this.paddingLeft + this.paddingRight;
    this.outerHeight = innerHeight + this.paddingTop + this.paddingBottom;
    this.updateChildren();
    return this;
  }
  updateChildren() {
    const children = this.children;
    let width = 0,
      height = 0;
    for (let i = 0, l = children.length; i < l; i++) {
      const box = children[i];
      box.update();
      width += box.marginLeft + box.outerWidth + box.marginRight;
      height = Math.max(height, box.marginTop + box.outerHeight + box.marginBottom);
    }
    width = Math.max(width, this.innerWidth);
    height = Math.max(height, this.innerHeight);
    switch (this.anchor) {
      case 'start':
        this.x = 0;
        break;
      case 'middle':
        this.x = -width * 0.5;
        break;
      case 'end':
        this.x = -width;
        break;
    }
    this.innerWidth = width;
    this.innerHeight = height;
    this.outerWidth = width + this.paddingLeft + this.paddingRight;
    this.outerHeight = height + this.paddingTop + this.paddingBottom;
  }
  render(x, y) {
    this.renderChildren();

    this.groupWrap.attr('transform', `translate(${x || 0} ${y || 0}) ${this.transform}`.trim());
    this.graphics.forEach(this.renderGraphic, this);
    this.renderText();

    return this;
  }
  hide() {
    this.groupWrap.attr('display', 'none');
  }
  show() {
    this.groupWrap.attr('display', '');
  }
  renderGraphic(graphicWrap) {
    let w = this.outerWidth,
      h = this.outerHeight,
      x = this.x + this.innerWidth * 0.5,
      y = this.y,
      r = Math.max(w, h) * 0.5,
      rx = w * 0.5,
      ry = h * 0.5;

    if (isIOS) {
      let getOsv = navigator.userAgent.toLowerCase().match(/os\s*(\d+)/)[1] || 0;
      if (getOsv <= 9 || getOsv >= 13) {
        if (r > 10 && r < 20) {
          r = 24;
        } else if (r > 30) {
          r = 30;
        }
      }
    }

    switch (graphicWrap.el.tagName) {
      case 'circle':
        graphicWrap.attr('r', r);
        break;
      case 'ellipse':
        graphicWrap.attr('rx', rx).attr('ry', ry);
        break;
      case 'image':
        graphicWrap
          .attr('width', w)
          .attr('height', h)
          .attr(
            'xlink:href',
            graphicWrap
              .style()
              .prop('href')
              .slice(1, -1)
          );

        if (isIOS) {
          graphicWrap
            .attr('width', w / 3)
            .attr('height', h / 3)
            .attr('x', -12)
            .attr('y', -10);
        }

        break;
      case 'line':
        break;
      case 'path':
        break;
      case 'polygon':
        break;
      case 'polyline':
        break;
      case 'rect':
        graphicWrap
          .attr('width', w + 2)
          .attr('height', h + 2)
          .attr('x', x - w / 2 - 1)
          .attr('y', y - h / 2 - 1);
        break;
    }
  }
  renderText() {
    const height = this.lineHeight,
      text = this.textWrap.html(''),
      title = this.titleWrap,
      spans = this.spans,
      size = spans.length,
      multi = this.multiLine,
      lines = multi ? size : 1,
      w = this.innerWidth,
      h = this.innerHeight,
      t = this.paddingTop,
      l = this.paddingLeft,
      dx = {
        start: -w * 0.5,
        middle: 0,
        end: w * 0.5,
      }[this.textAnchor],
      dy =
        {
          top: 0,
          middle: (h - height * lines) * 0.5,
          bottom: h - height * lines,
          baseline: h - height * lines,
        }[this.verticalAlign] +
        (height - h) * 0.5;

    if (this.title) {
      title.text(this.title);
    }

    const offsetY = isIOS ? 4 : 0;
    if (multi) {
      text.attr('dx', l).attr('dy', t);
      for (let i = 0; i < size; i++) {
        text
          .append('tspan')
          .attr('x', dx)
          .attr('y', dy + i * height + offsetY)
          .text(spans[i]);
      }
    } else {
      text.attr('dx', l + dx).attr('dy', t + dy + offsetY);
      for (let i = 0; i < size; i++) {
        text.append('tspan').text(spans[i]);
      }
    }
  }
  renderChildren() {
    const children = this.children;
    let x = this.x,
      y = this.y;

    if (this.depth === 0) {
      for (let i = 0, l = children.length; i < l; i++) {
        const box = children[i];
        if (box.css.indexOf('warn') === -1) {
          box.render(x + this.outerWidth / 2, y);
          y += box.adjustHeight + 1;
        } else {
          box.render(x + this.outerWidth / 2 + children[0].outerWidth / 2 + children[0].marginRight + 1, this.y);
        }
      }
    } else {
      if (!window.temp) window.temp = 1;

      window.temp++;

      // if(window.temp == 32) console.log(999, $.extend(true, [], children));

      for (let i = 0, l = children.length; i < l; i++) {
        const box = children[i];
        // if(window.temp == 32) console.log(888, box)
        box.render(x + box.outerWidth * 0.5 + box.marginLeft, y);
        x += box.outerWidth + box.marginRight + 1;
      }
    }
  }
}
