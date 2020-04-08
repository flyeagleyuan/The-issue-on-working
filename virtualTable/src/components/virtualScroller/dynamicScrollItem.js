export default {
  name: 'dynamicScrollItem',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    row: {
      type: [Object, Array],
      required: true,
    },
  },
  inject: {
    updateRowHeightList: {
      default: () => () => {},
    },
  },
  methods: {
    updateSize() {
      this.$nextTick(() => {
        const rowHeight = this.$el.scrollHeight;
        this.updateRowHeightList && this.updateRowHeightList(this.row.__index, rowHeight);
      });
    },
  },
  watch: {
    row: {
      immediate: true,
      handler(row) {
        !row['_rendered'] && this.updateSize();
      },
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        on: {
          click: () => {
            this.$emit('click', this.row);
          },
        },
      },
      this.$slots.default
    );
  },
};
