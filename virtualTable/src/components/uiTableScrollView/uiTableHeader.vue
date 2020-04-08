<template>
  <table :style="styles">
    <colgroup>
      <col v-for="column in columns" :key="column._columnKey" :width="setCellWidth(column)" />
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="(column, columnIndex) in columns"
          :key="column._columnKey"
          :colspan="column.colSpan"
          :rowSpan="column.rowSpan"
          :class="cellClass(column)"
        >
          <div>
            <span
              v-if="!column.renderHeader"
              @click="handleSortByHead(column)"
              :class="[
                prefixCls + '-sort1',
                {
                  [`${prefixCls}-asc1`]: column._sortType === 'asc',
                  [`${prefixCls}-desc1`]: column._sortType === 'desc',
                },
              ]"
              >{{ column.title || '' }}</span
            >
            <render-header v-else :render="column.renderHeader" :index="columnIndex" :column="column"></render-header>
            <!--<span
              :class="[
                prefixCls + '-sort',
                {
                  [`${prefixCls}-asc`]: column._sortType === 'asc',
                  [`${prefixCls}-desc`]: column._sortType === 'desc',
                },
              ]"
              v-if="column.sortable"
            >
            </span>-->
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
import Mixin from './mixins';
import RenderHeader from './header';
import { oneOf } from './utils';
export default {
  props: {
    columns: Array,
    fixedColumnRows: Array,
    columnRows: Array,
    prefixCls: String,
    styleObject: Object,
    sortRange: Array,
    fixed: {
      type: [Boolean, String],
      default: false,
    },
  },
  mixins: [Mixin],
  computed: {
    styles() {
      const style = Object.assign({}, this.styleObject);
      const width = parseFloat(this.styleObject.width);
      style.width = `${width}px`;
      return style;
    },
  },
  components: { RenderHeader },
  methods: {
    handleSort(index, type) {
      const column = this.columns.find(column => column._index === index);
      if (column._sortType === type) {
        type = 'normal';
      }
      this.$parent.handleSort(index, type);
    },
    handleSortByHead(column) {
      const index = column._index;
      if (column.sortable) {
        const type = column._sortType;
        let sortRangeIndex = this.sortRange.indexOf(type);
        sortRangeIndex = sortRangeIndex === -1 ? 0 : sortRangeIndex;
        const nextRangeIndex = sortRangeIndex + 1 > this.sortRange.length - 1 ? 0 : sortRangeIndex + 1;
        this.handleSort(index, this.sortRange[nextRangeIndex]);
      }
    },
    cellClass(column) {
      return [
        column.className,
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]:
            (!this.fixed && column.fixed && oneOf(column.fixed, ['left', 'right'])) ||
            (this.fixed && !column.fixed) ||
            (this.fixed && column.fixed && this.fixed !== column.fixed),
          [`${this.prefixCls}-text-${column.align}`]: column.align,
        },
      ];
    },
  },
};
</script>
