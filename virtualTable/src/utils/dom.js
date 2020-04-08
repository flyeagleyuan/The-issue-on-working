import { camelCase } from 'lodash';
import { getAppFrom } from '@/utils/appAssist';

/**
 * 添加水印
 * @param {Number} size 设计图尺寸
 */
export const addWaterMark = (size = 750) => {
  let appFrom = getAppFrom();
  if (appFrom && appFrom !== 'finchina') return;

  let waterMark = document.createElement('img');

  waterMark.style.cssText = 'position: fixed; z-index: -1; bottom: .36rem; right: .36rem; opacity: 0.0001;';
  waterMark.src = location.origin + '/finchinaAPP/static/waterMark.png';

  document.getElementsByTagName('body')[0].appendChild(waterMark);

  let rate = size / 750;
  waterMark.onload = function() {
    waterMark.style.cssText =
      'position: fixed; z-index: 9; bottom: ' +
      0.36 * rate +
      'rem; right: ' +
      0.36 * rate +
      'rem; opacity: 0.5;' +
      ' width: ' +
      (waterMark.naturalWidth / 100) * rate +
      'rem; height: ' +
      (waterMark.naturalHeight / 100) * rate +
      'rem;';
  };
};

/**
 * 页面尺寸初始化
 * @param {Boolean} rotate 是否可转置
 * @param {Boolean} isAddWaterMark 是否添加水印
 * @param {Number} designWidth 设计图尺寸
 */
export const resize = ({ rotate = true, isAddWaterMark = true, designWidth = 750 } = {}) => {
  const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

  const changeView = () => {
    /*let width = document.body.clientWidth || document.documentElement.clientWidth,
      height = document.body.clientHeight || document.documentElement.clientHeight;*/
    let width = $(window).width(),
      height = $(window).height();

    if (rotate) {
      if (width > height) {
        [width] = [height, width];
      }

      let limit = isIOS ? 340 : 320; //解决横屏宽度判断问题
      if (width < limit) {
        let screen = window.screen;
        width = screen[screen.width > screen.height ? 'height' : 'width'];
        if (width < 320) width = 320;
      }
    }

    if (width > 750) width = 750;

    document.getElementsByTagName('html')[0].style.setProperty('font-size', (100 * width) / designWidth + 'px');
    document.getElementsByTagName('body')[0].style.setProperty('visibility', 'visible');

    if (!width) {
      setTimeout(changeView, 20);
    }
  };

  changeView();

  if (isAddWaterMark) {
    addWaterMark(designWidth);
  }
};

/**
 * 移动端滚动处理，解决移动端滚动穿透
 * @param {HTMLElement} element 需要进行滚动处理的元素
 */
export const smartScroll = element => {
  let events;

  const data = {
    posY: 0,
    maxScrollDistance: 0,
  };

  element.addEventListener('touchstart', function(e) {
    events = e.touches[0] || e;

    data.posY = events.pageY;
    data.maxScrollDistance = element.scrollHeight - element.clientHeight;
  });

  element.addEventListener('touchmove', function(e) {
    events = e.touches[0] || e;

    const distanceY = events.pageY - data.posY;

    //到达顶部与达到底部阻止
    if ((distanceY > 0 && element.scrollTop === 0) || (element.scrollTop === data.maxScrollDistance && distanceY < 0)) {
      e.preventDefault();
    }
  });
};

export function dataset(el, key, value) {
  const prefix = 'data-';
  const name = prefix + key;
  if (typeof value !== 'undefined') {
    return el.setAttribute(name, value);
  } else {
    return el.getAttribute(name);
  }
}

const elementStyle = document.createElement('div').style;

const vendor = (() => {
  let transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export const prefixStyle = style => {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  const camelCaseStyle = camelCase(style);

  return vendor + camelCaseStyle.charAt(0).toUpperCase() + camelCaseStyle.substr(1);
};

export const getResizeFontSize = ({ rem, designWidth = 750 }) => {
  let width = document.body.clientWidth || document.documentElement.clientWidth;

  const fontSize = (100 * width) / designWidth;

  return rem * fontSize;
};
