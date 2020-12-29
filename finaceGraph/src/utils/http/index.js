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
          try {
            console.error(info);
            if (returncode === 202) {
              this.$alert({
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
            } else if (returncode === 500) {
              this.$alert({
                message: info,
                title: '提示',
                confirmButtonText: '我知道了',
              });
            }
          } catch (e) {
            return reject(e);
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
  static install(Vue, options) {
    Object.assign(this.options, options);
    Vue.use(Modal);
    const that = this;

    /**
     * 发起get请求
     * @param action action地址
     * @param params 请求参数
     * @param headers header头信息
     */
    Vue.prototype.$get = function(action, params, headers) {
      return _request.call(this, {
        method: 'GET',
        action,
        params,
        headers,
        configs: that.options,
      });
    };

    // 同上
    Vue.prototype.$post = function(action, params, headers) {
      return _request.call(this, {
        method: 'POST',
        action,
        params,
        headers,
        configs: that.options,
      });
    };

    // 同上 防止与$delete命名冲突
    Vue.prototype.$httpDelete = function(action, params, headers) {
      return _request.call(this, {
        method: 'DELETE',
        action,
        params,
        headers,
        configs: that.options,
      });
    };

    // 同上
    Vue.prototype.$put = function(action, params, headers) {
      return _request.call(this, {
        method: 'PUT',
        action,
        params,
        headers,
        configs: that.options,
      });
    };

    // 分页请求
    Vue.prototype.$nextPage = function(action, params, headers) {
      const key = that.makePageParams(action, params);
      let { skip, pagesize } = that.requestPageQueue[key],
        sendOpts = {};
      Object.assign(sendOpts, params, { skip, pagesize });
      Object.assign(that.requestPageQueue[key], { skip: skip + pagesize });
      return this.$get(action, sendOpts, headers);
    };

    /**
     * 一次同时发起多个请求
     * @param requests 请求数组 包含{action, options, headers}三个选项
     * @return {Promise<any[]>}
     */
    Vue.prototype.$all = function(requests) {
      if (!Array.isArray(requests)) {
        throw new TypeError(`[HTTP ERROR]:requests参数必须为一个数组，你传递的为${JSON.stringify(requests)}`);
      }
      return Promise.all(
        requests.map(request => {
          if (request instanceof Promise) {
            return request;
          } else {
            const { action, params, headers } = request;
            return this.$get(action, params, headers);
          }
        })
      );
    };

    /**
     * 以race方式发起多个请求
     * @param requests 请求数组 包含{action, options, headers}三个选项
     * @return {Promise<any>}
     */
    Vue.prototype.$race = function(requests) {
      if (!Array.isArray(requests)) {
        throw new TypeError(`[HTTP ERROR]:requests参数必须为一个数组，你传递的为${JSON.stringify(requests)}`);
      }
      return Promise.race(
        requests.map(request => {
          if (request instanceof Promise) {
            return request;
          } else {
            const { action, params, headers } = request;
            return this.$get(action, params, headers);
          }
        })
      );
    };

    // 中断当前未完成的request请求
    Vue.prototype.$abort = function() {
      requestsQueue.forEach(({ action, request }) => {
        console.warn(`[HTTP WARN]:action: ${action}请求被中断`);
        request.$abort();
      });
    };
  }
}

export default http;
