<template>
  <div ref="header" @scroll.passive="onScrollLeft" :class="classNames('table-header__container')">
    <template v-if="showIndicator">
      <div :class="classNames(['indicator', 'indicator-left'])" :style="{ left: indicatorOffset.left + 'px' }"></div>
      <div :class="classNames(['indicator', 'indicator-right'])" :style="{ right: indicatorOffset.right + 'px' }"></div>
    </template>
    <ul :class="classNames('table-header')" :style="{ width: widthTotal + 'px' }">
      <li
        ref="column"
        :class="[
          classNames({ 'table-column': true, 'column-ellipsis': column.ellipsis, 'column-sticky': isSticky(column) }),
          column.class,
        ]"
        v-for="(column, index) in rebuildColumns"
        :key="index"
        :style="getColumnStyle(column)"
        @click="handleClick(column, index)"
      >
        <span :class="classNames(column.sortType)">{{ column.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { styleMixin } from './mixin';
import { setScrollLeft, setWidthList, store } from './store';
import { syncScroll, cloneDeep } from './utils';

export default {
  name: 'tableHeader',
  props: {
    columns: Array,
    prefix: String,
    sortRange: Array,
    showIndicator: Boolean,
  },
  data() {
    return {
      rebuildColumns: cloneDeep(this.columns),
    };
  },
  mixins: [styleMixin],
  computed: {
    scrollLeft: () => store.scrollLeft,
    widthTotal: () => store.widthTotal,
    indicatorOffset() {
      return this.rebuildColumns.reduce(
        (result, column) => {
          if ((column.fixed === true || column.fixed === 'left') && column['_width']) {
            result.left += column['_width'];
          }
          if (column.fixed === 'right') {
            result.right += column['_width'];
          }
          return result;
        },
        { left: 0, right: 10 }
      );
    },
  },
  methods: {
    resize(columns) {
      this.$nextTick(() => {
        const els = this.$refs.column;
        if (els) {
          const widthList = [...els].map(el => el.offsetWidth);
          setWidthList(widthList);
          const cols = this.resizeColumnWidth(columns, widthList);
          this.$emit('resize', cols);
        }
      });
    },
    handleClick(column, index, isAutosort = false) {
      if (column.sortable) {
        const type = column.sortType;
        let sortRangeIndex = this.sortRange.indexOf(type);
        const nextRangeIndex = sortRangeIndex + 1 > this.sortRange.length - 1 ? 0 : sortRangeIndex + 1;
        const sortType = this.sortRange[nextRangeIndex];
        column['sortType'] = sortType;
        this.$emit('sort', { ...{ column, index, order: sortType }, ...(isAutosort ? { autosort: true } : {}) });
      }
    },
    resizeColumnWidth(columns, widthList) {
      let leftOffset = 0;
      let rigthOffset = 0;
      columns.forEach((col, index) => {
        this.$set(col, '_width', widthList[index]);
        if (col.fixed === true || col.fixed === 'left') {
          this.$set(col, '_offset', leftOffset);
          leftOffset += col['_width'];
        } else if (col.fixed === 'right') {
          this.$set(col, '_offset', rigthOffset);
          rigthOffset += col['_width'];
        }
      });
      columns.resize = true;
      return columns;
    },
    remakeColumns(columns) {
      const leftCols = [];
      const cols = [];
      const rightCols = [];
      let autosortColumn;
      columns.forEach((col, index) => {
        if (col.autosort) autosortColumn = { col, index };
        this.$set(col, 'sortType', col['sortType'] || 'normal');
        if (col.fixed === true || col.fixed === 'left') {
          leftCols.push(col);
        } else if (col.fixed === 'right') {
          rightCols.push(col);
        } else {
          cols.push(col);
        }
      });
      if (autosortColumn) this.handleClick(autosortColumn.col, autosortColumn.index, true);
      columns.resize = true;
      return [...leftCols, ...cols, ...rightCols];
    },
    onScrollLeft(e) {
      setScrollLeft(e.target.scrollLeft, e.target);
    },
  },
  watch: {
    scrollLeft(scrollLeft) {
      syncScroll([this.$refs.header], scrollLeft);
    },
    columns: {
      immediate: true,
      handler(columns) {
        if (!columns.resize) {
          this.rebuildColumns = this.remakeColumns(columns);
          this.resize(columns);
        }
      },
    },
  },
};
</script>
