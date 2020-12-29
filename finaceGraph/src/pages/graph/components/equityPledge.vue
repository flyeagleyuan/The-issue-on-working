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
        <transition-expand>
          <ul class="entry" v-show="isShowDetail(i)">
            <li v-for="(company, index) in data.value" :key="index">
              <div class="table-wrapper">
                <table>
                  <colgroup>
                    <col width="35%" />
                    <col width="35%" />
                    <col width="30%" />
                  </colgroup>
                  <tr v-if="!isJoinDetail">
                    <td colspan="3" class="wrap">
                      <label>质权人</label>
                      <span>{{ company['对象公司'] }}</span>
                    </td>
                  </tr>
                  <tr v-if="isJoinDetail">
                    <td colspan="3" class="wrap">
                      <label>出质人</label>
                      <span>{{ company['公司'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>出质标的</label><span>{{ company['出质标的'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>出质股权</label><span>{{ company['出质股权数'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>披露日</label><span>{{ company['日期'] }}</span>
                    </td>
                    <td>
                      <label>起始日</label><span>{{ company['起始日'] }}</span>
                    </td>
                    <td>
                      <label>截止日</label><span>{{ company['截止日'] }}</span>
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
import { groupByCompany } from '@/pages/graph/utils';
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
      if (this.type === SIDE_TYPE.PLEDGE_GROUP_COMPANY) {
        return groupByCompany(this.data);
      } else {
        return [{ value: this.data }];
      }
    },
    isShowGroupByCompany() {
      return this.type === SIDE_TYPE.PLEDGE_GROUP_COMPANY;
    },
    isJoinDetail() {
      return this.type === SIDE_TYPE.PLEDGE_JOIN_DETAIL;
    },
  },
};
</script>
