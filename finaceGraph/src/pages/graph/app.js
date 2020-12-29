import Vue from 'vue';
import App from './App.vue';
import Loading from '@/components/uiLoading';
import { http } from '@/utils/http';
import { isEmpty } from '@/utils/utils';

Vue.use(Loading);
Vue.use(http);

Vue.filter('formatMulCompanyName', v => {
  if (!isEmpty(v)) {
    const r = v.split(',');
    return r.length > 1 ? r[0] + '等' : r[0];
  }
  return v;
});

Vue.directive('scrollFix', {
  bind: el => {
    let lastTouch = {};

    el.addEventListener('touchstart', e => {
      lastTouch = e.touches[0];
    });

    el.addEventListener(
      'touchmove',
      e => {
        e.stopPropagation();
        let scrollEl = e.currentTarget,
          touch = e.touches[0];

        if (
          scrollEl.scrollHeight <= scrollEl.offsetHeight ||
          (!scrollEl.scrollTop && touch.screenY > lastTouch.screenY) ||
          (scrollEl.scrollTop === scrollEl.scrollHeight - scrollEl.offsetHeight && touch.screenY < lastTouch.screenY)
        ) {
          e.preventDefault();
        }

        lastTouch = touch;
      },
      false
    );
  },
});

new Vue({
  el: '#app',
  render: h => h(App),
});
