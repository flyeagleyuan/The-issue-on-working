<!--只有纵向能够滚动，横向不可以-->
<template>
  <div class="flex-column relative">
    <div class="arrow-wrapper" :style="{ left: fixedTableWidthTotal }" v-if="items.length && normalColumns.length > 2">
      <span class="left"></span>
      <span class="right"></span>
    </div>
    <div class="flex-column flex-auto over-auto fixed-table" :class="tableClass" ref="fixedTable" v-if="items.length">
      <div v-html="getWidthStyle()" style="display: none">
        <div class="flex-row flex-none">
          <div class="flex-none">
            <div class="custom-table-layout">
              <div class="table-row">
                <div class="teble-head index"><span></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-prototype-builtins */

import { chunk, isEmpty } from 'lodash';

function getAndroidVersion() {
  const ua = navigator.userAgent.toLowerCase();
  let version = null;
  if (ua.indexOf('android') > 0) {
    const reg = /android [\d._]+/gi;
    const v_info = ua.match(reg);
    version = (v_info + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.'); //得到版本号4.2.2
    version = parseInt(version.split('.')[0]); // 得到版本号第一位
  }

  return version;
}
export default {
  name: 'TableScrollView',
  props: {
    //高亮激活项目时，不管是否在当前数据中找到，是否都显示，默认找不到不显示
    activeItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //是否展示索引
    showIndex: {
      type: Boolean,
      default: true,
    },
    //索引列宽度
    indexWidth: {
      type: String,
      default: '1rem',
    },
    //索引显示文字
    indexLabel: {
      type: String,
      default: '序号',
    },
    //列宽度
    colWidth: {
      type: [String, Number],
      default: '2rem',
    },
    //索引class
    indexClass: {
      type: String,
      default: 'index-cell',
    },
    //表格标题class
    titleClass: String,
    //激活行class
    activeClass: {
      type: String,
      default: 'active-cell',
    },
    activeFixedClass: {
      type: String,
      default: 'active-cell',
    },
    //表格Class
    tableClass: {
      type: String,
      default: 'fix-table',
    },
    //表格行class
    rowClass: {
      type: String,
      default: 'table-row',
    },
    //表格头class
    tableHeadClass: {
      type: String,
      default: 'table-head',
    },
    //表格列class
    cellClass: {
      type: String,
      default: 'table-cell',
    },
    //数据内容，格式应该为[{name1: value1, name2: value2}]，name为column中的name字段名
    items: {
      type: Array,
      default: () => [],
    },
    //固定的列，此处应传递column中要固定的name数组
    fixedCols: {
      type: Array,
      default: () => [],
    },
    //列属性
    // 配置选项如下
    /*const columns = [{
      // 列字段名
      name: String,
      // 显示名称
      label: String,
      // 对齐方式
      align?: String,
      // 是否支持排序，传入function为自定义排序规则，且默认使用该规则进行初始化排序
      // function类似sort回调
      sort?: Boolean | Function,
      // 列显示模板，可以在此处自定义列的显示模板，当然你也可以使用slot
      template?: function(column, item) {},
      // 列宽度
      width?: String | Number,
      // 列class
      // function(column, item) {}
      className?: String | Function,
      // 单元格点击事件
      onClick?: function(column, item) {}
    }]*/
    columns: {
      type: Array,
      default: () => [],
    },
    //向右拖动加载
    dragRightLoad: {
      type: Boolean,
      default: false,
    },
    //距离右侧指定距离开始加载
    dragRightDistance: {
      default: 120,
      validator: value => typeof value === 'number' && value >= 50,
    },
    //上拉加载
    dragBottomLoad: {
      type: Boolean,
      default: false,
    },
    //距离底部指定距离开始加载
    dragBottomDistance: {
      default: 400,
      validator: value => typeof value === 'number' && value >= 50,
    },
    //这些数据表示为空数据，在去除空行活空列的时候会将其去除
    blankPlaceholder: {
      type: [String, Array],
      default: '',
    },
    //是否去除空行
    removeBlankRow: {
      type: [Boolean, Function],
      default: false,
    },
    //是否去除空列
    removeBlankCol: {
      type: [Boolean, Function],
      default: false,
    },
    //唯一标识符，用于比对activeItem，在传递activeItem时，此项是必传的
    uniqueKey: String,
    // 自动左右等高布局，尽量少使用，比较消耗性能
    // to-right 以左侧行高度为基准
    // to-left 以右侧为基准
    // left-right 以左右最高行为基准
    contourLayout: {
      default: false,
      validator: value => {
        return ['to-right', 'to-left', 'left-right'].includes(value) || typeof value === 'boolean';
      },
    },
    //切割行显示，指定每次显示行数，会操作本地数据，随着上拉动态渲染
    //如果行数过多，可以开启此选项，以保证页面快速渲染，为0标识不开启
    pageRowSize: {
      default: 0,
      validator: value => typeof value === 'number' && value >= 0,
    },
    // 切割列显示，指定每次显示列数，会操作本地数据，随着向右拖动动态渲染
    // 如果列数过多，可以开启此选项，以保证页面快速渲染，为0表示不开启
    pageColSize: {
      default: 0,
      validator: value => typeof value === 'number' && value >= 0,
    },
    // 当数据发生变化时，立即排序，默认排序第一个自定义sort的列
    // 如不存在自定义sort列，则对可排序列的第一列进行倒序排序
    onChangeSort: {
      default: true,
      type: Boolean,
    },
    // 虚拟滚动，开发中...
    virtualScroll: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      showItems: [],
      showSlicedItems: [],
      showColumns: [],
      originItems: [],
      originColumns: [],
      sortTableDesc: {},
      sliceScrollTop: 0,
    };
  },
  created() {
    this.firstTouchPos = {};
    this.firstSort = true;
    this.scrollTop = 0;
    this.init();
  },
  computed: {
    fixedColumns() {
      return this.fixedCols
        .map(fixedCol => {
          const index = this.showColumns.findIndex(col => col.name === fixedCol);
          if (index > -1) {
            return this.showColumns[index];
          }
          return null;
        })
        .filter(Boolean);
    },
    fixedColWidths() {
      let widths = this.fixedColumns.map(column => {
        const width = this.handleWidth(column.width);
        return (width && width.width) || this.calcColWidthWithUnit.width + this.calcColWidthWithUnit.unit;
      });
      if (this.indexWidth && this.showIndex) {
        return [this.indexWidth, ...widths];
      }
      if (!this.indexWidth && this.showIndex) {
        return [this.calcColWidthWithUnit.with + this.calcColWidthWithUnit.unit, ...widths];
      }
      if (!this.showIndex) {
        return widths;
      }
    },
    calcColWidthWithUnit() {
      const colWith = typeof this.colWidth === 'string' ? this.colWidth : `${this.colWidth}`;
      const num = parseFloat(colWith, 10),
        unit = colWith.replace(num, '');
      return unit ? { width: num, unit } : { width: num, unit: 'px' };
    },
  },
  methods: {
    init() {
      this.isSorted = false;
      if (Object.keys(this.activeItem).length && !this.uniqueKey) {
        throw new Error('当传递activeItem时，unique-key是必传的，该值为"columns"中唯一字段，用于约束值的唯一性');
      }
      this.items.length && this._handleInitItems();
      this.columns.length && this._handleInitColumns();
    },
    initSort() {
      if (this.isSorted) return;
      this.isSorted = true;
      let column = this.showColumns.find(column => typeof column.sort === 'function');
      const defaultSortColumn = this.showColumns.find(column => column.sort && column.isDefaultSort);
      if (!defaultSortColumn) {
        column = column || this.showColumns.find(column => column.sort);
      } else {
        column = defaultSortColumn;
      }
      if (column && this.showItems.length) {
        this.$nextTick(() => {
          this.onSort(column);
        });
        setTimeout(() => {
          this._resetDom();
        }, 20);
      }
    },
    getColsStyle(widths, parentClass, isHead) {
      const cellClass = isHead ? this.tableHeadClass : this.cellClass;
      const styles = widths
        .map((width, index) => {
          return `${parentClass} .${this.rowClass} .${cellClass}:nth-of-type(${index + 1}) {width:${width};}\n`;
        })
        .join('');
      return `${styles}`;
    },
    getWidthStyle() {
      const styles = [
        this.getColsStyle(this.fixedColWidths, 'eZRM70OXzbq', true),
        this.getColsStyle(this.normalColWidths, 'nwEGfl4zkYCJ', true),
        this.getColsStyle(this.fixedColWidths, 'I2gGZHz04ejj'),
        this.getColsStyle(this.normalColWidths, 'xG095NAjvhz5'),
      ];
      return `<style>${styles.join('')}</style>`;
    },
    //处理自定义模板，初始化时调用
    handleCustomTemplate(items) {
      if (!items) return;
      const customColumns = this.originColumns.filter(col => col.template && typeof col.template === 'function');
      if (!customColumns.length) return items;
      const cols = customColumns.map(column => String(column.name)),
        callbacks = customColumns.map(column => column.template);
      return items.map(item => {
        item._template = {};
        Object.keys(item).forEach(key => {
          const index = cols.indexOf(key);
          if (index > -1) {
            item._template[key] = callbacks[index].call(null, cols[index], item, index);
          }
        });
        return item;
      });
    },
    getTableSpecifyColumn(items, col) {
      let values = [];
      items.forEach(item => {
        values.push(item[col]);
      });
      return values;
    },
    onSort(column) {
      if (!column.hasOwnProperty('sort')) return;
      this.$refs['main-table'].scrollTop = 0;
      Object.keys(this.sortTableDesc).forEach(key => {
        if (key !== String(column.name)) {
          delete this.sortTableDesc[key];
        }
      });
      //用户自定义的排序
      const value = this.getTableSpecifyColumn(this.originItems, column.name);
      if (typeof column.sort === 'function') {
        this.originItems = this.originItems.sort((a, b) => {
          if (a[column.name] === '') {
            return 1;
          } else if (b[column.name] === '') {
            return -1;
          }
          return this.sortTableDesc[column.name] ? column.sort(b, a) : column.sort(a, b);
        });
        //第一次进入时，比对当前排序顺序，以正确显示排序图标
        if (this.firstSort) {
          let aIsBiggerCount = 0;
          const len = this.originItems.filter(item => item[column.name] !== '').length;
          if (/^[\u4E00-\u9FA5]+/.test(value)) {
            this.originItems.forEach((item, index) => {
              if (
                index < len - 1 &&
                item[column.name].localeCompare(this.originItems[index + 1][column.name], 'zh') >= 0
              ) {
                aIsBiggerCount++;
              }
            });
          } else {
            this.originItems.forEach((item, index) => {
              if (index < len - 1 && item[column.name] >= this.originItems[index + 1][column.name]) {
                aIsBiggerCount++;
              }
            });
          }
          this.sortTableDesc[column.name] = aIsBiggerCount === len - 1;
          this.firstSort = false;
        } else {
          this.sortTableDesc[column.name] = !this.sortTableDesc[column.name];
        }
        if (this.pageRowSize > 0) {
          this.rowChunks = chunk(this.originItems, this.pageRowSize);
          this.showItems = this.handleCustomTemplate(this.originItems).slice(0, this.showItems.length);
          this.showSlicedItems = this.showItems.slice(0, this.virtualScrollLength);
        }
        this.$emit('onSort', column);
        return;
      }
      this.sortTableDesc[column.name] = !this.sortTableDesc[column.name];

      if (/^[\u4E00-\u9FA5]+/.test(value)) {
        this.originItems = this.originItems.sort((a, b) => {
          if (a[column.name] === '') {
            return 1;
          } else if (b[column.name] === '') {
            return -1;
          }
          return this.sortTableDesc[column.name]
            ? b[column.name].localeCompare(a[column.name], 'zh')
            : a[column.name].localeCompare(b[column.name], 'zh');
        });
      } else {
        this.originItems = this.originItems.sort((a, b) => {
          if (a[column.name] === '') {
            return 1;
          } else if (b[column.name] === '') {
            return -1;
          }
          return this.sortTableDesc[column.name] ? b[column.name] - a[column.name] : a[column.name] - b[column.name];
        });
      }

      if (this.pageRowSize > 0) {
        this.rowChunks = chunk(this.originItems, this.pageRowSize);
        this.showItems = this._handleCustomTemplate(this.originItems).slice(0, this.showItems.length);
        this.showSlicedItems = this.showItems.slice(0, this.virtualScrollLength);
      }
      this.$emit('onSort', column);
    },
    _resetDom() {
      if (this.contourLayout) {
        let tableMainEl = this.$refs.t3,
          tableMainFixedLeftEl = this.$refs.t3Fixed;
        const tableMainTrEls = tableMainEl.querySelectorAll('.' + this.rowClass),
          tableMainFixedLeftTrEls = tableMainFixedLeftEl.querySelectorAll('.' + this.rowClass);

        //安卓9bug
        const hasAndroidBug = getAndroidVersion() >= 9;

        switch (this.contourLayout) {
          case 'to-right':
          case true:
            [...tableMainFixedLeftEl].forEach((leftTr, index) => {
              setHeight(tableMainTrEls[index], leftTr.offsetHeight);
              hasAndroidBug && setHeight(tableMainFixedLeftTrEls[index], leftTr.offsetHeight);
            });
            break;
          case 'to-left':
            [...tableMainTrEls].forEach((tableMainTr, index) => {
              setHeight(tableMainFixedLeftTrEls[index], tableMainTr.offsetHeight);
              hasAndroidBug && setHeight(tableMainTrEls[index], tableMainTr.offsetHeight);
            });
            break;
          case 'left-right':
            [...tableMainFixedLeftTrEls].forEach((leftTr, index) => {
              const leftTrHeight = leftTr.offsetHeight,
                MainTrHeight = tableMainTrEls[index].offsetHeight;
              if (leftTrHeight > MainTrHeight) {
                setHeight(tableMainTrEls[index], leftTrHeight);
                hasAndroidBug && setHeight(tableMainFixedLeftTrEls[index], leftTrHeight);
              } else if (MainTrHeight > leftTrHeight) {
                setHeight(tableMainFixedLeftTrEls[index], MainTrHeight);
                hasAndroidBug && setHeight(tableMainTrEls[index], MainTrHeight);
              }
            });
        }
      }
      function setHeight(el, height) {
        el.style.height = height + 'px';
      }
    },
    _handleInitItems() {
      let originItems = $.extend(true, [].this.items);
      if (this.removeBlankRow) {
        const columnsKey = this.columns.map(column => column.name).filter(d => this.fixedCols.indexOf(d) === -1);
        originItems = originItems.filter((item, index) => {
          return !Object.keys(item).every(key => {
            if (columnsKey.index(key) > -1) {
              if (typeof this.removeBlankRow === 'function') {
                return this.removeBlankRow.call(null, key, item, index);
              } else {
                return (
                  (Array.isArray(this.blankPlaceholder)
                    ? this.blankPlaceholder.indexOf(item[key]) > -1
                    : item[key] === this.blankPlaceholder) || typeof item[key] === 'undefined'
                );
              }
            }
            return true;
          });
        });
      }
      this.originItems = originItems;
      this.sortTableDesc = {};
      if (this.pageRowSize > 0) {
        this.rowChunks = chunk(this.originItems, this.pageRowSize);
        this.chunkRowIndex = 0;
        this.showItems = this.handleCustomTemplate(this.rowChunks[this.chunkRowIndex]);
        this.chunkRowIndex++;
      } else {
        this.showItems = this.handleCustomTemplate();
      }
      this.$nextTick(() => {
        this._resetDom();
      });
      if (this.virtualScroll) {
        this.$nextTick(() => {
          const row1Els = this.$refs.row1,
            row2Els = this.$refs.row2,
            row1Height = row1Els ? row1Els[0].clientHeight : 0,
            row2Height = row2Els ? row2Els[0].clientHeight : 0;
          this.rowHeight = Math.max(row1Height, row2Height);
          this.virtualScrollLength = Math.ceil(window.innerHeight / this.rowHeight);
          this.showSlicedItems = this.showItems.slice(0, this.virtualScrollLength);
          this.shimEl = this.$refs.shim;
        });
      }
    },
    _handleInitColumns() {
      this.isSorted = false;
      let originColumns = $.extend(true, [], this.columns);
      if (this.removeBlankCol && !isEmpty(this.items)) {
        originColumns = originColumns.filter(column => {
          return !this.items.every(item => {
            if (typeof this.removeBlankCol === 'function') {
              return this.removeBlankCol.call(null, column.name, item);
            } else {
              return (
                (Array.isArray(this.blankPlaceholder)
                  ? this.blankPlaceholder.indexOf(item[column.name]) > -1
                  : item[column.name] === this.blankPlaceholder) || typeof item[column.name] === 'undefined'
              );
            }
          });
        });
      }
      this.originColumns = originColumns;
      if (this.pageColSize > 0) {
        this.colChunks = chunk(this.originColumns, this.pageColSize);
        this.chunkColumnIndex = 0;
        this.showColumns = this.colChunks[this.chunkColumnIndex++];
      } else {
        this.showColumns = this.originColumns;
      }
      this.$nextTick(() => {
        this.onChangeSort && this.initSort();
        const t1El = this.$refs.t1,
          t2El = this.$refs.t2,
          t3El = this.$refs.t3;
        if (t1El) {
          t1El.scrollLeft = 0;
        }
        if (t2El) {
          t2El.scrollLeft = 0;
        }
        if (t3El) {
          t3El.scrollLeft = 0;
        }
      });
    },
  },
  watch: {
    items() {
      if (!this.columnInited) {
        this._handleInitColumns();
      }
      this._handleInitItems();
    },
    columns() {
      this.columnInited = false;
      if (!isEmpty(this.items)) {
        this._handleInitColumns();
        this.columnInited = true;
      }
    },
    showColumns() {
      this.$nextTick(() => {
        this._resetDom();
      });
    },
  },
};
</script>

<style lang="less">
@import './table';
</style>
<style scoped lang="less">
.will-change-scroll {
  will-change: scroll-position;
}

.overflowX-hidden {
  overflow-x: hidden;
}

.arrow-wrapper {
  position: absolute;
  height: 0.64rem;
  right: 0;

  .left,
  .right {
    position: absolute;
    height: 100%;
    width: 0.2rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    text-align: center;

    &:before {
      content: '';
      display: inline-block;
      border: 0.1rem solid;
    }
  }

  .left {
    left: -0.05rem;
  }

  .right {
    right: -0.05rem;
    padding-left: 0.05rem;
  }

  .left:before {
    border-color: transparent #8c8c8c transparent transparent;
  }

  .right:before {
    border-color: transparent transparent transparent #8c8c8c;
  }
}
</style>
