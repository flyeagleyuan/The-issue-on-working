<template>
  <div class="overflowY-scroll scroll-body">
    <div class="entry-wrapper">
      <div v-for="(data, i) in rebuildData" :key="i">
        <h2>
          <a class="search-relation" v-if="hasRelationLink(data)" @click.prevent="getRelationLink(data)"></a>
          <span class="title" @click="toggle(i)">
            {{ data.name | formatMulCompanyName }}
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
                      <label>公告日</label>
                      <span>{{ company['日期'] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>增发对象</label
                      ><span>
                        <a :href="getLink(company)" target="_blank">{{ company['对象公司'] }}</a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="wrap">
                      <label>增发金额</label><span>{{ company['融资额'] | emptyFilter }}</span>
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
      return groupByCompany(this.data);
    },
  },
  filters: {
    emptyFilter: v => {
      return !v || v == 0 ? '-' : v;
    },
  },
  methods: {
    getLink,
  },
};
</script>
