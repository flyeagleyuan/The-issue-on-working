<template>
  <div class="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { findComponentsDownward } from '@/utils/assist';

export default {
  name: 'uiCheckboxGroup',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      validator: v => ['square', 'circle'].indexOf(v) > -1,
    },
  },
  data() {
    return {
      currentValue: this.value,
      children: [],
    };
  },
  mounted() {
    this.updateModel(true);
  },
  methods: {
    updateModel(update) {
      this.children = findComponentsDownward(this, 'uiCheckbox');

      if (this.children) {
        this.children.forEach(child => {
          child.model = this.value;

          if (update) {
            child.currentValue = this.value.indexOf(child.label) > -1;
            child.group = true;
          }
        });
      }
    },
    change(data) {
      this.currentValue = data;
      this.$emit('input', data);
      this.$emit('on-change', data);
    },
  },
  watch: {
    value() {
      this.updateModel(true);
    },
  },
};
</script>
