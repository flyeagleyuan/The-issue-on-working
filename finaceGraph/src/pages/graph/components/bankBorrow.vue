<template>
  <div class="overflowY-scroll scroll-body">
    <div class="entry-wrapper">
      <div v-for="(data, i) in rebuildData" :key="i">
        <h2 v-if="isShowGroupByCompany">
          <a class="search-relation" v-if="hasRelationLink(data)" @click.prevent="getRelationLink(data)"></a>
          <span class="title" @click="toggle(i)">
            {{ data.type }}：{{ data.name | formatMulCompanyName }}
            <span class="arrow" :class="{ 'arrow-up': isShowDetail(i) }"></span>
          </span>
        </h2>
        <h2 v-if="isShowGroupByBank">借款银行：{{ data.name | formatMulCompanyName }}</h2>
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
                  <tr v-if="!isGroupByType">
                    <td colspan="3" class="wrap">
                      <label>银行</label>
                      <span
                        ><a :href="getLink(company)" target="_blank">{{ company['对象公司'] }}</a></span
                      >
                    </td>
                  </tr>
                  <tr v-if="isGroupByType">
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
                      <label>起始日</label><span>{{ company['起始日'] }}</span>
                    </td>
                    <td>
                      <label>披露日</label><span>{{ company['日期'] }}</span>
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
import { getLink, groupByCompany } from '@/pages/graph/utils';
import { oneOf } from '@/utils/utils';
import mixins from './mixins';
export default {
  name: 'bankBorrow2',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [mixins],
  computed: {
    rebuildData() {
      switch (this.type) {
        case SIDE_TYPE.COMPANY_BORROW_GROUP_COMPANY:
          return groupByCompany(this.data);
        case SIDE_TYPE.COMPANY_BORROW_JOIN_DETAIL:
          return this.groupByBank(this.data);
        default:
          return [{ value: this.data }];
      }
    },
    isShowGroupByCompany() {
      return this.type === SIDE_TYPE.COMPANY_BORROW_GROUP_COMPANY;
    },
    isShowGroupByBank() {
      return this.type === SIDE_TYPE.COMPANY_BORROW_JOIN_DETAIL;
    },
    isGroupByType() {
      return oneOf(this.type, [SIDE_TYPE.COMPANY_BORROW_JOIN_DETAIL, SIDE_TYPE.COMPANY_BORROW_BRANCH_JOIN_DETAIL]);
    },
  },
  methods: {
    getLink,
    groupByBank(data) {
      return data.reduce((results, item) => {
        const company = results.find(r => r.type === item['公司类型'] && r.name === item['对象公司']);
        if (company) {
          company.value.push(item);
        } else {
          results.push({ type: item['公司类型'], name: item['对象公司'], value: [item] });
        }
        return results;
      }, []);
    },
  },
};
</script>
