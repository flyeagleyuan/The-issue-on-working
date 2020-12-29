<template>
  <label :class="[`type-${currentType}`, { disabled }]">
    <slot v-if="showSlot && position === 'left'">{{ label }}</slot>
    <input type="checkbox" v-model="model" v-if="group" :disabled="disabled" @change="change" :value="label" />
    <input type="checkbox" v-else @change="change" :disabled="disabled" :checked="currentValue" />
    <slot v-if="showSlot && position === 'right'">{{ label }}</slot>
  </label>
</template>

<script>
import { findComponentUpward } from '@/utils/assist';

export default {
  name: 'uiCheckbox',
  props: {
    position: {
      validator(v) {
        return ['left', 'right'].indexOf(v) > -1;
      },
      default: 'right',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
    type: {
      validator: v => ['square', 'circle'].indexOf(v) > -1,
      default: 'square',
    },
  },
  data() {
    return {
      currentValue: this.value,
      group: false,
      parent: null,
      model: [],
      showSlot: true,
      currentType: this.type,
    };
  },
  mounted() {
    this.parent = findComponentUpward(this, 'uiCheckboxGroup');
    if (this.parent) {
      this.group = true;
      this.currentType = this.parent.type || this.type;
    }

    if (this.group) {
      this.parent.updateModel(true);
    } else {
      this.updateModel();
      this.showSlot = this.$slots.default !== undefined;
    }
  },
  methods: {
    change(e) {
      if (this.disabled) {
        return false;
      }
      const checked = e.target.checked;
      this.currentValue = checked;
      const value = checked ? this.trueValue : this.falseValue;
      this.$emit('input', value);
      if (this.group) {
        this.parent.change(this.model);
      } else {
        this.$emit('on-change', value);
      }
    },
    updateModel() {
      this.currentValue = this.value === this.trueValue;
    },
  },
  watch: {
    value(val) {
      if ([this.trueValue, this.falseValue].indexOf(val) > -1) {
        this.updateModel();
      } else {
        throw '[Error] Value should be trueValue or falseValue.';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;

  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;
    input:after,
    input:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &.type-square {
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

  &.type-circle {
    -webkit-tap-highlight-color: transparent;
    input {
      position: relative;
      margin-right: 0.1rem;
      margin-left: 0.1rem;
      width: 0.89rem;
      height: 0.44rem;
      border: 1px solid #a7a7a7;
      outline: 0;
      border-radius: 0.22rem;
      box-sizing: border-box;
      background-color: #a7a7a7;
      transition: background-color 0.1s, border 0.1s;
      -webkit-appearance: none;
      &:before {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 0.87rem;
        height: 0.42rem;
        border-radius: 0.21rem;
        background-color: #a7a7a7;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
      }
      &:after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 0.2rem;
        background-color: #ffffff;
        box-shadow: 0 0.01rem 0.03rem rgba(0, 0, 0, 0.4);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
      }
      &:checked {
        border-color: #5280e0;
        background-color: #5280e0;
        &:before {
          transform: scale(0);
        }
        &:after {
          transform: translateX(0.44rem);
        }
      }
    }
  }
}

.checkbox-group > .type-circle {
  margin-bottom: 0.2rem;
}
</style>
