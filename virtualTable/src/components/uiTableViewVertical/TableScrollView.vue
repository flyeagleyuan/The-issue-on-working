<template>
  <div class="flex-column relative">
    <div class="arrow-wrapper" :style="{ left: fixedTableWidthTotal }" v-if="showArrow">
      <span class="left"></span>
      <span class="right"></span>
    </div>
    <div class="flex-column flex-auto over-auto fixed-table" :class="tableClass" ref="fixedTable" v-if="items.length">
      <div v-html="getWidthStyles()" style="display: none"></div>
      <div class="flex-row flex-none">
        <div class="flex-none" v-if="canShowFixed">
          <div class="custom-table-layout eZRM70OXzbq" :style="`width: ${fixedTableWidthTotal}`">
            <div :class="showRowClass" class="table-row">
              <div v-if="showIndex" :class="[titleClass, showHeadClass, indexClass]" class="table-head index">
                <span>{{ indexLabel }}</span>
              </div>
              <div
                v-for="(column, index) in fixedColumns"
                ref="fixHead"
                :class="[
                  showHeadClass,
                  titleClass,
                  { desc: sortTableDesc[column.name], asc: sortTableDesc[column.name] === false },
                  columnAlign(column),
                ]"
                class="table-head"
                :key="index"
                @click="onSort(column)"
              >
                <slot :name="column.slot ? column.slot + '-head-fixed' : 'head-fixed'" :column="column"
                  ><span>{{ column.label }}</span>
                </slot>
              </div>
            </div>
          </div>
        </div>
        <div
          class="table flex-auto over-x-auto no-scroll-bar"
          ref="t1"
          @touchstart="onTouch($refs.t1)"
          @scroll.passive="handleFollowScroll($refs.t1, $refs.t2, $refs.t3)"
        >
          <div class="custom-table-layout nwEGfl4zkYCJ main-table-layout" :style="`width: ${normalTableWidthTotal};`">
            <div :class="showRowClass" class="table-row">
              <div
                v-if="showIndex && !fixedCols.length"
                :class="[showHeadClass, titleClass, indexClass]"
                class="table-head index"
              >
                <span>{{ indexLabel }}</span>
              </div>
              <div
                v-for="(column, index) in normalColumns"
                :class="[
                  showHeadClass,
                  titleClass,
                  { desc: sortTableDesc[column.name], asc: sortTableDesc[column.name] === false },
                  columnAlign(column),
                ]"
                class="table-head"
                ref="head"
                :key="index"
                @click="onSort(column)"
              >
                <slot name="head-main" :column="column"
                  ><span>{{ column.label }}</span></slot
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row flex-none table-active" v-if="canShowActiveRow">
        <div class="flex-none" v-if="canShowFixed">
          <div class="custom-table-layout I2gGZHz04ejj" :style="`width: ${fixedTableWidthTotal};`">
            <div :class="showRowClass" class="active-row table-row">
              <div
                v-if="showIndex && fixedCols.length"
                class="table-cell index"
                :class="[showCellClass, activeFixedClass, indexClass]"
              >
                {{ calcActiveItemIndex }}
              </div>
              <div
                v-for="(column, index) in fixedColumns"
                :class="[showCellClass, activeFixedClass, columnAlign(column)]"
                class="table-cell"
                :key="index"
                @click="handleCellClick(column, showTableActiveItem)"
              >
                <template v-if="fixedCols.includes(column.name)">
                  <slot
                    :name="column.slot ? column.slot + '-active-fixed' : 'active-fixed'"
                    :value="showTemplate(showTableActiveItem, column) || showTableActiveItem[column.name]"
                    :item="showTableActiveItem"
                    :column="column"
                  >
                    <div
                      v-html="showTemplate(showTableActiveItem, column) || showTableActiveItem[column.name]"
                      class="text-ellipse"
                    ></div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex-auto over-x-auto no-scroll-bar"
          ref="t2"
          @touchstart="onTouch($refs.t2)"
          @scroll.passive="handleFollowScroll($refs.t2, $refs.t1, $refs.t3)"
        >
          <div class="custom-table-layout xG095NAjvhz5" :style="`width: ${normalTableWidthTotal};`">
            <div :class="showRowClass" class="active-row table-row">
              <div v-if="showIndex && !fixedCols.length" :class="[showCellClass, activeClass]" class="table-cell index">
                {{ calcActiveItemIndex }}
              </div>
              <div
                v-for="(column, index) in rightColumns"
                :key="index"
                :class="[showCellClass, activeClass, columnAlign(column)]"
                class="table-cell"
                @click="handleCellClick(column, showTableActiveItem)"
              >
                <template v-if="!fixedCols.includes(column.name)">
                  <slot
                    :name="column.slot ? column.slot + '-active-main' : 'active-main'"
                    :value="showTemplate(showTableActiveItem, column) || showTableActiveItem[column.name]"
                    :item="showTableActiveItem"
                    :col="column.name"
                    :column="column"
                  >
                    <div
                      v-html="showTemplate(showTableActiveItem, column) || showTableActiveItem[column.name]"
                      class="text-ellipse"
                    ></div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-auto table-main over-y-auto"
        @scroll.passive="handleTableVerticalScroll"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        ref="main-table"
      >
        <div class="table-inner flex-row">
          <div class="flex-none over-y-auto" v-if="canShowFixed" ref="t3Fixed">
            <div class="custom-table-layout I2gGZHz04ejj" :style="`width: ${fixedTableWidthTotal}`">
              <div :class="showRowClass" class="table-row" v-for="(item, index) in slicedCols" ref="row1" :key="index">
                <div v-if="showIndex && fixedCols.length" :class="[showCellClass, indexClass]" class="table-cell index">
                  <slot name="index" :index="index">{{ index + 1 }}</slot>
                </div>
                <template v-for="(column, index) in fixedColumns">
                  <div
                    :class="[showCellClass, columnAlign(column), showClassName(column, item)]"
                    class="table-cell"
                    :key="index"
                    @click="handleCellClick(column, item)"
                  >
                    <slot
                      :name="column.slot ? column.slot + '-fixed' : 'fixed'"
                      :value="showTemplate(item, column) || item[column.name]"
                      :column="column"
                      :item="item"
                    >
                      <div v-html="showTemplate(item, column) || item[column.name]" class="text-ellipse"></div>
                    </slot>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div
            class="table flex-auto over-x-auto no-scroll-bar"
            ref="t3"
            @touchstart="onTouch($refs.t3)"
            @scroll.passive="handleFollowScroll($refs.t3, $refs.t2, $refs.t1)"
          >
            <div
              class="custom-table-layout xG095NAjvhz5 main-table-layout"
              :style="`width: ${normalTableWidthTotal}; margin-top: ${slicedScrollTop}`"
            >
              <div ref="shim" v-if="virtualScroll"></div>
              <div
                :class="showRowClass"
                class="table-row"
                v-for="(item, index) in showItemCollection"
                :key="index"
                ref="row2"
              >
                <div :class="showCellClass" class="table-cell index" v-if="showIndex && !fixedCols.length">
                  <slot name="index" :index="index">{{ index + 1 }}</slot>
                </div>
                <div
                  v-for="(column, colIndex) in rightColumns"
                  :key="colIndex"
                  class="table-cell"
                  :class="[showCellClass, columnAlign(column), showClassName(column, item)]"
                  @click="handleCellClick(column, item)"
                >
                  <slot
                    :name="column.slot ? column.slot + '-main' : 'main'"
                    :value="showTemplate(item, column) || item[column.name]"
                    :item="item"
                    :column="column"
                  >
                    <div v-html="showTemplate(item, column) || item[column.name]" class="text-ellipse"></div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  props: {
    // 高亮激活的项目，会在首行固定
    activeItem: {
      type: Object,
      default: () => ({}),
    },
    // 当传递高亮项目时，不管是否在当前数据中找到与否，是否都显示，默认找不到不显示
    alwaysShowActiveItem: {
      type: Boolean,
      default: false,
    },
    // 是否展示索引
    showIndex: {
      type: Boolean,
      default: true,
    },
    // 索引列宽度
    indexWidth: {
      type: String,
      default: '1rem',
    },
    // 索引显示文字
    indexLabel: {
      type: String,
      default: '序号',
    },
    // 列宽度
    colWidth: {
      type: [String, Number],
      default: '2rem',
    },
    // 索引class
    indexClass: {
      type: String,
      default: 'index-cell',
    },
    // 表格标题class
    titleClass: String,
    // 激活行class
    activeClass: {
      type: String,
      default: 'active-cell',
    },
    activeFixedClass: {
      type: String,
      default: 'active-cell',
    },
    // 表格class
    tableClass: {
      type: String,
      default: 'fix-table',
    },
    // 表格行class
    rowClass: {
      type: String,
      default: 'table-row',
    },
    tableHeadClass: {
      type: String,
      default: 'table-head',
    },
    // 表格列class
    cellClass: {
      type: String,
      default: 'table-cell',
    },
    // 数据内容，格式应该为[{name1: value1, name2: value2}]，name为column中的name字段名
    items: {
      type: Array,
      default: () => [],
    },
    // 固定的列，此处应传递columns中要固定的name数组
    fixedCols: {
      type: Array,
      default: () => [],
    },
    // 列属性
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
    // 向右拖动加载
    dragRightLoad: {
      type: Boolean,
      default: false,
    },
    // 距离右侧指定距离开始加载
    dragRightDistance: {
      default: 120,
      validator: value => typeof value === 'number' && value >= 50,
    },
    // 上拉加载
    dragBottomLoad: {
      type: Boolean,
      default: false,
    },
    // 距离底部指定距离开始加载
    dragBottomDistance: {
      default: 400,
      validator: value => typeof value === 'number' && value >= 50,
    },
    // 这些数据表示为空数据,在去除空行或空列的时候会将其去除
    blankPlaceholder: {
      type: [String, Array],
      default: '',
    },
    // 是否去除空行
    removeBlankRow: {
      type: [Boolean, Function],
      default: false,
    },
    // 是否去除空列
    removeBlankCol: {
      type: [Boolean, Function],
      default: false,
    },
    // 唯一标识符，用于比对activeItem，在传递activeItem时，此项是必传的
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
    // 切割行显示，指定每次显示行数，会操作本地数据，随着上拉动态渲染
    // 如果行数过多，可以开启此选项，以保证页面快速渲染，为0表示不开启
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
    isHorizontal: Boolean,
  },
  data() {
    return {
      showItems: [],
      showSlicedItems: [],
      showColumns: [],
      originItems: [],
      originColumns: [],
      sortTableDesc: {},
      slicedScrollTop: 0,
    };
  },
  created() {
    this.firstTouchPos = {};
    this.firstSort = true;
    this.scrollTop = 0;
    this.init();
  },
  computed: {
    showItemCollection() {
      if (this.virtualScroll) {
        return this.showSlicedItems;
      } else {
        return this.showItems;
      }
    },
    showTableActiveItem() {
      return this.handleCustomTemplate([this.activeItem])[0];
    },
    canShowActiveRow() {
      return !!(
        this.alwaysShowActiveItem ||
        (Object.keys(this.showActiveItem).length && this.calcActiveItemIndex > -1)
      );
    },
    showCellClass() {
      return this.uniqueDefaultClass(this.cellClass, 'table-cell');
    },
    showHeadClass() {
      return this.uniqueDefaultClass(this.tableHeadClass, 'table-head');
    },
    showRowClass() {
      return this.uniqueDefaultClass(this.rowClass, 'table-row');
    },
    labels() {
      return this.showColumns.map(column => column.label);
    },
    cols() {
      return this.showColumns.map(column => column.name);
    },
    canShowFixed() {
      return this.fixedCols.length > 0;
    },
    slicedCols() {
      return this.originItems.slice(0, this.showItems.length);
    },
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
    fixedTableWidthTotal() {
      const widthWithoutIndex = this.fixedColumns.reduce((total, column) => {
        if (column.width) {
          return total + this.handleWidth(column.width).num;
        }
        return total + this.calcColWidthWithUnit.width;
      }, 0);
      if (this.showIndex) {
        return widthWithoutIndex + this.handleWidth(this.indexWidth).num + this.calcColWidthWithUnit.unit;
      }
      return widthWithoutIndex + this.calcColWidthWithUnit.unit;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    fixedColWidths() {
      let widths = this.fixedColumns.map(column => {
        const width = this.handleWidth(column.width);
        return (width && width.width) || this.calcColWidthWithUnit.width + this.calcColWidthWithUnit.unit;
      });
      if (this.indexWidth && this.showIndex) {
        return [this.indexWidth, ...widths];
      }
      if (!this.indexWidth && this.showIndex) {
        return [this.calcColWidthWithUnit.width + this.calcColWidthWithUnit.unit, ...widths];
      }
      if (!this.showIndex) {
        return widths;
      }
    },
    normalColWidths() {
      let widths = this.normalColumns.map(column => {
        const customWidth = column.width && this.handleWidth(column.width);
        return (customWidth && customWidth.width) || this.calcColWidthWithUnit.width + this.calcColWidthWithUnit.unit;
      });
      if (this.showIndex && !this.fixedColCounts) {
        return [this.indexWidth, ...widths];
      }
      return widths;
    },
    normalTableWidthTotal() {
      let totalWidth = this.normalColumns.reduce((total, column) => {
        let width = 0;
        if (column.width) {
          width = this.handleWidth(column.width).num;
        } else {
          width = this.calcColWidthWithUnit.width;
        }
        return total + width;
      }, 0);
      if (!this.fixedColumns.length && this.showIndex) {
        totalWidth += this.handleWidth(this.indexWidth).num;
      }
      return totalWidth + this.calcColWidthWithUnit.unit;
    },
    normalColumns() {
      const notFixedColumns = this.showColumns.filter(column => !this.fixedCols.includes(column.name));
      return notFixedColumns.map(column => {
        const index = this.cols.findIndex(c => c === column.name);
        return this.showColumns[index];
      });
    },
    showArrow() {
      if (this.isHorizontal) {
        return this.items && this.normalColumns.length > 4;
      } else {
        return this.items && this.normalColumns.length > 2;
      }
    },
    fixedColCounts() {
      if (this.showIndex && this.fixedCols.length > 0) {
        return this.fixedCols.length + 1;
      }
      return this.fixedCols.length;
    },
    calcColWidthWithUnit() {
      const colWith = typeof this.colWidth === 'string' ? this.colWidth : `${this.colWidth}`;
      const num = parseFloat(colWith, 10),
        unit = colWith.replace(num, '');
      return unit ? { width: num, unit } : { width: num, unit: 'px' };
    },
    calcActiveItemIndex() {
      if (!isEmpty(this.activeItem) && this.uniqueKey) {
        const index =
          this.originItems.findIndex(item => String(item[this.uniqueKey]) === String(this.activeItem[this.uniqueKey])) +
          1;
        if (index > 0) {
          return index;
        } else if (this.alwaysShowActiveItem) {
          return '-';
        }
        return -1;
      }
      return this.alwaysShowActiveItem ? '-' : -1;
    },
    rightColumns() {
      return this.showColumns.filter(column => !this.fixedCols.includes(column.name));
    },
    showActiveItem() {
      if (Object.keys(this.activeItem).length) {
        if (this.alwaysShowActiveItem) {
          return this.activeItem;
        }
        let activeItem = {};
        Object.keys(this.activeItem).forEach(key => {
          if (this.cols.find(col => String(col) === String(key))) {
            activeItem[key] = this.activeItem[key];
          }
        });
        return activeItem;
      }
      return {};
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
      if (this.isSorted) {
        return;
      }
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
    handleCellClick(column, item) {
      column.onClick && typeof column.onClick === 'function' && column.onClick.call(null, column, item);
    },
    uniqueDefaultClass(prop, className) {
      return prop === className ? '' : prop;
    },
    getColsStyle(widths, parentClass, isHead) {
      const cellClass = isHead ? this.tableHeadClass : this.cellClass;
      const styles = widths
        .map((width, index) => {
          return `.${parentClass} .${this.rowClass} .${cellClass}:nth-of-type(${index + 1}) { width: ${width}; }\n`;
        })
        .join('');

      return `${styles}`;
    },
    // 表格样式
    getWidthStyles() {
      const styles = [
        this.getColsStyle(this.fixedColWidths, 'eZRM70OXzbq', true),
        this.getColsStyle(this.normalColWidths, 'nwEGfl4zkYCJ', true),
        this.getColsStyle(this.fixedColWidths, 'I2gGZHz04ejj'),
        this.getColsStyle(this.normalColWidths, 'xG095NAjvhz5'),
      ];
      return `<style>${styles.join('')}</style>`;
    },
    // 处理自定义模板，初始化时调用
    handleCustomTemplate(items) {
      if (!items) return [];
      const customColumns = this.originColumns.filter(col => col.template && typeof col.template === 'function');
      if (!customColumns.length) {
        return items;
      }
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
    showTemplate(item, column) {
      if (item._template) {
        return item._template[column.name];
      }
      return null;
    },
    handleWidth(width) {
      const colWith = typeof width === 'string' ? width : `${width}`;
      const num = parseFloat(colWith, 10),
        unit = colWith.replace(num, '');
      return unit ? { num, unit, width } : { num, unit: 'px', width: num + 'px' };
    },
    // 跟随滚动
    handleFollowScroll(target, ...followers) {
      if (!this.firstTouchElement) {
        this.firstTouchElement = target;
        target.classList.remove('overflowX-hidden');
      }
      clearTimeout(this.tableScrollTimer);
      this.tableScrollTimer = setTimeout(() => {
        this.firstTouchElement = null;
      }, 500);
      const elements = [target, ...followers];
      elements.forEach(el => {
        if (el) {
          if (el !== this.firstTouchElement) {
            el.classList.add('overflowX-hidden');
          }
        }
      });
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        [target, ...followers].forEach(el => el && el.classList.remove('overflowX-hidden'));
      }, 301);
      if (target && target instanceof HTMLElement && target === this.firstTouchElement) {
        followers.forEach(follower => {
          if (follower) {
            follower.scrollLeft = target.scrollLeft;
            const rightDistance = target.scrollWidth - target.clientWidth - target.scrollLeft;
            this.$emit('onScrollLeft', target.scrollLeft, rightDistance);
            if (this.dragRightLoad && rightDistance < this.dragRightDistance && !this.isDragRightLoading) {
              this.isDragRightLoading = true;
              this.$emit('onDragRightLoad');
            }

            if (
              this.pageColSize > 0 &&
              this.chunkColumnIndex < this.colChunks.length &&
              rightDistance < this.dragRightDistance
            ) {
              this.showColumns = this.showColumns.concat(this.colChunks[this.chunkColumnIndex++]);
            }
          }
        });
      }
    },
    // 结束右拉加载，需要手动调用
    finishDragRightLoad() {
      if (this.dragRightLoad) {
        this.isDragRightLoading = false;
      }
    },
    onTouchStart(e) {
      const touches = e.touches[0] || e;
      this.firstTouchPos = {
        x: touches.pageX,
        y: touches.pageY,
      };
    },
    onTouchMove(e) {
      const touches = e.touches[0] || e;
      const distance = touches.pageY - this.firstTouchPos.y;
      if (distance < 0) {
        // 上推
        this.$emit('onPushUp', this.scrollTop, distance);
      } else {
        // 下拉
        this.$emit('onDropDown', this.scrollTop, distance);
      }
    },
    handleTableVerticalScroll(e) {
      const scrollTop = (this.scrollTop = e.target.scrollTop),
        mainTableEl = this.$refs['main-table'],
        t3El = this.$refs.t3;
      // 可滚动距离
      const canScrollDistance = t3El.scrollHeight - mainTableEl.clientHeight;
      this.$emit('onScrollVertical', scrollTop, canScrollDistance);

      if (this.virtualScroll && scrollTop > 0) {
        const startPos = Math.floor(scrollTop / this.rowHeight);

        this.shimEl.style.height = this.rowHeight * startPos + 'px';
        window.requestAnimationFrame(() => {
          this.showSlicedItems = this.showItems.slice(startPos, startPos + this.virtualScrollLength);
        });
      }

      if (
        this.pageRowSize > 0 &&
        this.chunkRowIndex < this.rowChunks.length &&
        e.target.scrollHeight - scrollTop - e.target.offsetHeight < this.dragBottomDistance
      ) {
        this.showItems = this.showItems.concat(this.handleCustomTemplate(this.rowChunks[this.chunkRowIndex++]));
        this.$nextTick(() => {
          this._resetDom();
        });
      }

      if (
        this.dragBottomLoad &&
        !this.isDragBottomLoading &&
        e.target.scrollHeight - scrollTop - e.target.offsetHeight < this.dragBottomDistance
      ) {
        this.isDragBottomLoading = true;
        this.$emit('onDragBottomLoad');
      }
    },
    // 结束上拉加载，需要手动调用
    finishDragBottomLoad() {
      if (this.dragBottomLoad) {
        this.isDragBottomLoading = false;
      }
    },
    onTouch(el) {
      this.firstTouchElement = el;
      el.classList.remove('overflowX-hidden');
    },
    getTableSpecifyColumn(items, col) {
      let values = [];
      items.forEach(item => {
        values.push(item[col]);
      });
      return values;
    },
    onSort(column) {
      // eslint-disable-next-line no-prototype-builtins
      if (!column.hasOwnProperty('sort')) {
        return false;
      }
      this.$refs['main-table'].scrollTop = 0;
      Object.keys(this.sortTableDesc).forEach(key => {
        if (key !== String(column.name)) {
          delete this.sortTableDesc[key];
        }
      });
      // 用户自定义的排序
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
        // 第一次进入时，比对当前排序顺序，以正确显示排序图标
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
        this.showItems = this.handleCustomTemplate(this.originItems).slice(0, this.showItems.length);
        this.showSlicedItems = this.showItems.slice(0, this.virtualScrollLength);
      }
      this.$emit('onSort', column);
    },
    columnAlign(column) {
      if (['left', 'right', 'center'].includes(column.align)) {
        return 'text-' + column.align;
      }
    },
    showClassName(column, item) {
      if (column.className && typeof column.className === 'function') {
        return column.className.call(null, column, item);
      }
      return column.className;
    },
    _resetDom() {
      if (this.contourLayout) {
        let tableMainEl = this.$refs.t3,
          tableMainFixedLeftEl = this.$refs.t3Fixed;
        // console.log(tableMainEl);
        const tableMainTrEls = tableMainEl.querySelectorAll('.' + this.rowClass),
          tableMainFixedLeftTrEls = tableMainFixedLeftEl.querySelectorAll('.' + this.rowClass);

        // eslint-disable-next-line no-inner-declarations
        function setHeight(el, height) {
          el.style.height = height + 'px';
        }

        [...tableMainFixedLeftTrEls, ...tableMainTrEls].forEach(el => {
          el.style.height = '';
        });

        // 安卓9bug
        const hasAndroidBug = getAndroidVersion() >= 9;

        this.$nextTick(() => {
          switch (this.contourLayout) {
            case 'to-right':
            case true:
              [...tableMainFixedLeftTrEls].forEach((leftTr, index) => {
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
        });
      }
    },
    _handleInitItems() {
      let originItems = $.extend(true, [], this.items);
      if (this.removeBlankRow) {
        const columnsKey = this.columns.map(column => column.name).filter(d => this.fixedCols.indexOf(d) === -1);
        originItems = originItems.filter((item, index) => {
          return !Object.keys(item).every(key => {
            if (columnsKey.indexOf(key) > -1) {
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
        this.showItems = this.handleCustomTemplate(this.originItems);
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
.relative {
  position: relative;
}

.fixed-table {
  padding-left: 0.18rem;

  .title {
    font-weight: bold;
  }

  .no-scroll-bar {
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .custom-table-layout {
    font-size: 0.26rem;
  }

  .main-table-layout {
    .table-row {
      .table-head,
      .table-cell {
        padding-left: 0;
      }
    }
  }

  .table-row {
    white-space: nowrap;
    overflow: hidden;
    line-height: 0.64rem;

    .table-cell,
    .table-head {
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
      vertical-align: middle;
      padding-left: 0.2rem;
      padding-right: 0.25rem;
      -webkit-tap-highlight-color: transparent;

      & > span {
        display: inline-block;
        box-sizing: border-box;
        max-width: 100%;
        text-align: inherit;
      }
    }

    .table-head {
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(:first-child) {
        padding-left: 0;
      }

      > span {
        position: relative;
      }

      &.asc > span:after,
      &.desc > span:after {
        position: absolute;
        content: '';
        border: 0.1rem solid;
        border-color: #1482f0 transparent transparent;
        right: -0.25rem;
        top: 50%;
      }

      &.asc > span {
        &:after {
          margin-top: -0.16rem;
          transform: rotate(180deg);
        }
      }

      &.desc > span {
        &:after {
          margin-top: -0.05rem;
        }
      }
    }

    .table-cell {
      line-height: 0.32rem;
      white-space: nowrap;

      &:not(:first-child) {
        padding-left: 0;
      }
    }

    .table-cell.index,
    .table-head.index {
      text-overflow: initial;
      overflow: initial;
    }
  }

  .active-row {
    color: #ff7a15;
    border-bottom: 1px solid #dfdfdf;
  }

  .table-active + .table-main {
    margin-top: 0.15rem;
  }

  .text-ellipse {
    width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<style lang="less" scoped>
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
