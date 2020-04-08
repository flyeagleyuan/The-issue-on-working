import { getClassNames } from './utils';

/**
 * 获取宽度
 * @param {string | number} width 宽度
 * @param {string | number} defaultWidth 默认宽度
 */
function getWidth(width, defaultWidth = '2rem') {
  if (!width) return defaultWidth;
  return typeof width === 'number' ? `${width}px` : width;
}

export const styleMixin = {
  methods: {
    classNames(classes) {
      return getClassNames(classes, this.prefix);
    },
    isSticky(column) {
      return [true, 'left', 'right'].includes(column.fixed);
    },
    getColumnStyle(column) {
      const fixedLeftStyle =
        column.fixed === true || column.fixed === 'left'
          ? { position: 'sticky', left: column['_offset'] + 'px', zIndex: 1 }
          : {};
      const fixedRightStyle =
        column.fixed === 'right' ? { position: 'sticky', right: column['_offset'] + 'px', zIndex: 1 } : {};
      return Object.assign(
        {
          width: getWidth(column.width),
        },
        fixedLeftStyle,
        fixedRightStyle
      );
    },
  },
};
