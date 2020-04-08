import { getUrlSearches } from '@/utils/urls';
import { isEmpty, cloneDeep, isEqual } from 'lodash';

const { user, token, type, code, child_type } = getUrlSearches();

export default {
  data() {
    return {
      conditions: {
        reportType: '0630',
      },
    };
  },
  created() {
    this.handleMenus();
  },
  computed: {
    isSingleReport() {
      return (
        child_type === 'overdueLoanF9' ||
        child_type === 'mainBusinessSituationF9' ||
        child_type === 'bankSpecialComparison'
      );
    },
    needRequestMenus() {
      return child_type === 'overdueLoanF9';
    },
  },
  watch: {
    menus: {
      deep: true,
      handler(val) {
        // console.log(val);
        const selectedResults = this._getSelectedItems(val);
        const options = this._getRequestOptions(selectedResults);
        if (!isEqual(this.lastOptions, options)) {
          // console.log(options);
          this.conditions = Object.keys(options).reduce((results, key) => {
            return { ...results, ...{ [key]: options[key].map(item => item.value).join(',') } };
          }, {});
          // console.log(this.conditions);
          this.getData();
          this.lastOptions = options;
        }
      },
    },
  },
  methods: {
    async handleMenus() {
      let unitObj = {
        name: '单位', //顶部标题 为空或无时 只做占位使用
        type: 'equalSingle', //模板类型
        showName: '', //强制显示名称
        list: [
          {
            name: '',
            single: true,
            hasSelectAll: false,
            list: [
              { name: '默认', value: '', key: 'unitCode', selected: true },
              { name: '亿元', value: '亿', key: 'unitCode' },
              { name: '万元', value: '万', key: 'unitCode' },
            ],
          },
        ],
      };
      let reportObj = {
        name: '报告期', //顶部标题 为空或无时 只做占位使用
        type: 'equalMultiOption', //模板类型
        showName: '', //强制显示名称
        list: [
          {
            name: '报告期',
            hasSelectAll: true,
            cancelable: false,
            list: this.getReportScreenList(),
          },
        ],
      };
      if (this.needRequestMenus) {
        const { data } = await this.$get('/finchinaAPP/finance/getF9NotesParameter.action', {
          user,
          token,
          child_type,
          type,
          code,
        });
        this.menus = this._rebuildMenus(data);
      } else {
        this.menus = $.extend(true, [], [reportObj, unitObj]);
      }
    },
    _rebuildMenus(originMenus) {
      if (isEmpty(originMenus)) return [];
      const data = cloneDeep(originMenus);
      const items = data.reduce((results, cur) => {
        let item = {
          name: cur.root_name,
          type: cur.root_name === '单位' ? 'equalSingle' : 'equalMultiOption',
          showName: child_type !== 'overdueLoanF9' || cur.root_name === '单位' ? '' : '我是最新报告期占位符',
          list: cur.root_list.map(d => {
            return {
              name: d.name !== '单位' ? d.name : '',
              hasSelectAll: d.type !== 'radio',
              single: d.type === 'radio',
              list: d.list.map(k => {
                k.key = d.param;
                return k;
              }),
            };
          }),
        };
        return [...results, item];
      }, []);
      // console.log(items);
      return [...items];
    },
    getReportScreenList() {
      let reportTitle = [],
        reportValue = [],
        activeIndex = [];
      let reportSeasons = ['lasted', '1231', '0630', '0331', '0930'],
        reportSemester = ['lasted', '1231', '0630'];
      if (child_type === 'bankSpecialComparison') {
        reportTitle = ['最新', '年报', '中报', '一季报', '三季报'];
        reportValue = reportSeasons;
        activeIndex = [0, 1];
      } else {
        reportTitle = ['最新', '年报', '中报'];
        reportValue = reportSemester;
        activeIndex = [0, 1];
      }

      return reportTitle.map((report, index) => ({
        name: report,
        key: 'reportType',
        value: reportValue[index],
        selected: activeIndex.indexOf(index) > -1,
      }));
    },
  },
};
