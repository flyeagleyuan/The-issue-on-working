<template>
  <label for="hide-blank-row" :class="{ disabled }">
    <slot v-if="checkboxPosition === 'left'"></slot>
    <input type="checkbox" id="hide-blank-row" @change="change" :disabled="disabled" :checked="currentValue" />
    <slot v-if="checkboxPosition === 'right'"></slot>
  </label>
</template>

<script>
export default {
  name: 'uiCheckbox',
  props: {
    checkboxPosition: {
      validator(v) {
        return ['right', 'left'].indexOf(v) > -1;
      },
      default: 'right',
    },
    disabled: Boolean,
    value: {
      type: [Number, String, Boolean],
      default: false,
    },
    trueValue: {
      type: [Number, String, Boolean],
      default: true,
    },
    falseValue: {
      type: [Number, String, Boolean],
      default: false,
    },
    label: {
      type: [Number, String, Boolean],
      default: false,
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  methods: {
    change(e) {
      if (this.disabled) return;
      const checked = e.target.checked;
      this.currentValue = checked;
      const value = checked ? this.trueValue : this.falseValue;
      this.$emit('input', value);
      this.$emit('on-change', value);
    },
    updateModel() {
      this.currentValue = this.value === this.trueValue;
    },
  },
  watch: {
    value(val) {
      if (val === this.trueValue || val === this.falseValue) {
        this.updateModel();
      } else {
        throw 'Value should be trueValue or falseValue.';
      }
    },
  },
};
</script>

<style lang="less">
label {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;

  &.disabled {
    opacity: 0.7;
    input:after,
    input:disabled {
      opacity: 0.7;
    }
  }

  input {
    width: 0.24rem;
    height: 100%;
    border: none;
    outline: none;
    position: relative;
    visibility: hidden;
    margin-right: 0.1rem;
    margin-left: 0.1rem;
    display: flex;
    align-items: center;

    &:after {
      content: '';
      display: inline-block;
      visibility: visible;
      width: 0.24rem;
      height: 0.24rem;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAALVJREFUSA1j3L17938GGEDmMMEEQTQjsgyyBBoblzIUw5D14JQg1kaIYXv27NmG0ygqSjDg8iCyn2BsvI6CKUKncToWXSGMT3sNLCCrQJ6BWUmANiUt7kg0HRwFtPf0qA0EYhksTXIogdKSKbFp6f///5CSh5GR8Q1Q42linESCGlOgBSLg1A0y3MXFxYsEzQSVQn3pSXIYETQZTcGoBWgBgskdDSLMMEETGfpBRHq1gxYEhLgA/3E8Oqr9PbUAAAAASUVORK5CYII=')
        no-repeat #fff;
      background-size: 100% 100%;
    }

    &:checked {
      &:after {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAApRJREFUSA21VTtvE0EQ3rVPIEHss3DOebREmEdtCgQISvIDaPgJgRQIBRTFLmwrIkRp4riiTkMP7SFFQJEWIRkiIURB5EvhsxFFfLfLzNpzurXPhy8SJ9kzN/PN9+3s6/hstSPZ8EmhPankuGGkbzDMWHV3FYM8DMOAeua25UXlLO3KrHIiYZBRzFbNXUHUYq1btJpyJrYiWlGVRPxZVfed0gjnaDAqQS9oscUwULVKAY0qFkkVkywyGZOS4fhCrXdNphn3fcGDLqxa508YhP7iZvcqNuBdmvl5vJ75wiSTgYJTzl2A9XoshWwwI1Vknmhl0plsa51r3QYFyOhsmHtg8IcPPxlY7V8VYDNadPJLKdnaIVECdrVYwSxNHoWemarAqndeU5k2SxQMW9jNx0ywrxRTCla187BQ765RkKwCM/bNqZh3KaYKnErujRBiK1wEk/ELVvbIKZt3CIw2GBLuStwGUCSklE8B/B2Yb4fB6GtNYxEobUP8B4BvjYLxPVCg5Nj+p8TQagojuchXVChNu9qwuwc3Dx9szMNIyrMHSyAwSz0fwqQsn51rvHLY5YPEczROFR+hDuJR/8jOb/au+56wYUoKKZ561i5nd6hkTOCeLY3397lHgDiLl5vHhO15/hys4wHPm5fbK/x3uEYTgLOy/PnAfQs7nMHN9QLuta0wmHy8DPuetPvSnwfiD0C85IwQE1YTgHOFVxnH7xEcnz0Qegktr0HLeDrU96nPpH3qiQXO+cf8OfNK6znvEVmU1QQIAEJN8Jsg9ERIsQtCrxhn7qkUJoz4U/68WURihwpibKQA4UGoAX6jUHcfScFumrls+WiVd6chJo5YAQK1N8x98PeTEFPtfz8HyT87NLQp7V/vOwldhPOgfwAAAABJRU5ErkJggg==');
      }
    }
  }
}
</style>
