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
  return `https://ari.finchina.com/finchinaAPP/OpenLeftDraw?link=${encodeURIComponent(url)}`;
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
  return `fcnews://alert${urlQueriesSerialize(
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
  console.log();
  return `fcnews://websPage${urlQueriesSerialize(
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
  return `fcnews://websPageGroup?selectedIndex=${index}&datas=${encodeURIComponent(JSON.stringify(datas))}`;
};

/**
 * 选中页面搜索结果
 * @param {String} text searchBar展示文字
 * @param result 回传给页面的搜索关键词
 */
export const appSelectSearchResult = (text, result) => {
  return `fcnews://searchSelectedHandler?${urlQueriesSerialize(removeObjectNil({ text, result }))}`;
};

/**
 * 研究报告
 * @param {String} seminarCodes 研究报告分类组合id，可为空，为空时跳转到研究报告主页面
 */
export const appResearchReport = (seminarCodes = '') => {
  return `fcnews://researchReport?seminarCodes=${seminarCodes}`;
};

// 扫描二维码
export const appScanQRCode = () => {
  return 'fcnews://qrcodeScan';
};

/**
 * 打开网页
 * @param {String} link 页面地址，打开页面标题为网页的标题
 */
export const appOpenPage = (link = '') => {
  return `fcnews://webviewPage?link=${link}`;
};

// 原生搜索框内容
export const appSetSearchBarText = (text = '') => {
  return `fcnews://setSearchBarText?text=${text}`;
};

// 意见反馈
export const appFeedback = () => {
  return 'fcnews://chat/feedback';
};

// 签到
export const appCheckIn = () => {
  return 'https://ari.finchina.com/finchinaAPP/checkIn';
};

// 搜新闻
export const appSearchNews = () => {
  return 'https://ari.finchina.com/finchinaAPP/newsSearch';
};

// 搜公告
export const appSearchAnnouncement = () => {
  return 'https://ari.finchina.com/finchinaAPP/noticeSearch';
};

// 查关系
export const appSearchRelationship = () => {
  return 'https://ari.finchina.com/finchinaAPP/relationshipSearch';
};

// 查受益所有人
export const appSearchBeneficiary = () => {
  return 'https://ari.finchina.com/finchinaAPP/profitSearch';
};

// 版本检测
export const appCheckVersion = () => {
  return 'https://ari.finchina.com/finchinaAPP/checkLasterVersion';
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
  let _version = appGetVersion();
  if (_version) {
    let version = _version.replace(/[a-zA-Z]*(.+)/, '$1');
    const index = version.indexOf('.');
    if (index > -1) {
      version = version.substring(0, index) + '.' + version.substr(index).replace(/\./g, '');
    }
    versionNumber = parseFloat(version);
  }
  return versionNumber && !Number.isNaN(versionNumber) ? versionNumber : 0;
};

/* eslint-disable */
//发送当前查询后台接口参数至APP
export const sendCondition = condition => {
  /*
  let strCondtion = JSON.stringify(condition);
  try {
    window.jsi.downloadCondition(strCondtion);
  } catch (e) {}
  try {
    webkit.messageHandlers.downloadCondition.postMessage(strCondtion);
  } catch (e) {}
  */
  try {
    webkit.messageHandlers.downloadCondition.postMessage(JSON.stringify(condition));
  } catch (e) {}
  try {
    window.jsi.downloadCondition(JSON.stringify(condition));
  } catch (e) {}
};

/**
 * 弹窗
 * @param title
 * @param iconUrl
 * @param message
 * @param buttons [{title, titleColor, action}]
 */
export const appModalAlert = ({ title = '', iconUrl = '', message = '', buttons = [] }) => {
  const str = JSON.stringify({ title, iconUrl, message, buttons });
  try {
    window.jsi.Alert(str);
  } catch (e) {
    try {
      webkit.messageHandlers.Alert.postMessage(str);
    } catch (e) {
      throw e;
    }
  }
};
/* eslint-enable */

//发送横竖屏设置
export const viewChange = isLandscape => {
  /* eslint-disable */
  try {
    webkit.messageHandlers.changeView.postMessage(isLandscape);
  } catch (error) {}
  try {
    window.jsi.changeView(isLandscape);
  } catch (e) {}
  /* eslint-disable */
};

//去掉橡皮精设置
export const isBounceEnable = isEnable => {
  /* eslint-disable */
  try {
    webkit.messageHandlers.isBounceEnable.postMessage(isEnable);
  } catch (error) {}
  try {
    window.jsi.isBounceEnable(isEnable);
  } catch (e) {}
  /* eslint-disable */
};
