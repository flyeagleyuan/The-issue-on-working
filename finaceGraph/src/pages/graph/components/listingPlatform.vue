<template>
  <scroll-loading class="overflowY-scroll scroll-body" :data="data">
    <template #default="{ data }">
      <ul class="entry">
        <li v-for="(item, k) in data" :key="k">
          <div class="title-wrapper">
            <div class="title between listing">
              <span>{{ getShowName(item) }}</span>
              <span>{{ item['证券类型'] }}</span>
            </div>
          </div>
          <div class="table-wrapper">
            <table>
              <colgroup>
                <col width="37%" />
                <col width="23%" />
                <col width="40%" />
              </colgroup>
              <tr>
                <td colspan="3" class="wrap">
                  <label>发行人</label><span>{{ item['公司'] }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>上市日期</label>
                  <span>{{ item['上市日期'] }}</span>
                </td>
                <td>
                  <label>首次募集资金</label>
                  <span>{{ item['募集资金'] }}</span>
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
import ScrollLoading from './scrollLoading';
export default {
  name: 'listingPlatform',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: { ScrollLoading },
  methods: {
    getShowName(item) {
      return item['证券简称'] && item['证券代码'] && `${item['证券简称']}(${item['证券代码']})`;
    },
  },
};
</script>
