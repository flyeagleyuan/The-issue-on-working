import TransitionExpand from '@/components/uiTransitionExpand/TransitionExpand';
import { getUrlSearches, urlQueriesSerialize } from '@/utils/urls';
import { openNewTab } from '@/utils/utils';
const { code, type, user, token } = getUrlSearches();

let isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
export default {
  props: {
    type: {
      required: true,
      type: Number,
    },
    isVerticalDirection: Boolean,
    pointCode: String,
  },
  data() {
    return {
      hiddenIndexes: [],
    };
  },
  inject: ['root'],
  components: { TransitionExpand },
  methods: {
    toggle(index) {
      const idx = this.hiddenIndexes.indexOf(index);
      const isHidden = idx > -1;
      isHidden ? this.hiddenIndexes.splice(idx, 1) : this.hiddenIndexes.push(index);
    },
    isShowDetail(index) {
      return this.hiddenIndexes.indexOf(index) === -1;
    },
    hasRelationLink(company) {
      return (
        company.type === '子公司' &&
        company.code !== code &&
        company.code !== this.pointCode &&
        this.root.searchOptions.itType !== '1'
      );
    },
    async getRelationLink(company) {
      this.$loading.open({ opacity: 0.5 });
      try {
        const companyCode = await this.convertCode(company.code);
        if (companyCode) {
          company.code = companyCode;
          let link =
            '/finchinaAPP/graph/relation.html' +
            urlQueriesSerialize({
              from: companyCode,
              fromtype: 'company',
              to: code,
              totype: type,
              user,
              token,
              target: '_self',
              isHorizontal: `${!this.isVerticalDirection}`,
            });

          if (isIOS) {
            openNewTab(link);
          } else {
            location = link;
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.$loading.close();
      }
    },
    convertCode(companyCode) {
      return new Promise(async (resolve, reject) => {
        if (companyCode && companyCode.length === 8) {
          try {
            const {
              data: [code],
            } = await this.$get('/finchinaAPP/getDictData.action', { code: companyCode, func: 'ITCODE8TO10' });
            resolve(code);
          } catch (e) {
            reject(e);
          }
        } else {
          resolve(companyCode);
        }
      });
    },
  },
};
