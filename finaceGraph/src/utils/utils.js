/**
 * 去除对象中为空或undefined的值
 * @param object 指定对象
 * @return {{}}
 */
export const removeObjectNil = object => {
  if (!object) return {};
  const newObject = {};
  Object.keys(object).forEach(key => {
    if (object[key] !== undefined && object[key] !== '') {
      newObject[key] = object[key];
    }
  });
  return newObject;
};
/**
 * 是否包含
 * @param val 指定值
 * @param list 全部值
 * @return {Boolean}
 */
export const oneOf = (val, list) => list.indexOf(val) > -1;

export const isNum = val => typeof val === 'number' && val === val;

export const isUndef = val => val === undefined;

export const isString = val => typeof val === 'string';

export const isNil = val => val === undefined || val === null;

export const isNull = val => val === null;

export const isBool = val => typeof val === 'boolean';

export const isFunc = val => typeof val === 'function';

export const isArray = val => Array.isArray(val);

export const isStr = val => typeof val === 'string';

export const isEmpty = val => val == null || val === '--' || !(Object.keys(val) || val).length;

export const isPromiseLike = obj =>
  obj !== null && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';

export const openNewTab = (url, target = '_blank') => {
  let link = document.createElement('a');
  link.href = url;
  link.target = target;
  link.rel = 'noopener';
  link.click();
  link.remove();
  link = null;
};
