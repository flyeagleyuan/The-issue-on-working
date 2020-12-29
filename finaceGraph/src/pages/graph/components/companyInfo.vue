<template>
  <div class="info">
    <div class="info-title">{{ companyName }}{{ symbol ? `[${symbol}]` : '' }}</div>
    <ul class="tags">
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
    <ul class="items">
      <li class="red-point" :class="{ disabled: this.isDisablePoint }">
        <a :href="redPointLink" target="_blank">红点舆情</a>
      </li>
      <li class="detail"><a :href="detailLink" target="_blank">公司详情</a></li>
    </ul>
  </div>
</template>

<script>
import { getF9Link } from '@/utils/appAssist';
import { urlQueriesSerialize } from '@/utils/urls';

export default {
  name: 'companyInfo',
  props: {
    conditions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { type, name, code, symbol } = this.conditions;
    return {
      detailLink: getF9Link({ type, name, code }),
      tags: [],
      companyName: name,
      symbol,
      isDisablePoint: true,
      redPointLink: 'javascript:;',
    };
  },
  inject: ['root'],
  methods: {
    async getInfo(options) {
      const { node, code, type, user, token, _isRoot } = this.conditions;
      this.root.showSide = false;
      if (!_isRoot && node && node._hasInfoTags) {
        this.root.showSide = true;
        this.companyName = node._infoName;
        this.tags = node._infoTags;
        this.detailLink = getF9Link({ code, type, name: this.companyName });
        this.$nextTick(() => {
          this.root.resetSide();
        });
      } else if (_isRoot && this.root._hasRootInfoTags) {
        this.root.showSide = true;
        this.companyName = this.root._rootInfoName;
        this.tags = this.root._rootTags;
        this.detailLink = getF9Link({ code, type, name: this.companyName });
        this.$nextTick(() => {
          this.root.resetSide();
        });
      } else {
        try {
          this.$loading.open({ opacity: 0 });
          const {
            data: { tags, name },
          } = await this.$get(
            '/finchinaAPP/getBondCompanyBasicInfo.action',
            Object.assign({}, { user, token }, options)
          );
          this.companyName = name.replace(/(.*?)(\(.*?\))?/g, '$1');
          this.root.showSide = true;
          this.tags = tags;
          if (node) {
            node._infoTags = tags;
            node._infoName = this.companyName;
            node._hasInfoTags = true;
          }
          if (_isRoot) {
            this.root._rootTags = tags;
            this.root._rootInfoName = this.companyName;
            this.root._hasRootInfoTags = true;
          }
          this.detailLink = getF9Link({ type, code, name });
          this.root.showSide = true;
          this.$nextTick(() => {
            this.root.resetSide();
          });
        } catch (e) {
          console.error(e);
        } finally {
          this.$loading.close();
        }
      }
    },
    getRedPointInfo() {
      const { code, redPointCodes } = this.conditions;
      if (redPointCodes.find(r => r.code === code)) {
        this.isDisablePoint = false;
        this.redPointLink =
          'fcnews://itemsNews' + urlQueriesSerialize({ codes: JSON.stringify(redPointCodes), selectedCode: code });
      } else {
        this.isDisablePoint = true;
        this.redPointLink = 'javascript:;';
      }
    },
  },
  watch: {
    conditions: {
      immediate: true,
      handler(conditions) {
        const { type, code, symbol } = conditions;
        this.symbol = symbol;
        this.tags = [];
        this.getInfo({ type, code });
        this.getRedPointInfo();
      },
    },
  },
};
</script>
