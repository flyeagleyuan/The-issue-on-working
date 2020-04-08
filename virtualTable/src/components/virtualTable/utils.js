export const isFunc = val => typeof val === 'function';
export const isStr = val => typeof val === 'string';

/* eslint-disable */
export const cloneDeep = obj => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(key => (clone[key] = typeof obj[key] === 'object' ? cloneDeep(obj[key]) : obj[key]));
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
};
/* eslint-enable */

/**
 * 获取class类
 * @param {string | object | string[]} classes
 * @param {string} prefix
 */
export const getClassNames = (classes, prefix = 'dzh--') => {
  if (typeof classes === 'string') {
    return prefix + classes;
  } else if (Array.isArray(classes)) {
    return classes.map(c => prefix + c);
  } else if (typeof classes === 'object') {
    return Object.keys(classes).reduce((newObj, key) => {
      return classes[key] ? { ...newObj, ...{ [prefix + key]: classes[key] } } : newObj;
    }, {});
  }
  return classes;
};

/**
 * 水平同步滚动
 * @param {Element[]} els html数组
 * @param {number} scrollLeft
 */
export const syncScroll = (els = [], scrollLeft = 0) => {
  if (!els || els.length === 0) return;
  for (let el of els) {
    el.scrollLeft = scrollLeft;
  }
};

export const getStickyProp = (() => {
  const prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
  let stickyText = '';
  for (let i = 0; i < prefixTestList.length; i++) {
    stickyText += 'position:' + prefixTestList[i] + 'sticky;';
  }
  let div = document.createElement('div');
  div.style.cssText = stickyText;
  document.body.appendChild(div);
  const position = window.getComputedStyle(div).position;
  document.body.removeChild(div);
  div = null;
  return position;
})();

const periodFreeze = timeout => {
  let timer = null;
  return fn => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), timeout);
  };
};

export const periodFreezeScroll = periodFreeze(300);
