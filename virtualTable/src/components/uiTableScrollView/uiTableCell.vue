<template>
  <td :class="classes">
    <slot>
      <template v-if="renderType === 'index' && row._isShowIndex">
        <table-render
          v-if="typeof column.render === 'function'"
          :row="row"
          :column="column"
          :index="index"
          :render="column.render"
        />
        <span v-else>
          {{ typeof column.indexMethod === 'function' ? column.indexMethod(row, naturalIndex) : naturalIndex + 1 }}
        </span>
      </template>
      <template v-if="renderType === 'expand' && row._isShowExpand">
        <span v-if="row._isExpanded" @click="handleExpand">-</span>
        <span v-else @click="handleExpand">+</span>
      </template>
      <template v-if="renderType === 'html'">
        <span v-html="row[column.key]"></span>
      </template>
      <template v-if="renderType === 'render'">
        <table-render :row="row" :column="column" :index="index" :render="column.render" />
      </template>
      <template v-if="renderType === 'slot'">
        <table-slot :row="row" :column="column" :index="index" />
      </template>
      <template v-if="renderType === 'normal'">
        <span>{{ row[column.key] | fillBlank(blankValues, blankPlaceholder) }}</span>
      </template>
    </slot>
  </td>
</template>

<script>
import TableSlot from './slot';
import TableRender from './render';
import { isStr, isArray, oneOf } from './utils';
import { isFunc } from './utils';

export default {
  props: {
    row: Object,
    column: Object,
    index: Number,
    prefixCls: String,
    naturalIndex: Number,
    blankPlaceholder: String,
    blankValues: [Array, String],
    fixed: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      renderType: '',
    };
  },
  inject: ['tableRoot'],
  components: { TableSlot, TableRender },
  filters: {
    fillBlank(value, blankValues, placeholder) {
      if (isStr(blankValues)) {
        if (value === blankValues) {
          return placeholder;
        }
      } else if (isArray(blankValues)) {
        return oneOf(value, blankValues) ? placeholder : value;
      }
      return value;
    },
  },
  computed: {
    classes() {
      return [
        isFunc(this.column.className) ? this.column.className(this.row, this.column) : this.column.className,
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]:
            (!this.fixed && this.column.fixed && oneOf(this.column.fixed, ['left', 'right'])) ||
            (this.fixed && !this.column.fixed) ||
            (this.fixed && this.column.fixed && this.fixed !== this.column.fixed),
          [`${this.prefixCls}-text-${this.column.align}`]: this.column.align,
        },
      ];
    },
  },
  created() {
    if (this.column.type === 'index') {
      this.renderType = 'index';
    } else if (this.column.type === 'expand') {
      this.renderType = 'expand';
    } else if (this.column.render) {
      this.renderType = 'render';
    } else if (this.column.type === 'html') {
      this.renderType = 'html';
    } else if (this.column.slot) {
      this.renderType = 'slot';
    } else {
      this.renderType = 'normal';
    }
  },
  methods: {
    handleExpand() {
      this.tableRoot.handleExpand(this.row, this.naturalIndex);
    },
  },
};
</script>
