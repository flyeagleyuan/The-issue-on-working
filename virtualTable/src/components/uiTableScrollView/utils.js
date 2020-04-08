export const isNum = val => typeof val === 'number' && val === val;

export const isUndef = val => val === undefined;

export const isBool = val => typeof val === 'boolean';

export const isFunc = val => typeof val === 'function';

export const isArray = val => Array.isArray(val);

export const isStr = val => typeof val === 'string';

export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

export const oneOf = (val, list) => list.indexOf(val) !== -1;

export const camelCase = str => {
  let s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

export const convertRemToPx = (rem, designWidth = 750) => {
  if (!rem) return null;
  rem = parseFloat(rem);
  const multiple = window.innerWidth / designWidth;
  return rem * multiple * 100;
};

export const handleWidth = width => {
  if (typeof width === 'number') {
    return width;
  }
  if (typeof width === 'string') {
    if (width.endsWith('rem')) {
      return convertRemToPx(parseFloat(width) || 2);
    } else if (width.endsWith('px')) {
      return parseFloat(width);
    }
  }
  return convertRemToPx(2);
};

export const convertColumnOrder = (columns, fixedType) => {
  let list = [],
    other = [];

  columns.forEach(column => {
    if (column.fixed && column.fixed === fixedType) {
      list.push(column);
    } else {
      other.push(column);
    }
  });
  return list.concat(other);
};

export const getStyle = (element, styleName) => {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    const compute = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || compute ? compute[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

export const cloneDeep = obj => {
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(key => (clone[key] = typeof obj[key] === 'object' ? cloneDeep(obj[key]) : obj[key]));
  if (Array.isArray(obj) && obj.length) {
    return (clone.length = obj.length) && Array.from(clone);
  } else {
    return Array.isArray(obj) ? Array.from(obj) : clone;
  }
};

export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
