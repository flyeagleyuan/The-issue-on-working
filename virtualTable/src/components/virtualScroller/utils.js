export const isUndef = val => typeof val === 'undefined';

export const triggerLast = timeout => {
  let timer = null;
  return fn => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), timeout);
  };
};

export const last = array => {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
};

let offsetToIndexMap = {};

export const clearOffsetCache = () => (offsetToIndexMap = {});

export const getOffsetIndex = (offset, lens) => {
  const offsetToIndex = offsetToIndexMap[offset];
  if (!isUndef(offsetToIndex)) {
    return offsetToIndex;
  }
  const list = lens;
  const count = list.length;
  let i = ~~(count / 2);
  let oldI;
  let h;
  let s = 0,
    e = count - 1;
  do {
    oldI = i;
    h = list[i];
    if (h < offset) {
      s = i;
    } else if (i < count - 1 && list[i + 1] > offset) {
      e = i;
    }
    i = ~~((s + e) / 2);
  } while (i !== oldI);
  i < 0 && (i = 0);
  i > count && (i = count);
  offsetToIndexMap[offset] = i;
  return i;
};
