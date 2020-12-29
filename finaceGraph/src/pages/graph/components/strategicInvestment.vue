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
                    <col width="37%" />
                    <col width="35%" />
                    <col width="28%" />
                  </colgroup>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>投资日期</label>
                      <span>{{ company['日期'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>投资方</label
                      ><span>
                        <a :href="getLink(company)" target="_blank">{{ company['对象公司'] }}</a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td v-if="isShowGroupByCompany" colspan="3" class="wrap">
                      <label>投资金额</label><span>{{ company['融资额'] }}</span>
                    </td>
                    <td v-if="!isShowGroupByCompany" colspan="3" class="wrap">
                      <label>融资额</label><span>{{ company['融资额'] }}</span>
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
      if (this.type === SIDE_TYPE.STRATEGIC_GROUP_COMPANY) {
        return groupByCompany(this.data);
      } else {
        return [{ value: this.data }];
      }
    },
    isShowGroupByCompany() {
      return this.type === SIDE_TYPE.STRATEGIC_GROUP_COMPANY;
    },
  },
  methods: {
    getLink,
  },
};
</script>
