import Loading from './loading.vue';

export default {
  install(Vue) {
    let loading = null;

    Vue._loading = Vue.prototype.$_loading = (function() {
      return {
        open(opt = {}) {
          if (!loading) {
            loading = new (Vue.extend(Loading))();
            loading.$mount();
            document.querySelector(typeof opt === 'string' ? 'body' : opt.container || 'body').appendChild(loading.$el);
          }

          const { text, opacity } = opt;
          loading.text = typeof opt === 'string' ? opt : text || '正在加载...';
          loading.opacity = typeof opt === 'object' && opacity;
          loading.visible = true;
          return loading;
        },
        close() {
          loading.visible = false;
        },
      };
    })();
  },
};
