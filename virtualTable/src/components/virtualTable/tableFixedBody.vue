<template>
  <div ref="fixed" :class="classNames('table-fixed')" @scroll.passive="handleScroll">
    <table-row
      v-for="(row, rowIndex) in rebuildFixedData"
      :key="rowIndex"
      :prefix="prefix"
      :columns="columns"
      :row="row"
      :row-class="rowClass"
      :column-class="columnClass"
      :class="classNames({ 'head-fixed': row.__headFixed, 'last-fixed': row.__lastFixed })"
      :style="{ width: widthTotal + 'px' }"
      @click="handleRowClick(row)"
    ></table-row>
  </div>
</template>

<script>
import TableRow from './tableRow.vue';
import { setScrollLeft, store } from './store';
import { getClassNames, syncScroll } from './utils';

export default {
  name: 'tableFixedBody',
  components: { TableRow },
  props: {
    prefix: String,
    fixedData: Array,
    columns: Array,
    rowClass: [String, Function],
    columnClass: [String, Function],
  },
  inject: ['table'],
  computed: {
    scrollLeft: () => store.scrollLeft,
    widthTotal: () => store.widthTotal,
    rebuildFixedData() {
      const fixedData = this.fixedData;
      if (fixedData) {
        const len = fixedData.length;
        return fixedData.map((d, index) => {
          d.__index = index;
          if (index === 0) d.__headFixed = true;
          if (index === len - 1) d.__lastFixed = true;
          return d;
        });
      }
      return [];
    },
  },
  methods: {
    classNames(classes) {
      return getClassNames(classes, this.prefix);
    },
    handleScroll(e) {
      setScrollLeft(e.target.scrollLeft, e.target);
    },
    handleRowClick(row) {
      this.table && this.table.$emit('rowClick', row, row.__index);
    },
  },
  watch: {
    scrollLeft(scrollLeft) {
      const els = [this.$refs.fixed];
      syncScroll(els, scrollLeft);
    },
  },
};
</script>
