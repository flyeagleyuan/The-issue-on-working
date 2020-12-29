/**
 * @author Leevare Email:liwei2@finchina.com
 * @date 2019/4/4 11:36
 * @description APP内部功能调用函数封装，更多详细配置信息介绍见SVN相关文档说明
 */
import { removeObjectNil } from '@/utils/utils';
import { urlQueriesSerialize } from '@/utils/urls';

/**
 * 预加载
 * @param url webview中页面的地址，相对于"https://appdev.finchina.com/finchinaAPP/"路径下
 */
export const appPreLoad = url => {
  location = `https://ari.finchina.com/finchinaAPP/OpenLeftDraw?link=${encodeURIComponent(url)}`;
};

/* eslint-disable */
/**
 * 展开左侧嵌套webview，同左侧树菜单
 * @param {String} url webview中页面的地址，相对于"https://appdev.finchina.com/finchinaAPP/"路径下
 */
export const appOpenLeftWindow = url => {
  try {
    window.jsi.isShowSideslip(url, true);
  } catch (e) {}
  try {
    webkit.messageHandlers.isShowSideslip.postMessage({
      url: url,
      isShow: true,
    });
  } catch (e) {}
};

export const getAppFrom = () => {
  let appFrom = window.appType;

  try {
    appFrom = window.jsi.getAppType();
  } catch (e) {}

  return appFrom;
};

/**
 * 头部收缩与展开
 * @param {Boolean} isCollapse 是否收起 true：收起，false：展开
 */
export const appCollapse = isCollapse => {
  try {
    webkit.messageHandlers.setStick.postMessage(isCollapse);
  } catch (e) {}
  try {
    window.jsi.setStick(isCollapse);
  } catch (e) {}
};
/* eslint-enable */

/**
 * app弹窗
 * @param {String} title 标题
 * @param {String} message 描述文字
 * @param {String} okname 确定按钮文字
 * @param {String} cancelname 取消按钮名字
 * @param {String} oklink 确认事件链接
 * @param {String} cancellink 取消事件链接
 */
export const appAlert = ({ title, message, okname, cancelname, oklink, cancellink } = {}) => {
  location = `fcnews://alert${urlQueriesSerialize(
    removeObjectNil({
      title,
      message,
      okname,
      cancelname,
      oklink,
      cancellink,
    })
  )}`;
};

/**
 * * 组合web页面
 * @param {String} title 页面标题
 * @param {String} subTitle 页面子标题
 * @param {String} placeholder 搜索框的placeholder
 * @param {Array} datas 页面数组
 * [
 *   {url: "test0.html",  "name": "test0"},
 *   {"url": "test1.html",  "name": "test1"}
 * ]
 * 打开页面时，会把user, token以url参数的形式传给页面
 * @param {Number} selectedIndex 默认选中的页面索引
 * @param {Number} hideTopView （默认是0）	是否隐藏topView
 * @param {Number} hideSearch （默认是1）  是否隐藏搜索框
 * @param {String} searchResultLink 如果有搜索框，传值不为空时，搜索内容时，会弹出此页面，作为键盘宝页面，点击键盘宝页面搜索结果，传参给主页面。
 * @param {String} helpLink 帮助链接
 */
export const appCombinePage = ({
  title,
  subTitle,
  placeholder,
  datas,
  selectedIndex,
  hideTopView = 0,
  hideSearch = 1,
  searchResultLink,
  helpLink,
} = {}) => {
  location = `fcnews://websPage?${urlQueriesSerialize(
    removeObjectNil({
      title,
      subTitle,
      placeholder,
      datas: datas ? encodeURIComponent(JSON.stringify(datas)) : null,
      selectedIndex,
      hideSearch,
      hideTopView,
      searchResultLink,
      helpLink,
    })
  )}`;
};

/**
 * 组合web页面集合
 * @param {Number} index 选中的索引
 * @param {Array} datas 页面数组(和组合web页面数据结构一致)
 */
export const appCombinePages = (index, datas = []) => {
  location = `fcnews://websPageGroup?selectedIndex=${index}&datas=${encodeURIComponent(JSON.stringify(datas))}`;
};

/**
 * 选中页面搜索结果
 * @param {String} text searchBar展示文字
 * @param result 回传给页面的搜索关键词
 */
export const appSelectSearchResult = (text, result) => {
  location = `fcnews://searchSelectedHandler?${urlQueriesSerialize(removeObjectNil({ text, result }))}`;
};

/**
 * 研究报告
 * @param {String} seminarCodes 研究报告分类组合id，可为空，为空时跳转到研究报告主页面
 */
export const appResearchReport = (seminarCodes = '') => {
  location = `fcnews://researchReport?seminarCodes=${seminarCodes}`;
};

// 扫描二维码
export const appScanQRCode = () => {
  location = 'fcnews://qrcodeScan';
};

/**
 * 打开网页
 * @param {String} link 页面地址，打开页面标题为网页的标题
 */
export const appOpenPage = (link = '') => {
  location = `fcnews://webviewPage?link=${link}`;
};

// 原生搜索框内容
export const appSetSearchBarText = (text = '') => {
  location = `fcnews://setSearchBarText?text=${text}`;
};

// 意见反馈
export const appFeedback = () => {
  location = 'fcnews://chat/feedback';
};

// 签到
export const appCheckIn = () => {
  location = 'https://ari.finchina.com/finchinaAPP/checkIn';
};

// 搜新闻
export const appSearchNews = () => {
  location = 'https://ari.finchina.com/finchinaAPP/newsSearch';
};

// 搜公告
export const appSearchAnnouncement = () => {
  location = 'https://ari.finchina.com/finchinaAPP/noticeSearch';
};

// 查关系
export const appSearchRelationship = ({ from, to, fromType, toType, addition }) => {
  return (
    'fcnews://relationshipMap' +
    urlQueriesSerialize(
      removeObjectNil({
        from,
        to,
        fromType,
        toType,
        addition: typeof addition !== 'undefined' ? JSON.stringify(addition) : null,
      })
    )
  );
};

// 查受益所有人
export const appSearchBeneficiary = () => {
  location = 'https://ari.finchina.com/finchinaAPP/profitSearch';
};

// 版本检测
export const appCheckVersion = () => {
  location = 'https://ari.finchina.com/finchinaAPP/checkLasterVersion';
};

/* eslint-disable */
// 获取原始版本号，如v3.4.1
export const appGetVersion = () => {
  let appVersion = window.appVersion;
  try {
    appVersion = window.jsi.appVersion();
  } catch (e) {}
  return appVersion;
};
/* eslint-enable */

// 获取版本号数值，如3.41
export const appGetVersionNumber = () => {
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
};

/* eslint-disable */
/**
 * 切换横竖屏
 * @param toHorizontal true表示切换为横屏
 */
export const changeViewPort = toHorizontal => {
  try {
    webkit.messageHandlers.changeView.postMessage(toHorizontal);
  } catch (error) {}
  try {
    window.jsi.changeView(toHorizontal);
  } catch (e) {}
};
/* eslint-enable */

// 跳转F9首页 code必须为10位代码
export const getF9Link = ({ type, name, code }) => 'fcnews://item' + urlQueriesSerialize({ type, name, id: code });
