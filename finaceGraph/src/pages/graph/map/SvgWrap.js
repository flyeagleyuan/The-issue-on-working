import SvgStyle from './SvgStyle';

export default class SvgWrap {
  constructor(tag) {
    this.ns = 'http://www.w3.org/2000/svg';
    if (this instanceof SvgWrap) {
      if (tag instanceof SVGElement) {
        this.el = tag;
      } else if (typeof tag === 'string') {
        this.el = document.createElementNS(this.ns, tag);
      }
    } else {
      return new SvgWrap(tag);
    }
  }

  attr(name, value) {
    const el = this.el;
    if (arguments.length > 1) {
      if (name.indexOf(':') > -1) {
        const args = name.split(':');
        el.setAttributeNS('http://www.w3.org/1999/' + args[0], args[1], value);
      } else {
        el.setAttributeNS(null, name, value);
      }
      return this;
    } else {
      return el.getAttributeNS(null, name);
    }
  }
  find(selector) {
    return new SvgWrap(this.el.querySelector(selector));
  }
  append(tag) {
    const wrap = tag instanceof SvgWrap ? tag : new SvgWrap(tag),
      parent = this.el,
      child = wrap.el;
    parent.appendChild(child);
    return wrap;
  }
  // replaceWidth()
  appendTo(tag) {
    let parent,
      child = this.el;
    if (tag instanceof SVGElement) {
      parent = tag;
    } else if (tag instanceof SvgWrap) {
      parent = tag.el;
    }
    parent && parent.appendChild(child);
    return this;
  }
  prepend(tag) {
    const wrap = tag instanceof SvgWrap ? tag : new SvgWrap(tag),
      parent = this.el,
      child = wrap.el;
    parent.insertBefore(child, parent.firstChild);
    return wrap;
  }
  prependTo(tag) {
    let parent,
      child = this.el;
    if (tag instanceof SVGElement) {
      parent = tag;
    } else if (tag instanceof SvgWrap) {
      parent = tag.el;
    }
    parent && parent.insertBefore(child, parent.firstChild);
    return this;
  }
  style() {
    return new SvgStyle(this.el, false);
  }
  html(value) {
    if (arguments.length) {
      this.el.innerHTML = value;
      return this;
    } else {
      return this.el.innerHTML;
    }
  }
  text(value) {
    if (arguments.length) {
      this.el.textContent = value;
      return this;
    } else {
      return this.el.textContent;
    }
  }
  width(value) {
    if (arguments.length) {
      this.el.clientWidth = value;
      return this;
    } else {
      return this.el.clientWidth;
    }
  }
  height(value) {
    if (arguments.length) {
      this.el.clientHeight = value;
      return this;
    } else {
      return this.el.clientHeight;
    }
  }
}
