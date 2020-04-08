export default {
  name: 'TableSlot',
  functional: true,
  inject: ['table'],
  props: {
    row: Object,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, ctx) => {
    const {
      props: { column, row, index },
    } = ctx;
    return h(
      column.tag || 'span',
      ctx.injections.table.$scopedSlots[column.slot]({
        row,
        index,
        column,
      })
    );
  },
};
