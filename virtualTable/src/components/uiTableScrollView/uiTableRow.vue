<template>
  <tr :class="[row.className]">
    <slot></slot>
  </tr>
</template>

<script>
export default {
  name: 'row',
  props: {
    row: Object,
    fixed: [Boolean, String],
  },
  inject: ['tableRoot'],
  created() {
    this.$watch(
      'row',
      row => {
        this.$nextTick(() => {
          this.tableRoot.addHeightToList(row._index, this.$el.offsetHeight);
        });
      },
      { deep: true }
    );
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRoot.addHeightToList(this.row._index, this.$el.offsetHeight);
    });
  },
};
</script>
