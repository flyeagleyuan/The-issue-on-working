<template>
  <scroll-loading :data="data" class="overflowY-scroll scroll-body">
    <template #default="{data}">
      <ul class="entry">
        <li v-for="(item, k) in data" :key="k">
          <div class="title-wrapper">
            <div class="title between">
              <div class="box-wrapper">
                <span>{{ item['简称'] }}</span>
                <span>{{ bondCode(item) }}</span>
              </div>
              <div v-if="isShowRating">{{ item['评级'] }}</div>
            </div>
            <div class="title-small">
              {{ item['公司'] }}
            </div>
          </div>
          <div class="table-wrapper">
            <table>
              <colgroup>
                <col width="37%" />
                <col width="35%" />
                <col width="28%" />
              </colgroup>
              <tr>
                <td>
                  <label>{{
                    [SIDE_TYPE.DOMESTIC_BOND_GROUP_COMPANY, SIDE_TYPE.DOMESTIC_BOND_NORMAL_DETAIL].indexOf(type) > -1
                      ? '债券年限'
                      : '剩余年限'
                  }}</label>
                  <span>{{ item['剩余年限'] }}</span>
                </td>
                <td>
                  <label>票面利率</label>
                  <span>{{ item['利率'] }}</span>
                </td>
                <td>
                  <label>规模</label><span>{{ item['余额'] }}</span>
                </td>
              </tr>
            </table>
          </div>
        </li>
      </ul>
    </template>
  </scroll-loading>
</template>

<script>
import { SIDE_TYPE } from '@/pages/graph/constants';
import ScrollLoading from './scrollLoading';
import { oneOf } from '@/utils/utils';

export default {
  name: 'bondFinance',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentData: this.data.slice(0, 30),
    };
  },
  inject: ['root'],
  components: { ScrollLoading },
  computed: {
    isShowRating() {
      return oneOf(this.type, [SIDE_TYPE.DOMESTIC_BOND_GROUP_COMPANY, SIDE_TYPE.DOMESTIC_BOND_NORMAL_DETAIL]);
    },
    SIDE_TYPE: () => SIDE_TYPE,
  },
  methods: {
    // 债券代码
    bondCode(bond) {
      if (oneOf(this.type, [SIDE_TYPE.OVERSEA_BOND_GROUP_COMPANY, SIDE_TYPE.OVERSEA_BOND_NORMAL_DETAIL])) {
        return bond['isin'];
      } else if (oneOf(this.type, [SIDE_TYPE.DOMESTIC_BOND_GROUP_COMPANY, SIDE_TYPE.DOMESTIC_BOND_NORMAL_DETAIL])) {
        return bond['证券代码'];
      }
      return null;
    },
  },
};
</script>
