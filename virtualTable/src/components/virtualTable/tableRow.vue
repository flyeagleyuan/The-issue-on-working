<template>
  <dynamic-scroll-item
    tag="ul"
    :row="row"
    :class="[classNames('columns__wrapper'), getRowCls(row)]"
    @click="handleRowClick"
  >
    <li
      :class="[
        classNames({ 'table-column': true, 'column-sticky': isSticky(column), 'column-ellipsis': column.ellipsis }),
        getColCls(row, column),
        column.class,
      ]"
      v-for="column in columns"
      :key="column.key"
      :style="[getColumnStyle(column)]"
      ref="column"
    >
      <slot>
        <template v-if="column.type === 'index'">
          <table-render
            v-if="typeof column.render === 'function'"
            :row="row"
            :column="column"
            :index="row.__index"
            :render="column.render"
          />
          <span v-else>
            {{
              typeof column['indexMethod'] === 'function' ? column['indexMethod'](row, row.__index) : row.__index + 1
            }}
          </span>
        </template>
        <template v-else-if="column.type === 'html'">
          <span v-html="row[column.key]"></span>
        </template>
        <template v-else-if="column.type === 'render'">
          <table-render :row="row" :column="column" :index="row.__index" :render="column.render" />
        </template>
        <template v-else-if="column.type === 'slot' || column.slot">
          <table-slot :row="row" :column="column" :index="row.__index" />
        </template>
        <template v-else>
          <span>{{ row[column.key] }}</span>
        </template>
      </slot>
    </li>
  </dynamic-scroll-item>
</template>

<script>
import { styleMixin } from './mixin';
import TableRender from './render';
import TableSlot from './slot';
import { DynamicScrollItem } from '../virtualScroller';
import { isFunc, isStr } from './utils';

export default {
  props: {
    prefix: String,
    row: {
      type: Object,
      default: () => ({}),
    },
    columns: Array,
    rowClass: [String, Function],
    columnClass: [String, Function],
  },
  mixins: [styleMixin],
  inject: ['table'],
  components: { TableRender, TableSlot, DynamicScrollItem },
  methods: {
    getRowCls(row) {
      const rowClass = this.rowClass;
      if (rowClass) {
        if (isStr(rowClass)) return rowClass;
        if (isFunc(rowClass)) return rowClass(row, row.__index);
      }
    },
    getColCls(row, column) {
      const colClass = this.columnClass;
      if (colClass) {
        if (isStr(colClass)) return colClass;
        if (isFunc(colClass)) return colClass(column, row, row.__index);
      }
    },
    handleRowClick(row) {
      this.table && this.table.$emit('rowClick', row, row.__index);
    },
  },
};
</script>
