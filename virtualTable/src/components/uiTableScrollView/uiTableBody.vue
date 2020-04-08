<template>
  <table :style="styleObject">
    <colgroup>
      <col :key="column._columnKey" v-for="column in columns" :width="setCellWidth(column)" />
    </colgroup>
    <tbody>
      <template v-for="(row, rowIndex) in data">
        <table-row :key="row.__index" :row="row">
          <table-cell
            v-for="column in columns"
            :key="column._columnKey"
            :row="row"
            :column="column"
            :index="rowIndex"
            :natural-index="rowIndex"
            :prefix-cls="prefixCls"
            v-bind="$attrs"
          ></table-cell>
        </table-row>
        <tr v-if="rowExpanded(row._rowKey)" :key="row._rowKey">
          <td v-for="column in columns" :key="column._columnKey" :class="[prefixCls + '-expanded-cell']">
            <table-cell
              :row="row"
              :column="column"
              :index="rowIndex"
              :natural-index="rowIndex"
              :prefix-cls="prefixCls"
              v-bind="$attrs"
            >
              <table-render :index="row._index" :row="row" :render="expandRender"></table-render>
            </table-cell>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import Mixins from './mixins';
import TableRow from './uiTableRow';
import TableCell from './uiTableCell';
import TableRender from './render';
import { isFunc } from './utils';

export default {
  props: {
    prefixCls: String,
    columns: Array,
    data: Array,
    columnsWidth: Object,
    styleObject: Object,
  },
  mixins: [Mixins],
  components: { TableRow, TableCell, TableRender },
  computed: {
    expandRender() {
      let render = () => {
        return '';
      };
      const r = this.columns.find(column => column.type === 'expand');
      if (r && isFunc(r.render)) {
        render = r.render;
      }
      return render;
    },
  },
  methods: {
    rowExpanded(key) {
      const row = this.data.find(d => d._rowKey === key);
      return row && row._isExpand;
    },
  },
};
</script>
