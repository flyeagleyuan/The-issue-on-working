<template>
  <div :class="[wrapClasses]" v-show="isShowTable" ref="wrapper">
    <div :class="classes">
      <span v-if="isShowArrow" :class="[prefixCls + '-header-arrow']" :style="arrowStyle">
        <i class="before"></i>
        <i class="after"></i>
      </span>
      <div
        v-if="showHeader"
        :class="[prefixCls + '-flex-row', prefixCls + '-flex-none', prefixCls + '-header-wrapper']"
      >
        <div
          v-if="isLeftFixed"
          :class="[prefixCls + '-header', prefixCls + '-flex-none']"
          :style="leftFixedColumnStyle"
        >
          <table-head
            :prefix-cls="prefixCls"
            :sort-range="sortRange"
            :columns="leftFixedColumns"
            :style-object="leftFixedColumnStyle"
            fixed="left"
          ></table-head>
        </div>
        <div
          :class="[prefixCls + '-header', prefixCls + '-overflowX-scroll', prefixCls + '-flex-auto']"
          ref="header"
          @scroll="handleHorizontalScroll($refs.header)"
          @touchstart="onTouch($refs.header)"
        >
          <div :style="tableHeaderStyle" :class="[`${prefixCls}-overflowX-hidden`]">
            <table-head
              :sort-range="sortRange"
              :prefix-cls="prefixCls"
              :columns="normalColumns"
              :style-object="tableHeaderStyle"
            ></table-head>
          </div>
        </div>
        <div
          v-if="isRightFixed"
          :class="[prefixCls + '-header', prefixCls + '-flex-none']"
          :style="rightFixedColumnStyle"
        >
          <table-head
            v-if="showHeader"
            :sort-range="sortRange"
            :prefix-cls="prefixCls"
            :columns="rightFixedColumns"
            :style-object="rightFixedColumnStyle"
            fixed="right"
          ></table-head>
        </div>
      </div>
      <div
        v-if="isShowHighlightRows"
        ref="highlight"
        :class="[prefixCls + '-flex-row', prefixCls + '-flex-none', prefixCls + '-highlight-items']"
      >
        <div v-if="isLeftFixed" :class="[prefixCls + '-flex-none']" :style="leftFixedColumnStyle">
          <table-body
            v-if="isShowHighlightRows"
            :style-object="leftFixedColumnStyle"
            :prefix-cls="prefixCls"
            :columns="highlightColumns(leftFixedColumns)"
            :data="highlightRows"
            :blank-placeholder="blankPlaceholder"
            :blank-values="blankValues"
            fixed="left"
            :class="[prefixCls + '-overflowX-hidden']"
          ></table-body>
        </div>
        <div
          :class="[prefixCls + '-overflowX-scroll', prefixCls + '-flex-auto']"
          ref="highlightHeader"
          @scroll="handleHorizontalScroll($refs.highlightHeader)"
          @touchstart="onTouch($refs.highlightHeader)"
        >
          <div :style="tableStyle" :class="[prefixCls + '-overflowX-hidden']">
            <table-body
              v-if="isShowHighlightRows"
              :style-object="tableStyle"
              :prefix-cls="prefixCls"
              :columns="highlightColumns(normalColumns)"
              :data="highlightRows"
              :blank-placeholder="blankPlaceholder"
              :blank-values="blankValues"
              :fixed="fixed"
            ></table-body>
          </div>
        </div>
        <div v-if="isRightFixed" :class="[prefixCls + '-flex-none']" :style="rightFixedColumnStyle">
          <table-body
            v-if="isShowHighlightRows"
            :style-object="rightFixedColumnStyle"
            :prefix-cls="prefixCls"
            :columns="highlightColumns(rightFixedColumns)"
            :data="highlightRows"
            :blank-placeholder="blankPlaceholder"
            :blank-values="blankValues"
            fixed="right"
            :class="[prefixCls + '-overflowX-hidden']"
          ></table-body>
        </div>
      </div>
      <div :class="[prefixCls + '-flex-none']" ref="highlightCustom" v-if="$scopedSlots._highlight">
        <slot name="_highlight"></slot>
      </div>
      <div :class="bodyClass" :style="fixedBodyStyle" ref="body" @scroll="handleVerticalScroll">
        <div :class="[`${prefixCls}-flex-row`, prefixCls + '-overflowY-hidden']">
          <div
            v-if="isLeftFixed"
            :class="[`${prefixCls}-flex-none`, `${prefixCls}-overflowX-hidden`, prefixCls + '-overflowY-hidden']"
            ref="fixed"
            :style="leftFixedColumnStyle"
          >
            <table-body
              :style-object="leftFixedColumnStyle"
              :prefix-cls="prefixCls"
              :columns="leftFixedColumns"
              :data="rebuildTableData"
              :blank-placeholder="blankPlaceholder"
              :blank-values="blankValues"
              fixed="left"
            ></table-body>
          </div>
          <div
            @scroll="handleHorizontalScroll($refs.tbody)"
            @touchstart="onTouch($refs.tbody)"
            ref="tbody"
            :class="[
              `${prefixCls}-overflowX-scroll`,
              `${prefixCls}-overflowY-hidden`,
              `${prefixCls}-flex-auto`,
              `${prefixCls}-flex-column`,
            ]"
          >
            <div
              :style="tableStyle"
              :class="[`${prefixCls}-overflowX-hidden`, `${prefixCls}-overflowY-hidden`, `${prefixCls}-flex-none`]"
            >
              <table-body
                :style-object="tableStyle"
                :prefix-cls="prefixCls"
                :columns="normalColumns"
                :data="rebuildTableData"
                :blank-placeholder="blankPlaceholder"
                :blank-values="blankValues"
                :fixed="fixed"
              ></table-body>
            </div>
          </div>
          <div
            v-if="isRightFixed"
            :style="rightFixedColumnStyle"
            :class="[prefixCls + '-flex-none', `${prefixCls}-overflowX-hidden`]"
          >
            <table-body
              :style-object="rightFixedColumnStyle"
              :prefix-cls="prefixCls"
              :columns="rightFixedColumns"
              :data="rebuildTableData"
              :blank-placeholder="blankPlaceholder"
              :blank-values="blankValues"
              fixed="right"
            ></table-body>
          </div>
        </div>
        <div v-if="isLimit" @click="removeLimit">
          <slot name="limit"><div :class="`${prefixCls}-limit`">查看更多</div></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @author Leevare Email:liwei2@finchina.com
 * @date 2019/4/18 15:29
 * @description 表格组件
 */
import {
  convertColumnOrder,
  getStyle,
  chunk,
  handleWidth,
  isNum,
  isBool,
  isUndef,
  isArray,
  isFunc,
  isEmpty,
  cloneDeep,
  oneOf,
} from './utils';
import TableHead from './uiTableHeader';
import TableBody from './uiTableBody';

const prefixCls = 'ui-table';

let columnKey = 1,
  rowKey = 1;

export default {
  name: 'TableScrollView',
  props: {
    // 列
    columns: {
      type: Array,
      default: () => [],
    },
    // 数据源
    data: {
      type: Array,
      default: () => [],
    },
    // 是否展示标题
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 固定位置
    fixed: {
      type: Boolean,
      default: false,
    },
    // 表格高度
    height: [String, Number],
    // 是否去除空行
    removeBlankRow: {
      type: Boolean,
      default: false,
    },
    // 是否去除空列
    removeBlankCol: {
      type: Boolean,
      default: false,
    },
    // 这些字符表示为空
    blankValues: {
      type: [Array, String],
      default: '',
    },
    // 为空占位符
    blankPlaceholder: {
      type: String,
      default: '',
    },
    // 切割行显示，指定每次显示行数，会操作本地数据，随着上拉动态渲染
    // 如果行数过多，可以开启此选项，以保证页面快速渲染，为0表示不开启
    pageRowSize: {
      default: 0,
      validator: value => isNum(value) && value >= 0,
    },
    // 切割列显示，指定每次显示列数，会操作本地数据，随着向右拖动动态渲染
    // 如果列数过多，可以开启此选项，以保证页面快速渲染，为0表示不开启
    pageColSize: {
      default: 0,
      validator: value => isNum(value) && value >= 0,
    },
    // 是否向右拖动加载
    dragRightLoad: {
      type: Boolean,
      default: false,
    },
    // 是否上拉加载
    dragBottomLoad: {
      type: Boolean,
      default: false,
    },
    // 距离底部指定距离开始加载
    dragBottomDistance: {
      validator: value => isNum(value) && value >= 50,
      default: 400,
    },
    // 距离右侧指定距离开始加载
    dragRightDistance: {
      validator: value => isNum(value) && value >= 50,
      default: 120,
    },
    // 排序范围，可选值为['desc', 'asc', 'normal']，指定后将在这些排序方式中循环排序
    sortRange: {
      type: Array,
      default: () => ['desc', 'asc', 'normal'],
      validator(v) {
        return v.every(d => {
          return oneOf(d, ['desc', 'asc', 'normal']);
        });
      },
    },
    // 限制最多显示指定行数，超出会在表格底部显示更多
    limitRow: {
      type: Number,
      validator: v => isNum(v) && v > 0,
    },
    // 高亮条件，将符合条件的项目放到顶部固定高亮行显示
    highlightRowCondition: Object,
    highlightData: Array,
    // 是否一直显示高亮，设置后，不论是否能在当前数据源中找到对应对象，都会在高亮行一直显示
    keepHighlightRow: Boolean,
  },
  data() {
    return {
      clonedColumns: [],
      rebuildData: [],
      prefixCls,
      bodyHeight: 0,
      headerHeight: 0,
      tableWidth: 0,
      isVerticalScroll: false,
      chunkedColumns: [],
      chunkedTableColumns: [],
      chunkedData: [],
      chunkedTableData: [],
      chunkedRowPage: 0,
      chunkedColPage: 0,
      heightList: [],
      isLimit: !isUndef(this.limitRow),
    };
  },
  provide() {
    return {
      tableRoot: this,
    };
  },
  components: { TableHead, TableBody },
  computed: {
    isShowTable() {
      return this.columns.length > 0 && this.data.length > 0;
    },
    isShowArrow() {
      return this.showHeader && this.clonedColumns.filter(c => !c.fixed).length > 2;
    },
    wrapClasses() {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-overflowY-scroll`]: !this.height,
        },
      ];
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-with-fixed-top`]: !!this.height,
        },
      ];
    },
    bodyClass() {
      return [
        `${prefixCls + '-body'}`,
        `${prefixCls}-overflowX-hidden`,
        { [`${prefixCls}-overflowY-scroll`]: this.isVerticalScroll },
      ];
    },
    tableHeaderStyle() {
      let style = Object.create(null);
      if (this.tableWidth !== 0) {
        let width = '';
        width = this.tableWidth;
        style.width = width + 'px';
      }
      return style;
    },
    tableStyle() {
      let style = Object.create(null);
      if (this.tableWidth !== 0) {
        style.width = this.tableWidth + 'px';
      }
      return style;
    },
    arrowStyle() {
      const leftFixedStyle = this.fixedColumnStyle('left');
      const leftOffset = parseInt(leftFixedStyle.width);

      return { left: leftOffset + 'px', height: this.headerHeight + 'px' };
    },
    isLeftFixed() {
      return this.columns.some(column => column.fixed && column.fixed === 'left');
    },
    isRightFixed() {
      return this.columns.some(column => column.fixed && column.fixed === 'right');
    },
    fixedBodyStyle() {
      let style = Object.create(null);
      if (this.bodyHeight !== 0 && !!this.height) {
        style.height = this.bodyHeight + 'px';
      }
      return style;
    },
    leftFixedColumnStyle() {
      return this.fixedColumnStyle('left');
    },
    rightFixedColumnStyle() {
      return this.fixedColumnStyle('right');
    },
    leftFixedColumns() {
      return convertColumnOrder(this.clonedColumns, 'left');
    },
    rightFixedColumns() {
      return convertColumnOrder(this.clonedColumns, 'right');
    },
    normalColumns() {
      const normalColumns = [],
        fixedColumns = [];
      this.rebuildTableColumns.forEach(column => {
        !column.fixed ? normalColumns.push(column) : fixedColumns.push(column);
      });
      return normalColumns.concat(fixedColumns);
    },
    rebuildTableData() {
      if (this.isLimit) {
        return this.rebuildData.slice(0, this.limitRow);
      }
      return this.pageRowSize > 0 ? this.chunkedTableData : this.rebuildData;
    },
    rebuildTableColumns() {
      return this.pageColSize > 0 ? this.chunkedTableColumns : this.clonedColumns;
    },
    highlightRows() {
      let rows = [];
      if (this.highlightRowCondition) {
        let data = this.rebuildData.filter(item => {
          return Object.keys(this.highlightRowCondition).every(key => item[key] === this.highlightRowCondition[key]);
        });
        if (data.length === 0 && this.keepHighlightRow) {
          const item = this.columns.reduce((obj, column) => {
            if (!Object.hasOwnProperty.call(this.highlightRowCondition, column.key)) {
              return Object.assign({}, obj, this.highlightRowCondition, { [column.key]: '' });
            }
            return obj;
          }, {});
          data = [item];
        }
        rows = data;
      }
      if (!isEmpty(this.highlightData)) {
        rows = [...rows, ...this.makeData(this.highlightData)];
      }
      return rows;
    },
    isShowHighlightRows() {
      if (this.keepHighlightRow) {
        return true;
      }
      return (!isEmpty(this.highlightRowCondition) || !isEmpty(this.highlightData)) && !isEmpty(this.highlightRows);
    },
  },
  created() {
    let clonedColumns = this.makeColumns(this.columns);
    let rebuildData = this.makeData();
    if (this.removeBlankCol) {
      clonedColumns = this.makeColumnsTrim(rebuildData, clonedColumns);
    }
    this.clonedColumns = clonedColumns;
    if (this.removeBlankRow) {
      rebuildData = this.makeDataTrim(rebuildData, clonedColumns);
    }
    this.rebuildData = rebuildData;
    if (this.pageRowSize > 0) {
      this.chunkedData = this.makeDataWithChunk(this.clonedColumns);
      if (this.chunkedData.length > 0) {
        this.chunkedTableData = this.chunkedData[this.chunkedRowPage++];
      }
    }
    if (this.pageColSize > 0) {
      this.chunkedColumns = this.makeColumnsWithChunk();
      if (this.chunkedColumns.length > 0) {
        this.chunkedTableColumns = this.chunkedColumns[this.chunkedColPage++];
      }
    }
    this.isLimit = !isUndef(this.limitRow) && this.rebuildData.length > this.limitRow;
    this.makeSort();
    addEventListener('resize', this.handleResize.bind(this), false);
  },
  mounted() {
    this.handleResize();
  },
  methods: {
    highlightColumns(cols) {
      const columns = cloneDeep(cols);
      const index = columns.findIndex(col => col.type === 'index');
      if (index > -1) {
        columns[index].indexMethod =
          columns[index].indexMethod || (row => (row.__index === -1 || isUndef(row.__index) ? '-' : row.__index + 1));
      }
      return columns;
    },
    fixedColumnStyle(fixed) {
      const totalWidth = this.clonedColumns.reduce(
        (result, column) => (column.fixed === fixed ? result + column.width : result),
        0
      );
      return { width: totalWidth + 'px' };
    },
    handleResize() {
      this.tableWidth = this.rebuildTableColumns
        .filter(column => !column.fixed)
        .reduce((total, column) => total + column.width, 0);
      this.fixedHeader();
    },
    makeColumnsWithChunk() {
      const fixedColumns = this.clonedColumns.filter(column => column.fixed && oneOf(column.fixed, ['left', 'right'])),
        restColumns = this.clonedColumns.filter(column => !column.fixed);
      const chunkedColumns = chunk(restColumns, this.pageColSize);
      return chunkedColumns.length > 0 ? [fixedColumns.concat(chunkedColumns[0]), ...chunkedColumns.slice(1)] : [];
    },
    makeColumns(cols) {
      let left = [],
        center = [],
        right = [];
      let columns = cloneDeep(cols);

      columns.forEach((column, index) => {
        column._index = index;
        column.width = handleWidth(column.width);
        column._width = column.width ? `${column.width}px` : '';
        column._sortType = column._sortType || 'normal';
        column._columnKey = columnKey++;

        if (column.fixed && column.fixed === 'left') {
          left.push(column);
        } else if (column.fixed && column.fixed === 'right') {
          right.push(column);
        } else {
          center.push(column);
        }
      });
      return left.concat(center).concat(right);
    },
    makeSort() {
      const sortColumn = this.clonedColumns.find(
        column => column.sortable && oneOf(column.autoSort, [true, 'desc', 'asc'])
      );
      if (sortColumn) {
        this.handleSort(sortColumn._index, isBool(sortColumn.autoSort) ? 'desc' : sortColumn.autoSort);
      }
    },
    makeDataWithChunk(columns) {
      return chunk(this.makeData(columns), this.pageRowSize);
    },
    makeData(originData) {
      let data = cloneDeep(originData || this.data);
      return data.map((item, index) => {
        if (!isUndef(item)) {
          item._index = index;
          item.__index = index;
          item._rowKey = rowKey++;
          item._isExpanded = isUndef(item._isExpanded) ? !!item._expanded : item._isExpanded;
          item._isShowIndex = !isUndef(item._isShowIndex) ? item._isShowIndex : true;
          item._isShowExpand = !isUndef(item._isShowExpand) ? item._isShowExpand : true;
          return item;
        }
        return {};
      });
    },
    makeDataTrim(data, cols) {
      const blankPlaceholder = isArray(this.blankValues) ? this.blankValues : [this.blankValues];
      const columns = cols.filter(column => !column.fixed && column.type !== 'index');
      return data.filter(item => {
        const isEmpty = columns.every(column => oneOf(item[column.key], blankPlaceholder));
        return !isEmpty;
      });
    },
    makeColumnsTrim(data, cols) {
      if (!isEmpty(data)) {
        const blankPlaceholder = isArray(this.blankValues) ? this.blankValues : [this.blankValues];
        return cols.filter(column => {
          if (column.type === 'index') return true;
          let isEmpty = data.every(item => oneOf(item[column.key], blankPlaceholder));
          return !isEmpty;
        });
      }
      return cols;
    },
    handleSort(columnOriginIndex, type) {
      const index = this.getOriginalIndex(columnOriginIndex);
      const key = this.clonedColumns[index].key;
      this.clonedColumns.forEach(column => (column._sortType = 'normal'));
      if (type === 'normal') {
        this.rebuildData = this.makeData();
      } else {
        this.rebuildData = this.sortData(this.rebuildData, type, index);
        if (this.pageRowSize > 0) {
          this.chunkedData = chunk(this.rebuildData, this.pageRowSize);
          this.chunkedTableData = this.chunkedData.reduce(
            (results, data, index) => (index < this.chunkedRowPage ? results.concat(data) : results),
            []
          );
        }
      }
      this.clonedColumns[index]._sortType = type;
      this.$emit('on-sort', {
        key,
        order: type,
        column: this.clonedColumns[index],
      });
    },
    sortData(data, type, index) {
      const key = this.clonedColumns[index].key;
      return data
        .sort((a, b) => {
          if (isFunc(this.clonedColumns[index].sortMethod)) {
            if (type === 'asc') {
              return this.clonedColumns[index].sortMethod(a, b, type);
            } else if (type === 'desc') {
              return this.clonedColumns[index].sortMethod(b, a, type);
            }
          } else {
            if (type === 'asc') {
              return a[key] > b[key] ? 1 : -1;
            } else if (type === 'desc') {
              return b[key] > a[key] ? 1 : -1;
            }
          }
        })
        .map((d, index) => {
          d.__index = index;
          return d;
        });
    },
    getOriginalIndex(index) {
      return this.clonedColumns.findIndex(column => column._index === index);
    },
    fixedHeader() {
      this.$nextTick(() => {
        const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
        const highlightHeight = this.$refs.highlight ? this.$refs.highlight.offsetHeight : 0;
        const highlightCustomHeight = this.$refs.highlightCustom ? this.$refs.highlightCustom.offsetHeight : 0;
        this.headerHeight = headerHeight;
        this.bodyHeight =
          (this.height || this.$el.offsetHeight) - headerHeight - highlightHeight - highlightCustomHeight;
        this.$nextTick(() => {
          this.fixedBody();
        });
      });
    },
    fixedBody() {
      this.$nextTick(() => {
        const bodyHeight = this.$refs.body.scrollHeight;
        if (bodyHeight >= this.bodyHeight) {
          this.isVerticalScroll = true;
        }
      });
    },
    onTouch(el) {
      this.firstTouchElement = el;
      el.classList.remove(prefixCls + '-overflowX-hidden');
      this.$emit('on-touch', el);
    },
    handleHorizontalScroll(target) {
      if (!this.firstTouchElement) {
        this.firstTouchElement = target;
        target.classList.remove(prefixCls + '-overflowX-hidden');
      }
      clearTimeout(this._tableScrollTimer);
      this._tableScrollTimer = setTimeout(() => {
        this.firstTouchElement = null;
      }, 500);
      const els = [this.$refs.header, this.$refs.tbody, this.$refs.highlightHeader].filter(Boolean);
      els.forEach(el => {
        el !== this.firstTouchElement && el.classList.add(prefixCls + '-overflowX-hidden');
      });
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        els.forEach(el => el.classList.remove(prefixCls + '-overflowX-hidden'));
      }, 300);
      const handleScroll = el => {
        el.scrollLeft = target.scrollLeft;
        const rightDistance = target.scrollWidth - target.clientWidth - target.scrollLeft;
        this.$emit('on-scroll-left', target.scrollLeft, rightDistance);
        if (this.dragRightLoad && rightDistance < this.dragRightDistance && !this.isDragRightLoading) {
          this.isDragRightLoading = true;
          if (this.pageColSize > 0 && this.chunkedColPage <= this.chunkedColumns.length - 1) {
            this.chunkedTableColumns = this.chunkedTableColumns.concat(this.chunkedColumns[this.chunkedColPage++]);
            this.isDragRightLoading = false;
          }
          this.$emit('on-drag-right-load');
        }
      };
      if (els.length === 1) {
        handleScroll(els[0]);
      } else {
        els.forEach(el => {
          el !== target && target === this.firstTouchElement && handleScroll(el);
        });
      }
    },
    // 结束右拉加载，需要手动调用
    finishDragRightLoad() {
      if (this.dragRightLoad) {
        this.isDragRightLoading = false;
      }
    },
    handleVerticalScroll(event) {
      const scrollTop = event.target.scrollTop;
      if (this.$refs.fixed) {
        this.$refs.fixed.scrollTop = scrollTop;
      }
      this.$emit('on-scroll-vertical', scrollTop);

      if (
        this.dragBottomLoad &&
        event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop <= this.dragBottomDistance &&
        !this.isDragBottomLoading
      ) {
        this.isDragBottomLoading = true;
        if (this.pageRowSize > 0 && this.chunkedRowPage <= this.chunkedData.length - 1) {
          this.chunkedTableData = this.chunkedTableData.concat(this.chunkedData[this.chunkedRowPage++]);
          this.isDragBottomLoading = false;
        }
        this.$emit('on-drag-bottom-load');
      }
    },
    // 结束上拉加载，需要手动调用
    finishDragBottomLoad() {
      if (this.dragBottomLoad) {
        this.isDragBottomLoading = false;
      }
    },
    removeLimit() {
      this.isLimit = false;
    },
    handleExpand(row) {
      const index = this.rebuildData.findIndex(d => d._rowKey === row._rowKey);
      if (index > -1) {
        this.$set(this.rebuildData[index], '_isExpanded', !this.rebuildData[index]._isExpanded);
        this.$emit('on-expand', this.rebuildData[index], this.rebuildData[index].__index, row._isExpanded);
      }
    },
    addHeightToList(index, height) {
      this.heightList[index] = Math.max(height, this.heightList[index] || 0);
    },
    getTableWidth(isContainer = true) {
      const fixedColumnsWidth = this.leftFixedColumns
        .filter(column => column.fixed)
        .reduce((results, column) => results + column.width || handleWidth(2), 0);
      return (isContainer ? this.$refs.wrapper.offsetWidth : this.tableWidth) - fixedColumnsWidth;
    },
    getHeightList() {
      return this.heightList;
    },
    getTableHeight(isContainer = true) {
      if (isContainer) {
        const height = this.height || window.innerHeight;
        const headerHeight = this.$refs.header ? this.$refs.header.offsetHeight : 0;
        const highlightHeight = this.$refs.highlight ? this.$refs.highlight.offsetHeight : 0;
        const customHighlightHeight = this.$refs.highlightCustom ? this.$refs.highlightCustom.offsetHeight : 0;
        return height - headerHeight - highlightHeight - customHighlightHeight;
      } else {
        return this.$refs.tbody ? this.$refs.tbody.offsetHeight : 0;
      }
    },
    resetPosition() {
      this.$nextTick(() => {
        this.$refs.body && (this.$refs.body.scrollTop = 0);
      });
    },
  },
  watch: {
    chunkedColPage() {
      this.tableWidth = this.rebuildTableColumns
        .filter(column => !column.fixed)
        .reduce((total, column) => total + column.width, 0);
    },
    columns: {
      deep: true,
      handler() {
        this.chunkedColPage = 0;
        this.isDragRightLoading = false;
        let clonedColumns = this.makeColumns(this.columns);
        if (this.removeBlankCol) {
          clonedColumns = this.makeColumnsTrim(this.data, clonedColumns);
        }
        this.clonedColumns = clonedColumns;
        if (this.pageColSize > 0) {
          this.chunkedColumns = this.makeColumnsWithChunk();
          if (this.chunkedColumns.length > 0) {
            this.chunkedTableColumns = this.chunkedColumns[this.chunkedColPage++];
          }
        }
        this.handleResize();
      },
    },
    data: {
      deep: true,
      handler() {
        this.chunkedRowPage = 0;
        this.isDragBottomLoading = false;
        let rebuildData = this.makeData();
        this.isLimit = !!(this.limitRow && rebuildData.length > this.limitRow);
        if (this.removeBlankRow) {
          rebuildData = this.makeDataTrim(rebuildData, this.columns);
        }
        this.rebuildData = rebuildData;
        if (this.removeBlankCol) {
          this.clonedColumns = this.makeColumnsTrim(this.data, this.clonedColumns);
        }
        if (this.pageRowSize > 0) {
          this.chunkedData = this.makeDataWithChunk();
          if (this.chunkedData.length > 0) {
            this.chunkedTableData = this.chunkedData[this.chunkedRowPage++];
          }
        }
        this.makeSort();
        this.handleResize();
      },
    },
    height() {
      this.fixedHeader();
    },
  },
};
</script>

<style lang="less">
@import './table';
</style>
