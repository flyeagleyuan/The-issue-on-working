<template>
  <div :class="classNames({ table__wrapper: true, hide: data.length === 0 })" v-if="columns.length">
    <div v-show="showHeader" :class="classNames('table-header__wrapper')" ref="header">
      <table-header
        :columns="columns"
        :prefix="prefix"
        :show-indicator="showIndicator"
        :sort-range="sortRange"
        @resize="handleColumnResize"
        @sort="handleSort"
      ></table-header>
    </div>
    <template v-if="rebuildColumns.length">
      <div v-if="fixedData" ref="fixed" :class="classNames('table-fixed__wrapper')">
        <table-fixed-body
          :column-class="columnClass"
          :columns="rebuildColumns"
          :fixed-data="fixedData"
          :prefix="prefix"
          :row-class="rowClass"
        ></table-fixed-body>
      </div>
      <table-body
        v-if="rebuildData.length"
        ref="body"
        :buffer="buffer"
        :column-class="columnClass"
        :columns="rebuildColumns"
        :data="rebuildData"
        :enable-pull-up="enablePullUp"
        :min-row-height="minRowHeight"
        :prefix="prefix"
        :row-class="rowClass"
        :row-key="rowKey"
        :viewport-height="viewportHeight"
      ></table-body>
    </template>
  </div>
</template>

<script>
/**
 * @author Leevare Email:liwei2@finchina.com
 * @date 2020/3/9 11:41
 * @description 虚拟滚动表格组件，此表格依赖virtualScroller组件，使用此组件时务必引入该组件
 */
import TableHeader from './tableHeader.vue';
import { cloneDeep, getClassNames, isFunc } from './utils';
import TableBody from './tableBody.vue';
import TableFixedBody from './tableFixedBody.vue';
import { store } from './store';

export default {
  name: 'virtualTable',
  components: { TableFixedBody, TableBody, TableHeader },
  props: {
    /**
     * 表格的列，以下对column做简要说明，详细说明请查看前端开发文档
     * 文档地址：https://192.168.100.188/svn/FC_APP/%E5%BC%80%E5%8F%91%E7%9B%B8%E5%85%B3/%E5%89%8D%E7%AB%AF%E9%A1%B5%E9%9D%A2/app%E9%A1%B5%E9%9D%A2%E7%BB%84%E4%BB%B6%E3%80%81%E6%8F%92%E4%BB%B6%E4%B8%8E%E6%8C%87%E4%BB%A4%E8%AF%B4%E6%98%8E.xlsx
     * @param {String} column.title 标题
     * @param {String} column.key 键
     * @param {String} column.type 列的渲染方式 index/render/slot/html
     * @param {Number | String} column.width 宽度，支持任意单位
     * @param {Boolean | String} column.fixed 是否固定 true/left/right
     * @param {String} column.slot type为slot时设置插槽名称
     * @param {Function} column.render type为render时设置渲染函数
     * @param {Function} column.indexMethod type为index时可选择设置索引自定义函数
     * @param {String} column.tag type为slot时设置被包裹的元素，默认为span
     * @param {Boolean} column.ellipsis 是否一行显示内容，超出显示省略号
     * @param {Boolean} column.sortable 是否可排序
     * @param {String} column.rowKey 行唯一字段
     * @param {Boolean} column.autosort 是否自动排序，默认以sortRange值的第一个排序方式排序
     * @param {String} column.class 列的class
     */
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    // 固定行
    fixedData: Array,
    // 默认全屏
    height: {
      type: Number,
      default: Math.max(window.innerHeight, window.innerWidth),
    },
    // 每行最小预估高度
    minRowHeight: {
      type: Number,
      default: 40,
    },
    prefix: {
      type: String,
      default: 'dzh--',
    },
    // 展示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 滚动缓冲区，分为上和下两个缓冲区，这里200表示上缓冲区和下缓冲区的高度都是200
    buffer: {
      type: Number,
      default: 200,
    },
    sortRange: {
      validator: ranges => ranges.every(range => ['asc', 'desc', 'normal'].includes(range)),
      default: () => ['desc', 'asc', 'normal'],
    },
    // 行数据的唯一字段，当使用上拉加载时需要指定此值，如不指定，可能会引起列表的抖动
    rowKey: String,
    // 行class，支持回调，回调参数(row, index)
    rowClass: [String, Function],
    // 列class，支持回调，回调参数(column, row, rowIndex)
    columnClass: [String, Function],
    // 是否开启上拉加载
    enablePullUp: Boolean,
    showIndicator: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rebuildData: cloneDeep(this.data),
      viewportHeight: 0,
      rebuildColumns: cloneDeep(this.columns),
    };
  },
  provide() {
    return {
      table: this,
    };
  },
  computed: {
    scrollLeft: () => store.scrollLeft,
    scrollTop: () => store.scrollTop,
  },
  methods: {
    classNames(classes) {
      return getClassNames(classes, this.prefix);
    },
    initViewportHeight() {
      this.$nextTick(() => {
        const header = this.$refs.header;
        const fixed = this.$refs.fixed;
        const hackHeight = 40;
        const headerHeight = header ? header.offsetHeight - hackHeight : 0;
        const fixedHeight = fixed ? fixed.offsetHeight - hackHeight : 0;
        this.viewportHeight = this.height - fixedHeight - headerHeight;
      });
    },
    handleSort(options) {
      const { order, column, index } = options;
      this.rebuildColumns.forEach((col, colIndex) => {
        if (index !== colIndex) {
          col.sortType = 'normal';
        }
      });
      const sortMethod = column['sortMethod'];
      const key = column['key'];
      if (this.$refs.body) this.$refs.body.$el.scrollTop = 0;
      const rebuildData = cloneDeep(this.data);
      if (order === 'normal') {
        this.rebuildData = rebuildData;
        return;
      }
      if (isFunc(sortMethod)) {
        if (order === 'asc') {
          this.rebuildData = rebuildData.sort((a, b) => sortMethod(a, b));
        } else if (order === 'desc') {
          this.rebuildData = rebuildData.sort((a, b) => sortMethod(b, a));
        }
      } else {
        if (order === 'asc') {
          this.rebuildData = rebuildData.sort((a, b) => a[key] - b[key]);
        } else if (order === 'desc') {
          this.rebuildData = rebuildData.sort((a, b) => b[key] - a[key]);
        }
      }
      this.$emit('sort', options);
    },
    handleColumnResize(columns) {
      this.initViewportHeight();
      this.rebuildColumns = columns;
    },
  },
  watch: {
    data(data) {
      this.rebuildData = cloneDeep(data);
    },
    scrollLeft(val) {
      this.$emit('horizontalScroll', val);
    },
    scrollTop(val) {
      this.$emit('verticalScroll', val);
    },
  },
};
</script>

<style lang="less">
@import './style';
</style>
