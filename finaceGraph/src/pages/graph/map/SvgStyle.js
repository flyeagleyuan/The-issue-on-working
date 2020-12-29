export default class SvgStyle {
  constructor(el, cache) {
    this.listReg = /\b\w+\([^)]*\)/g;
    this.splitReg = /\s*[,'"]+\s*/g;
    if (this instanceof SvgStyle) {
      this.style = getComputedStyle(el);
    } else {
      if (cache) {
        var node = el,
          key = '';
        do {
          key = `/${node.tagName}.${node.classList.toString()}${key}`;
        } while (!(node instanceof SVGGElement) && node.parentNode instanceof SVGElement && (node = node.parentNode));
        return key in this ? this[key] : (this[key] = new SvgStyle(el));
      }
      return new SvgStyle(el);
    }
  }

  prop(name, value) {
    const val = this.style.getPropertyValue('--' + name).trim();
    return arguments.length === 2 ? val || value : val;
  }
  list(name) {
    return this.prop(name).match(this.listReg) || [];
  }
  fn(name) {
    const list = this.list(name),
      funcs = [];
    for (let i = 0, l = list.length; i < l; i++) {
      var item = list[i],
        index = item.indexOf('(');
      funcs.push({
        name: item.slice(0, index),
        args: item
          .slice(index + 1, -1)
          .split(this.splitReg)
          .slice(0, -1),
      });
    }
    return funcs;
  }
  func(name) {
    const list = this.list(name),
      funcs = [];
    for (let i = 0, l = list.length; i < l; i++) {
      var item = list[i],
        index = item.indexOf('('),
        json = item.slice(index + 1, -1),
        args = {};
      if (json) {
        try {
          Object.assign(args, JSON.parse(json));
        } catch (e) {
          console.warn(e);
        }
      }
      funcs.push({
        name: item.slice(0, index),
        args: args,
      });
    }
    return funcs;
  }
}
