<template>
  <div class="trend-wrapper">
    <div class="trend-header">
      <menu-head
        :menus="menus"
        class="menu"
        @menuChange="menuChange"
        @onMenuToggle="handleMenuToggle"
        :class="{ 'level-up': isExpandMenu }"
      >
      </menu-head>
    </div>
    <div class="container" v-show="resData && resData.length">
      <div class="title-wrapper">
        <h3>{{ selectedName }}历史趋势</h3>
      </div>
      <div class="chart" ref="chart" style="height: 5.2rem "></div>
      <table-view
        :remove-blank-row="true"
        blank-placeholder="-"
        :blank-values="['', '-']"
        :height="'0.52rem'"
        :columns="columns"
        :data="items"
      ></table-view>
    </div>
    <no-selected-data v-if="!isFirstLoad && (!resData || !resData.length)"></no-selected-data>
  </div>
</template>

<script>
import eCharts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import noSelectedData from '@/components/uiNoSelectedData';

import menuHead from '@/components/uiMenuHead/menuHead';
import tableView from '@/components/uiTableScrollView/uiTable';
import { menuMixin } from './mixins';
import { getFinanceNotesData, getNotesMenuData } from '@/api';
import { getUrlSearches } from '@/utils/urls';
import { resize } from '@/utils/dom';
import formatDate from 'dayjs';
import { normalizeReportName, formatNumber } from '@/utils/utils';

const { itcode, reportType, user, token, child_type, accountingCode } = getUrlSearches();
let splitNumber = 8;
// let unitCode = '亿';

export default {
  name: 'notesTrendChart',
  data() {
    return {
      menus: [],
      items: [],
      columns: [],
      resData: [],
      keyArr: [],
      selectedUnit: '元',
      selectedName: '合计',
      indicatorList: [],
      isFirstLoad: true,
    };
  },
  components: { menuHead, tableView, noSelectedData },
  mixins: [menuMixin],
  created() {
    // this._getMenuData();
  },
  mounted() {
    resize();

    window.addEventListener('resize', () => {
      resize();
    });
    let that = this;
    this.$nextTick(() => {
      this._getKeyArr();
      this.chart = eCharts.init(this.$refs.chart);

      async function getInitPage() {
        await that._getMenuData();
        await that.getData();
      }
      getInitPage();
    });
  },
  watch: {
    resData: {
      handler() {
        this.columns = this._makeColumns();
      },
      deep: true,
    },
    /*selectedName() {
      this.$nextTick(() => {
        this.columns = this._makeColumns();
      });
    },*/
  },
  methods: {
    async getData() {
      // await this._getMenuData();
      // console.log(this.keyArr);
      let _accountingCode = this.keyArr.join(',');
      this.$loading.open();
      const { data } = await getFinanceNotesData({
        itcode,
        reportType,
        user,
        token,
        child_type,
        modeType: 'majorNotes',
        // accountingCode,
        // unitCode: '',
        // accountCodeSelected: this.conditions.accountingCode || accountingCode,
        accountCodeSelected: _accountingCode,
        ...this.conditions,
      });
      // console.log(data);
      this.isFirstLoad = false;
      this.resData = $.extend(true, [], data).sort(function(a, b) {
        return parseInt(b.reportDate) - parseInt(a.reportDate);
      });
      this.handleDefaultUnit();
      this.$loading.close();

      this.items = this._makeTableDataArr();
      this.$nextTick(() => {
        this._renderChart();
      });
    },
    _getKeyArr() {
      this.keyArr = !this.conditions.accountingCode
        ? accountingCode.split(',')
        : this.conditions.accountingCode.split(',').reverse();
      // console.log(JSON.stringify(this.conditions));
      this.handleUnit();
      // console.log(this.selectedUnit);
    },
    handleDefaultUnit() {
      if (!this.conditions.unitCode) {
        //处理单位选择为默认的情况
        let maxVal = 0;
        let amountArr = this.resData.map(item => {
          return item[this.keyArr[0]].value;
        });
        maxVal = Math.max(...amountArr);
        // console.log(maxVal);

        if (maxVal > 100000000) {
          this.selectedUnit = '亿元';
        } else if (maxVal > 10000) {
          this.selectedUnit = '万元';
        }
      }
    },
    handleUnit() {
      this.keyArr[0] === 'nonperformingloanpercent'
        ? (this.selectedUnit = '%')
        : (this.selectedUnit = this.conditions.unitCode ? this.conditions.unitCode + '元' : '元');
    },
    _makeColumns() {
      if (this.indicatorList && this.indicatorList.length) {
        this.indicatorList.map(item => {
          return {
            title: item.name,
            key: item.value,
            className: 'text-right',
          };
        });
      }
      // console.log(this.keyArr);
      return [
        { key: 'reportDate', title: '报告期', fixed: 'left', width: '2rem', className: '' },
        {
          key: this.keyArr[0],
          title: this.selectedName,
          width: '2.3rem',
          className: 'text-right',
        },
        {
          key: this.keyArr[1],
          title: this.selectedName + '同比',
          width: '2.7rem',
          className: 'text-right',
        },
      ];
    },
    _makeTableDataArr() {
      let tableData = $.extend(true, [], this.resData);
      // console.log(JSON.stringify(this.keyArr));
      let that = this;
      return tableData.reduce((results, item) => {
        return [
          ...results,
          {
            reportDate: formatDate(item.reportDate).format('YYYY-MM-DD'),
            [that.keyArr[0]]: item[that.keyArr[0]].svalue,
            [that.keyArr[1]]: item[that.keyArr[1]].svalue,
          },
        ];
      }, []);
    },
    _getMaxValue(arr) {
      let data = arr.map(d => {
        if (d === '-' || d === '') {
          return '0';
        } else {
          return parseFloat(d).toFixed(2);
        }
      });
      const max = Math.max(...data);
      console.log(Math.ceil(max / 9.5) * 10);
      return Math.ceil(max / 9.5) * 10;
    },
    _getMinValue(arr) {
      let data = arr.map(d => {
        if (d === '-' || d === '') {
          return '0';
        } else {
          return parseFloat(d).toFixed(2);
        }
      });
      const min = Math.min(...data);
      console.log(Math.floor(min / 12) * 10);
      return Math.floor(min / 12) * 10;
    },
    _renderChart() {
      let that = this;
      let chartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          position: function(pos, params, dom, rect, size) {
            var obj = {};
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            // 鼠标在上侧时 tooltip 显示到下侧，鼠标在下侧时 tooltip 显示到上侧。
            obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 60;
            return obj;
          },
          formatter: function(params) {
            let temp = '';
            params.forEach((d, index) => {
              let tempStr = index === 0 ? d.name : '';
              let _data = d.data,
                unit = that.selectedUnit.substring(0, 1);
              if (index === 0 && d.seriesName.substr(d.seriesName.length - 1, 1) !== '率') {
                unit = _data < 1 ? '万' : unit;
                _data = d.data > 1 ? parseFloat(d.data).toFixed(2) : parseFloat(d.data * 10000).toFixed(2);
              }
              tempStr +=
                '<br/>' +
                d.marker +
                d.seriesName +
                ': ' +
                (index === 1
                  ? (_data === '-' ? '-' : formatNumber(_data.toString())) + '%'
                  : (parseFloat(_data).toFixed(2) === '0.00' ? '-' : formatNumber(_data.toString())) + unit);
              temp += tempStr;
            });
            return temp;
          },
        },
        legend: {
          data: [that.selectedName, that.selectedName + '同比'],
          bottom: 0,
          itemWidth: 8,
          itemHeight: 8,
          fontSize: 13,
          textStyle: {
            color: '#5c5c5c',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: '',
            axisLabel: {
              rotate: 45,
              interval: 0,
              color: '#8c8c8c',
              fontSize: 10,
            },
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: '#e1e1e1',
              },
            },
          },
        ],
        yAxis: [
          {
            name: '单位：万元',
            type: 'value',
            splitLine: false,
            yAxisIndex: 0,
            axisLine: {
              lineStyle: {
                color: '#dfdfdf',
              },
            },
            axisTick: {
              color: '#b7b7b7',
            },
            axisLabel: {
              color: '#8c8c8c',
              fontSize: 10,
            },
            nameTextStyle: {
              color: '#3c3c3c',
              fontSize: 10,
            },
            splitNumber,
            min: 0,
            /*max: val => {
              return val.max === 0 ? 8 : ((val.max / 9.5) * 10).toFixed(0);
            },*/
          },
          {
            name: '单位： % ',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#dfdfdf',
              },
            },
            axisLabel: {
              color: '#8c8c8c',
              fontSize: 10,
            },
            nameTextStyle: {
              color: '#3c3c3c',
              fontSize: 10,
            },
            splitLine: false,
            /* max: val => {
              return val.max === 0 ? 8 : ((val.max / 9) * 10).toFixed(0);
            },*/
            splitNumber,
          },
        ],
        color: ['#619cff', '#f79066', '#f1d358', '#f26279', '#f18f1c'],
        series: [
          {
            name: '',
            type: 'bar',
            data: '',
            symbolSize: 5,
            barWidth: '30%',
          },
          {
            name: '',
            type: 'line',
            symbol: 'circle',
            yAxisIndex: 1,
            symbolSize: 5,
            showAllSymbol: true,
            data: [],
            connectNulls: true,
          },
        ],
      };
      let optionsSeries = chartOptions.series;
      let divisor = 1;
      if (this.selectedUnit === '亿元') {
        divisor = 100000000;
      } else if (this.selectedUnit === '万元') {
        divisor = 10000;
      }
      let dataArr = this.resData.reverse();

      chartOptions.xAxis[0].data = dataArr.map(d => normalizeReportName(formatDate(d.reportDate).format('YYYYMMDD')));
      // console.log(that.keyArr);
      // console.log(JSON.stringify(dataArr));
      chartOptions.yAxis[0].name = '单位：' + this.selectedUnit;
      optionsSeries[0].data = dataArr.map(d =>
        // d[that.keyArr[0]].value ? parseFloat(d[that.keyArr[0]].value / divisor).toFixed(2) : ''
        d[that.keyArr[0]].value ? parseFloat(d[that.keyArr[0]].value / divisor) : ''
      );
      // console.log(JSON.stringify(chartOptions.yAxis));
      optionsSeries[1].data = dataArr.map(d => {
        let _data = parseFloat(d[that.keyArr[1]].value);
        if (_data) {
          return _data.toFixed(2);
        } else {
          return '-';
        }
      });

      optionsSeries[0].name = that.selectedName;
      optionsSeries[1].name = that.selectedName + '同比';
      // console.log(chartOptions);
      this.chart.setOption(chartOptions);
      this.chart.resize();
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    async _getMenuData() {
      //数据来源：主页面financialNotes中从后台获取的筛选条件，为减少后台请求，直接拿来用
      const { data } = await getNotesMenuData({ child_type });
      // console.log(data);
      let indicator = [];
      let that = this;
      indicator = data[1].root_list[0].list.map((d, index) => {
        if (index === 0) that.selectedName = d.name;
        return { name: d.name, value: d.value + '_tb,' + d.value, selected: index === 0 };
      });

      this.indicatorList = indicator;

      let yearList = [];
      let nowYear = new Date().getFullYear();
      const reportList = new Set();
      for (let i = nowYear; i >= 2012; i--) {
        reportList.add(i);
      }
      yearList = [...reportList];
      let yearReport = yearList
          .map(d =>
            formatDate(d.toString())
              .endOf('year')
              .format('YYYYMMDD')
          )
          .join(','),
        monReport = yearList
          .map(d =>
            formatDate(d + '-6')
              .endOf('month')
              .format('YYYYMMDD')
          )
          .join(',');

      let reportData = [
        { name: '年报', value: yearReport, selected: true },
        { name: '中报', value: monReport },
      ];
      let unitData = [
        { name: '默认', value: '', selected: true },
        { name: '亿元', value: '亿' },
        { name: '万元', value: '万' },
      ];
      this.menus = [
        {
          name: '合计',
          type: 'equalSingle',
          showName: '',
          list: [
            {
              hasSelectAll: false,
              key: 'accountingCode',
              list: indicator,
            },
          ],
        },
        {
          name: '单位',
          type: 'equalSingle',
          showName: '',
          list: [
            {
              hasSelectAll: false,
              key: 'unitCode',
              list: unitData,
            },
          ],
        },
        {
          name: '报告期',
          type: 'equalSingle',
          showName: '',
          list: [
            {
              hasSelectAll: false,
              key: 'reportType',
              list: reportData,
            },
          ],
        },
      ];
    },
  },
};
</script>

<style lang="less">
@import '~@/styles/common';
.trend-wrapper {
  .container {
    margin-top: 0.64rem;
    padding: 0 0.32rem 0.32rem;
    width: 100%;
    box-sizing: border-box;
  }
  .text-right {
    text-align: right;
  }
  .chart {
    margin-bottom: 0.42rem;
  }
  .title-wrapper {
    background-color: #fff;
    margin-top: 0;
    padding-top: 0.32rem;
    padding-bottom: 0.32rem;
    margin-bottom: 0;
    /*padding-left: 0.32rem;*/
    height: 1rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  h3 {
    font-size: 0.32rem;
    margin: 0;
    position: relative;
    padding-left: 0.24rem;
    color: #3c3c3c;
    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0.08rem;
      height: 100%;
      background-color: #1e9df8;
      left: 0;
    }
  }
  .ui-table-header-wrapper {
    height: auto;
  }
  .ui-table-header {
    height: auto;
    padding-bottom: 0;
    th {
      padding-bottom: 0;
    }
  }
}
</style>
