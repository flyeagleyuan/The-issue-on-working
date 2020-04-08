/**
 * 去除对象中为空或undefined的值
 * @param object 指定对象
 * @return {{}}
 */
export const removeObjectNil = object => {
  if (!object) return {};
  const newObject = {};
  Object.keys(object).forEach(key => {
    if (!isNil(object[key]) && object[key] !== '') {
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

export const isUndef = val => val === void 0;

export const isString = val => typeof val === 'string';

export const isNil = val => isUndef(val) || isNull(val);

export const isNull = val => val === null;

export const isBool = val => typeof val === 'boolean';

export const isFunc = val => typeof val === 'function';

export const isArray = val => Array.isArray(val);

export const isStr = val => typeof val === 'string';

export const isEmpty = val => isNull(val) || !(Object.keys(val) || val).length;

export const hasOwn = (item, key) => Object.prototype.hasOwnProperty.call(item, key);

export function normalizeReportName(report) {
  const reportMap = {
    '1231': '年报',
    '0930': '三季报',
    '0630': '中报',
    '0331': '一季报',
  };
  if (report) {
    return report.substr(0, 4) + reportMap[report.substr(4, 4)];
  }
  return '';
}

export const formatNumber = num => {
  return num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
};
