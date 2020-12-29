<template>
  <div class="overflowY-scroll scroll-body">
    <div class="entry-wrapper">
      <div v-for="(data, i) in rebuildData" :key="i">
        <h2 v-if="isShowGroupByCompany">
          <a class="search-relation" v-if="hasRelationLink(data)" @click.prevent="getRelationLink(data)"></a>
          <span @click="toggle(i)" class="title">
            {{ data.type }}：{{ data.name | formatMulCompanyName }}
            <span class="arrow" :class="{ 'arrow-up': isShowDetail(i) }"></span>
          </span>
        </h2>
        <transition-expand>
          <ul class="entry" v-show="isShowDetail(i)">
            <li v-for="(company, index) in data.value" :key="index">
              <div class="table-wrapper">
                <table>
                  <colgroup>
                    <col width="37%" />
                    <col width="35%" />
                    <col width="28%" />
                  </colgroup>
                  <tr v-if="!isJoinDetail">
                    <td colspan="3" class="wrap">
                      <label>信托公司</label>
                      <span>
                        <a :href="getLink(company)" target="_blank">{{ company['对象公司'] }}</a>
                      </span>
                    </td>
                  </tr>
                  <tr v-if="isJoinDetail">
                    <td colspan="3" class="wrap">
                      <label>融资人</label>
                      <span>
                        <a :href="getLink(company)" target="_blank">{{ company['公司'] }}</a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>融资额</label><span>{{ company['融资额'] }}</span>
                    </td>
                    <td>
                      <label>利率</label><span>{{ company['利率'] }}</span>
                    </td>
                    <td>
                      <label>期限</label><span>{{ company['期限'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>披露日</label><span>{{ company['日期'] }}</span>
                    </td>
                    <td>
                      <label>起始日</label><span>{{ company['起始日'] }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </li>
          </ul>
        </transition-expand>
      </div>
    </div>
  </div>
</template>

<script>
import { SIDE_TYPE } from '@/pages/graph/constants';
import { groupByCompany, getLink } from '@/pages/graph/utils';
import mixins from './mixins';
export default {
  name: 'leaseFinance',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [mixins],
  computed: {
    rebuildData() {
      if (this.type === SIDE_TYPE.TRUST_FINANCE_GROUP_COMPANY) {
        return groupByCompany(this.data);
      } else {
        return [{ value: this.data }];
      }
    },
    isShowGroupByCompany() {
      return this.type === SIDE_TYPE.TRUST_FINANCE_GROUP_COMPANY;
    },
    isJoinDetail() {
      return this.type === SIDE_TYPE.TRUST_FINANCE_JOIN_DETAIL;
    },
  },
  methods: {
    getLink,
  },
};
</script>
