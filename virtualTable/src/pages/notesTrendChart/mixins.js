export const menuMixin = {
  data() {
    return {
      isExpandMenu: false,
      conditions: { unitCode: '' },
    };
  },
  methods: {
    handleMenuToggle(isExpand) {
      // console.log(this._uid);
      this.isExpandMenu = isExpand;
      this.root && this.root.scrollTo(this._uid);
      this.hideChartTooltip();
    },
    menuChange(arr, idx) {
      this.isFirstLoad = true;
      this.menus = arr;
      let selectedVal = '';

      let condition = {};

      arr[idx].list.forEach(o => {
        selectedVal = o.list
          .filter(item => item.selected)
          .map(d => d.value)
          .join(',');

        condition[o.key] = selectedVal;
        let selectedItem = o.list.filter(item => item.selected);
        if (o.key === 'accountingCode') {
          this.selectedName = selectedItem[0].name;
        }
        if (o.key === 'unitCode') {
          this.selectedUnit = selectedItem[0].name;
        }
      });
      // console.log(Object.keys(condition));
      for (let item of Object.keys(condition)) {
        if (!condition[item]) {
          delete condition[item];
          this.$delete(this.conditions, item);
        } else {
          this.$set(this.conditions, item, condition[item]);
        }
      }

      // this.$emit('changeCondition', this.conditions);
      // console.log(JSON.stringify(this.conditions));
      this._getKeyArr();

      // this.keyList = this.conditions.accountingCode && this.conditions.accountingCode.split(',').reverse();
      this.getData();
    },
    hideChartTooltip() {
      this.chart &&
        this.chart.dispatchAction({
          type: 'hideTip',
        });
    },
  },
};
