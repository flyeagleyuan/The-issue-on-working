import DragButton from 'components/dragButton';
import commons from '@utils/commons';

export default {
  components: { DragButton },
  computed: {
    appVersion() {
      let appVersion = window.appVersion;
      try {
        appVersion = window.jsi.appVersion();
      } catch (e) {
        console.log(e);
      }
      return appVersion;
    },
    appVersionNumber() {
      let versionNumber;
      if (this.appVersion) {
        let version = this.appVersion.replace(/[a-zA-Z]*(.+)/, '$1');
        const index = version.indexOf('.');
        if (index > -1) {
          version = version.substring(0, index) + '.' + version.substr(index).replace(/\./g, '');
        }
        versionNumber = parseFloat(version);
      }
      return versionNumber && !Number.isNaN(versionNumber) ? versionNumber : 0;
    },
    isShowDragButton() {
      const appFrom = commons.getAppFrom();
      if (appFrom && appFrom !== 'finchina') return false;
      return this.appVersionNumber >= 3.5 && this.appVersionNumber < 4.0;
    },
  },
  mounted() {
    // 左侧节点树预加载, 版本号大于或等于3.5
    this.$nextTick(() => {
      if (this.appVersionNumber >= 3.5 && this.appVersionNumber < 4.0) {
        commons.preload('f9/menu.html');
      }
    });
  },
  methods: {
    handleButtonClick() {
      try {
        window.jsi.isShowSideslip('f9/menu.html', true);
      } catch (e) {
        console.log(e);
      }
      try {
        // eslint-disable-next-line no-undef
        webkit.messageHandlers.isShowSideslip.postMessage({
          url: 'f9/menu.html',
          isShow: true,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
