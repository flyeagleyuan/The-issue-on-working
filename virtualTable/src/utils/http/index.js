import Vue from 'vue';
import { Modal } from './modal';

const isPlainObject = o => {
  return o && Object.prototype.toString.call(o) === '[object Object]' && 'isPrototypeOf' in o;
};

const urlQueriesSerialize = queryObj => {
  if (!isPlainObject(queryObj)) {
    throw new TypeError('[HTTP ERROR]:argument must be an object');
  }
  let query = '';
  Object.keys(queryObj).forEach(key => {
    if (queryObj[key]) {
      query += `&${key}=${queryObj[key]}`;
    }
  });
  return `?${query.slice(1)}`;
};

// 请求队列
const requestsQueue = [];

// 禁止直接调用
const _request = function({ method = 'GET', action, params = {}, headers = {}, configs = {} }) {
  if (!action) {
    throw new TypeError('[HTTP ERROR]:action传递错误"');
  }
  if (typeof action !== 'string') {
    if (isPlainObject(action)) {
      const { headers: _headers, action: _action, params: _params } = action;
      return _request({ method, action: _action, params: _params, headers: _headers, configs });
    }
    throw new TypeError(`[HTTP ERROR]:action传递错误，你传递的action为"${JSON.stringify(action)}"`);
  }
  const requestQueueKey = action + urlQueriesSerialize(params);
  const alertMethod = this instanceof Vue ? this.$alert : Vue.alert;
  return new Promise((resolve, reject) => {
    const currentRequestIndex = requestsQueue.findIndex(request => request.key === requestQueueKey);
    const xhr = $.ajax({
      url: action,
      type: method,
      data: params,
      headers,
      ...Object.assign({}, { timeout: 60000 }, configs),
      success: res => {
        const { info, returncode } = typeof res !== 'object' ? JSON.parse(res) : res;
        if (returncode !== 0) {
          const noWarnFlag = localStorage.getItem('nowarn');
          if (typeof noWarnFlag === 'undefined' || +noWarnFlag < 1) {
            try {
              console.error(info);
              if (returncode === 202 /* 无权限 */) {
                alertMethod({
                  message: info,
                  title: '提示',
                  confirmButtonText: '提升等级',
                  cancelButtonText: '稍后设置',
                  showCancelButton: true,
                  buttonType: 'link',
                  confirmLink: location.origin + '/finchinaAPP/member.html' + location.search,
                  beforeClose(action, instance, done, event) {
                    if (action === 'confirm') {
                      // todo 确认按钮跳转
                    } else if (action === 'cancel') {
                      // todo 取消按钮操作
                      event.preventDefault();
                    }
                    // 调用以往下执行
                    done();
                  },
                });
              } else if (returncode === 500 /* 服务器错误 */) {
                alertMethod({
                  message: info,
                  title: '提示',
                  confirmButtonText: '我知道了',
                });
              }
            } catch (e) {
              return reject(e);
            }
          }
          reject(typeof res !== 'object' ? JSON.parse(res) : res);
        } else {
          resolve(res);
        }
      },
      error: err => {
        reject(err);
        console.error(`[HTTP ERROR]:action请求失败: ${location.origin}/${action}${urlQueriesSerialize(params)}`);
      },
      complete() {
        currentRequestIndex > -1 && requestsQueue.splice(currentRequestIndex, 1);
      },
    });
    requestsQueue.push({ key: requestQueueKey, request: xhr });
  });
};

export class http {
  static options = {};
  static requestPageQueue = {};

  static makePageParams(action, params) {
    const key = action + urlQueriesSerialize(params);
    if (!this.requestPageQueue[key]) {
      this.requestPageQueue = {};
      this.requestPageQueue[key] = {
        skip: 0,
        pagesize: 15,
        hasError: false,
      };
    }
    return key;
  }

  static get(action, params, headers) {
    return _request.call(this, {
      method: 'GET',
      action,
      params,
      headers,
      configs: http.options,
    });
  }

  static post(action, params, headers) {
    return _request.call(this, {
      method: 'POST',
      action,
      params,
      headers,
      configs: http.options,
    });
  }
  static httpDelete(action, params, headers) {
    return _request.call(this, {
      method: 'DELETE',
      action,
      params,
      headers,
      configs: http.options,
    });
  }

  static put(action, params, headers) {
    return _request.call(this, {
      method: 'PUT',
      action,
      params,
      headers,
      configs: http.options,
    });
  }

  static nextPage(action, params, headers) {
    const key = http.makePageParams(action, params);
    let { skip, pagesize } = http.requestPageQueue[key],
      sendOpts = {};
    Object.assign(sendOpts, params, { skip, pagesize });
    Object.assign(http.requestPageQueue[key], { skip: skip + pagesize });
    return this[this instanceof Vue ? '$get' : 'get'](action, sendOpts, headers);
  }

  static all(requests) {
    if (!Array.isArray(requests)) {
      throw new TypeError(`[HTTP ERROR]:requests参数必须为一个数组，你传递的为${JSON.stringify(requests)}`);
    }
    return Promise.all(
      requests.map(request => {
        if (request instanceof Promise) {
          return request;
        } else {
          const { action, params, headers } = request;
          return this[this instanceof Vue ? '$get' : 'get'](action, params, headers);
        }
      })
    );
  }

  static race(requests) {
    if (!Array.isArray(requests)) {
      throw new TypeError(`[HTTP ERROR]:requests参数必须为一个数组，你传递的为${JSON.stringify(requests)}`);
    }
    return Promise.race(
      requests.map(request => {
        if (request instanceof Promise) {
          return request;
        } else {
          const { action, params, headers } = request;
          return this[this instanceof Vue ? '$get' : 'get'](action, params, headers);
        }
      })
    );
  }

  // 中断当前未完成的request请求
  static abort() {
    requestsQueue.forEach(({ action, request }) => {
      if (action) {
        console.warn(`[HTTP WARN]:action: ${action}请求被中断`);
        request.abort();
      }
    });
  }
  static install(Vue, options) {
    Object.assign(this.options, options);
    Vue.use(Modal);
    /**
     * 发起get请求
     * @param action action地址
     * @param params 请求参数
     * @param headers header头信息
     */
    Vue.prototype.$get = this.get;

    // 同上
    Vue.prototype.$post = this.post;

    // 同上 防止与$delete命名冲突
    Vue.prototype.$httpDelete = this.httpDelete;

    // 同上
    Vue.prototype.$put = this.put;

    // 分页请求
    Vue.prototype.$nextPage = this.nextPage;

    /**
     * 一次同时发起多个请求
     * @param requests 请求数组 包含{action, options, headers}三个选项
     * @return {Promise<any[]>}
     */
    Vue.prototype.$all = this.all;

    /**
     * 以race方式发起多个请求
     * @param requests 请求数组 包含{action, options, headers}三个选项
     * @return {Promise<any>}
     */
    Vue.prototype.$race = this.race;

    // 中断当前未完成的request请求
    Vue.prototype.$abort = this.abort;
  }
}

export default http;
