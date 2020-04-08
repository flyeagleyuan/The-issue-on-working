<template>
  <dynamic-scroller
    ref="scroller"
    :class="classNames('table-body__wrapper')"
    :prefix="prefix"
    :data="data"
    :buffer="buffer"
    :row-key="rowKey"
    :min-row-height="minRowHeight"
    :viewport-height="viewportHeight"
    :scroll-left="scrollLeft"
    :enable-pull-up="enablePullUp"
    @scrollHorizontal="handleScrollHorizontal"
    @scrollVertical="handleScrollVertical"
    @next="handleNext"
  >
    <template #default="{ row }">
      <table-row :row="row" :prefix="prefix" :row-class="rowClass" :column-class="columnClass" :columns="columns" />
    </template>
  </dynamic-scroller>
</template>

<script>
import TableRow from './tableRow.vue';
import { DynamicScroller } from '../virtualScroller';
import { setScrollLeft, setScrollTop, store } from './store';
import { getClassNames } from './utils';

export default {
  props: {
    prefix: String,
    columns: Array,
    data: Array,
    buffer: Number,
    rowKey: String,
    minRowHeight: Number,
    viewportHeight: Number,
    rowClass: [String, Function],
    columnClass: [String, Function],
    enablePullUp: Boolean,
  },
  components: { TableRow, DynamicScroller },
  computed: {
    scrollLeft: () => store.scrollLeft,
    widthTotal: () => store.widthTotal,
  },
  inject: ['table'],
  methods: {
    classNames(classes) {
      return getClassNames(classes, this.prefix);
    },
    handleScrollHorizontal(scrollLeft, e) {
      setScrollLeft(scrollLeft, e.target);
    },
    handleScrollVertical(scrollTop) {
      setScrollTop(scrollTop);
    },
    handleNext() {
      this.table && this.table.$emit('next', ...arguments);
    },
    resize() {
      this.$refs.scroller && this.$refs.scroller.resize();
    },
  },
  watch: {
    columns() {
      this.$nextTick(() => {
        this.resize();
      });
    },
  },
};
</script>
