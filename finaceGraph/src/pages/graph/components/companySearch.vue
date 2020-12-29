<template>
  <form class="search" action="#" @submit.prevent="handleSubmit">
    <div class="search-input">
      <label>
        <input
          type="search"
          placeholder="请输入融资参与方关键字"
          v-model="options.keyword"
          ref="inputEl"
          @blur="handleBlur"
        />
      </label>
    </div>
    <ul class="check-options">
      <li>
        <div class="item">
          <span>包含下属公司</span>
          <ui-checkbox
            v-model="options.itType.value"
            type="circle"
            :true-value="options.itType.trueValue"
            :false-value="options.itType.falseValue"
          ></ui-checkbox>
        </div>
      </li>
      <li>
        <div class="item">
          <span>分支行合并到总行</span>
          <ui-checkbox
            v-model="options.groupByType.value"
            type="circle"
            :true-value="options.groupByType.trueValue"
            :false-value="options.groupByType.falseValue"
          ></ui-checkbox>
        </div>
      </li>
    </ul>
    <div class="select-options">
      <div class="title">融资期限：</div>
      <ul>
        <li
          :class="{ active: index === options.financePeriodSelectedIndex }"
          @click="options.financePeriodSelectedIndex = index"
          v-for="(option, index) in options.isExpire"
          :key="index"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
    <div class="btn-submit-wrapper">
      <button class="btn-submit" @click.prevent="handleSubmit">确认</button>
    </div>
  </form>
</template>

<script>
import uiCheckbox from '@/components/uiCheckbox';
import { removeObjectNil } from '@/utils/utils';
import { isEqual } from 'lodash';
export default {
  name: 'companySearch',
  props: {
    conditions: Object,
  },
  data() {
    const { itType, groupByType, isExpire } = this.conditions;
    const expireOptions = [
      { text: '全部', value: '' },
      { text: '未到期', value: '未到期' },
      { text: '已到期', value: '已到期' },
      { text: '不确定', value: '不确定' },
    ];
    const expireIndex = expireOptions.findIndex(d => d.value === isExpire);
    return {
      options: {
        keyword: '',
        itType: {
          trueValue: '',
          falseValue: '1',
          value: itType,
        },
        groupByType: {
          trueValue: '1',
          falseValue: '',
          value: groupByType,
        },
        financePeriodSelectedIndex: expireIndex,
        isExpire: expireOptions,
      },
    };
  },
  inject: ['root'],
  components: { uiCheckbox },
  created() {
    this.lastOptions = $.extend(true, {}, this.options);
  },
  methods: {
    async handleSubmit() {
      const { keyword, itType, groupByType, isExpire, financePeriodSelectedIndex } = this.options;
      this.root.handleSearch(
        removeObjectNil({
          text: keyword,
          itType: itType.value,
          groupByType: groupByType.value,
          isExpire: isExpire[financePeriodSelectedIndex].value,
        })
      );
      this.lastOptions = $.extend(true, {}, this.options);
      this.$refs.inputEl.blur();
    },
    handleBlur() {
      window.scroll(0, 0);
    },
  },
  watch: {
    'root.showSide': {
      immediate: true,
      handler(showSide) {
        if (!showSide) {
          this.options = $.extend(true, {}, this.lastOptions);
        }
      },
    },
    options: {
      deep: true,
      handler(options) {
        this.isDisableForm = isEqual(this.lastOptions, options);
      },
    },
  },
};
</script>
