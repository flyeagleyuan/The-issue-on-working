export default {
  name: 'TableSlot',
  functional: true,
  inject: ['tableRoot'],
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
      'div',
      ctx.injections.tableRoot.$scopedSlots[column.slot]({
        row,
        index,
        column,
      })
    );
  },
};
