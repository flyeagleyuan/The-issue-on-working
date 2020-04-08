export default {
  methods: {
    setCellWidth(column) {
      let width = '';
      if (column._width) {
        width = column._width;
      }
      if (width === '0') width = '';
      return width;
    },
  },
};
