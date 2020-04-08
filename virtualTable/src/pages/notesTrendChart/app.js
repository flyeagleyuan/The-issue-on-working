import Vue from 'vue';
import App from './App.vue';
import Loading from '@/components/uiLoading';
import FastClick from 'fastclick';
import Http from '@/utils/http';
import 'normalize.css';

Vue.config.productionTip = false;
Vue.use(Loading);
Vue.use(Http);

FastClick.attach(document.body);

new Vue({
  render: h => h(App),
}).$mount('#app');
