import { isPlainObject } from 'lodash';

/**
 * 获取url查询参数
 * @param options 默认参数
 * @return {any}
 */

export const getUrlSearches = (options = {}) => {
  const proto = Object.create(Object.getPrototypeOf(options));
  const urlObject = urlParse(location.search);
  return Object.assign({}, options, urlObject, proto);
};

export const urlParse = urlString => {
  const searchObj = {};
  const list = urlString.match(/([^&?]*?=[^&?]*)/g);
  if (list && list.length) {
    list.forEach(search => {
      const searchSplit = search.split('=');
      searchObj[searchSplit[0]] = searchSplit[1];
    });
  }
  return searchObj;
};

/**
 * 对象序列化为url查询参数
 * @param queryObj 查询对象
 * @param isEncode 是否编码
 * @return {string}
 */
export const urlQueriesSerialize = (queryObj, isEncode = false) => {
  if (!isPlainObject(queryObj)) {
    throw new Error('argument must be an object');
  }
  let query = '';
  Object.keys(queryObj).forEach(key => {
    if (queryObj[key]) {
      query += `&${key}=${queryObj[key]}`;
    }
  });
  return isEncode ? `?${encodeURIComponent(query.slice(1))}` : `?${query.slice(1)}`;
};

/**
 * url地址合并为一个地址
 * @param args 多个路径，支持不同的相对层级
 * @return {string} 完整的url地址
 */
export const urlJoin = (...args) => {
  return args
    .join('/')
    .replace(/[/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?');
};
