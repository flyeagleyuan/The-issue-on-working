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
                    <col width="34%" />
                    <col width="33%" />
                    <col width="33%" />
                  </colgroup>
                  <tr>
                    <td colspan="2">{{ company['对象公司'] }}</td>
                    <td class="text-right">
                      <span>{{ company['截止日'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>总额度</label><span>{{ company['总额度'] }}</span>
                    </td>
                    <td>
                      <label>已使用</label><span>{{ company['已使用'] }}</span>
                    </td>
                    <td>
                      <label>余额</label><span>{{ company['剩余'] }}</span>
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
      if (this.type === SIDE_TYPE.BANK_CREDIT_GROUP_COMPANY) {
        return groupByCompany(this.data);
      } else {
        return [{ value: this.data }];
      }
    },
    isShowGroupByCompany() {
      return this.type === SIDE_TYPE.BANK_CREDIT_GROUP_COMPANY;
    },
  },
};
</script>
