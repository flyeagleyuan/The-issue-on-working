<template>
  <div class="flex-row flex-auto overflow-hidden">
    <div class="flex-column flex-auto overflow-hidden">
      <div class="bg"></div>
      <div class="tools-bar" :style="toolbarFixed">
        <div class="full-screen" :class="{ collapse: !isVerticalDirection }" @click="changeView">全屏</div>
        <div class="setting" @click="openSetting">设置</div>
      </div>
      <transition :name="!isVerticalDirection ? 'translate-in-right' : 'translate-in-bottom'">
        <div
          v-show="showSide"
          class="side-container"
          ref="sideWrapper"
          :style="[sideStyle]"
          :class="{
            vertical: isVerticalDirection,
            horizontal: !isVerticalDirection,
            index: isIndex,
            expand: isExpandSide,
          }"
        >
          <div class="side-container-inner">
            <div class="close-wrapper">
              <div class="close" @click="closeSide">x</div>
            </div>
            <div class="arrow-wrapper flex-none" @click="toggleSide" v-if="isVerticalDirection" v-scroll-fix>
              <div class="arrow" :class="{ down: isExpandSide }"></div>
            </div>
            <div class="top-wrapper flex-none" v-if="showTopBar" v-scroll-fix>
              <h1><a class="search-relation" v-if="isDomesticBond" @click="getRelationLink"></a>{{ sideTitle }}</h1>
            </div>
            <div class="side-wrapper flex-column flex-auto" :class="{ 'overflow-hidden': isScrollBody }">
              <div class="side flex-column flex-auto" :class="{ 'overflowY-hidden': isScrollBody }">
                <keep-alive>
                  <component
                    ref="side"
                    :is="currentSide"
                    :conditions="conditions"
                    :data="detailData"
                    :type="type"
                    :isVerticalDirection="isVerticalDirection"
                    :pointCode="pointCode"
                    @hook:activated="handleActive"
                    v-scroll-fix
                  ></component>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <mind-map
        :data="data"
        @on-tips-click="handleTipsClick"
        @on-leave-click="handleLeaveClick"
        @on-root-click="handleRootClick"
        :asyncFunction="getNodes"
      ></mind-map>
    </div>
  </div>
</template>

<script>
import { resize, openNewTab } from '@/utils/dom';
import MindMap from './components/mindMap';
import { SIDE_COMPONENTS, SIDE_MAP, SIDE_TYPE, TITLE_MAP } from './constants';
import { getUrlSearches, urlQueriesSerialize } from '@/utils/urls';
import { isArray, isEmpty, isFunc, isNil, isUndef, oneOf, removeObjectNil } from '@/utils/utils';
import { changeViewPort } from '@/utils/appAssist';
import { detectOrient } from '@/pages/graph/utils';

const realInnerHeight = innerWidth > innerHeight ? innerWidth : innerHeight;
let inner5 = realInnerHeight * 0.5;

const { user, token, code, type, isIndex } = getUrlSearches();

// 初始搜索条件
let searchOptions = {
  itType: '',
  groupByType: '1',
  isExpire: '未到期',
};
const components = SIDE_COMPONENTS.reduce(
  (results, r) => {
    return Object.assign(results, { [r]: () => import(`./components/${r}`) });
  },
  { MindMap }
);

export default {
  name: 'graph',
  data() {
    return {
      data: {},
      detailData: [],
      conditions: {},
      type: null,
      showSide: false,
      isVerticalDirection: true,
      sideStyle: {},
      isExpandSide: false,
      side: {
        el: null,
        scrollTop: 0,
        height: 0,
      },
      currentNode: {
        name: '',
        parentName: '',
        node: null,
      },
      pointCode: '',
    };
  },
  components,
  computed: {
    currentSide() {
      return Object.keys(SIDE_MAP).find(key => oneOf(this.type, SIDE_MAP[key]));
    },
    showTopBar() {
      return !oneOf(this.type, [SIDE_TYPE.COMPANY_SEARCH, SIDE_TYPE.COMPANY_INFO]);
    },
    sideTitle() {
      if (!isNil(this.type)) {
        const { name, parentName } = this.currentNode;
        return TITLE_MAP[this.type].replace(/\{0}/g, name).replace(/\{1}/g, parentName);
      }
      return '';
    },
    searchOptions: () => searchOptions,
    isScrollBody() {
      return !oneOf(this.type, [SIDE_TYPE.COMPANY_SEARCH]);
    },
    isIndex: () => isIndex === '1',
    statusBarHeight() {
      return window.statusBarHeight || 0;
    },
    toolbarFixed() {
      if (!this.isVerticalDirection && !isIndex) {
        return {
          marginRight: this.statusBarHeight + 'px',
        };
      }
      return null;
    },
    // 判断境内子公司
    isDomesticBond() {
      if (this.currentNode.node) {
        const { itcode } = this.currentNode.node.data;
        return (
          oneOf(this.type, [SIDE_TYPE.DOMESTIC_BOND_NORMAL_DETAIL]) &&
          itcode !== code &&
          itcode !== this.pointCode &&
          searchOptions.itType !== '1'
        );
      }
      return false;
    },
  },
  provide() {
    return { root: this };
  },
  created() {
    window.changeOrientation = this.changeOrientation.bind(null);
    this.redPointCodes = [];
    this.getData();
  },
  mounted() {
    resize();
    this.checkDirection();
  },
  methods: {
    async getRelationLink() {
      const { itcode } = this.currentNode.node.data;
      if (itcode && itcode.length === 8) {
        try {
          this.$loading.open();
          const {
            data: [companyCode],
          } = await this.$get('/finchinaAPP/getDictData.action', { code, func: 'ITCODE8TO10' });
          openNewTab(
            '/finchinaAPP/graph/relation.html' +
              urlQueriesSerialize({
                from: code,
                to: companyCode,
                fromtype: type,
                totype: 'company',
                user,
                token,
                target: '_self',
                isHorizontal: `${!this.isVerticalDirection}`,
              })
          );
        } catch (e) {
          console.error(e);
        } finally {
          this.$loading.close();
        }
      }
      openNewTab(
        '/finchinaAPP/graph/relation.html' +
          urlQueriesSerialize({
            from: code,
            to: itcode,
            fromtype: type,
            totype: 'company',
            user,
            token,
            target: '_self',
            isHorizontal: `${!this.isVerticalDirection}`,
          })
      );
    },
    toggleSide() {
      if (this.isExpandSide) {
        this.sideStyle = Object.assign({}, this.sideStyle, { height: inner5 + 'px' });
        this.isExpandSide = false;
      } else {
        this.sideStyle = Object.assign({}, this.sideStyle, { height: innerHeight - 50 + 'px' });
        this.isExpandSide = true;
      }
    },
    changeOrientation(isLand) {
      this.isVerticalDirection = !isLand;
    },
    changeView() {
      const toHorizontal = this.isVerticalDirection;
      changeViewPort(toHorizontal);
    },
    checkDirection() {
      this.isVerticalDirection = detectOrient();
    },
    async getDetailData({ selectnameDetail, selectname }) {
      const isBondDetail = oneOf(this.type, SIDE_MAP.bondFinance);
      // 债券融资节点特殊处理，点击第二根线时，显示xxx债券融资详情
      let detailName;
      const pointName = this.pointName.replace(/(.*?)及其子公司$/, '$1');
      if (isBondDetail) {
        detailName = isUndef(selectnameDetail) ? pointName : selectnameDetail;
      } else {
        detailName = pointName;
      }
      this.currentNode = Object.assign({}, this.currentNode, {
        name: detailName /*isUndef(selectnameDetail) ? this.pointName : selectnameDetail*/,
        parentName: selectname,
      });
      try {
        this.$loading.open({ opacity: 0.5 });
        const { data } = await this.$get(
          '/finchinaAPP/getFinanceGraphDetail.action',
          removeObjectNil(
            Object.assign(
              {
                user,
                token,
                selectnameDetail,
                code,
                selectname,
                type,
                showall: 'all',
              },
              searchOptions
            )
          )
        );
        this.detailData = data;
        this.showSide = true;
        this.resetSide();
      } catch (e) {
        console.error(e);
      } finally {
        this.$loading.close();
      }
    },
    sendMapRequest(options = {}) {
      return this.$get(
        '/finchinaAPP/getFinanceGraph.action',
        Object.assign({}, { user, token, code, type, showall: 'all' }, options)
      );
    },
    async getData() {
      try {
        this.$loading.open();
        const {
          data: { pointname, ITCode2 },
        } = (this.data = await this.sendMapRequest(searchOptions));
        this.pointName = pointname;
        this.pointCode = ITCode2;
      } catch (e) {
        console.error(e);
      } finally {
        this.$loading.close();
      }
    },
    async handleSearch(options) {
      try {
        searchOptions = options;
        this.$loading.open({ opacity: 0.5 });
        this.showSide = false;
        this.data = await this.sendMapRequest(options);
      } catch (e) {
        console.error(e);
      } finally {
        this.$loading.close();
      }
    },
    closeSide() {
      this.showSide = false;
    },
    openSetting() {
      this.type = SIDE_TYPE.COMPANY_SEARCH;
      this.conditions = searchOptions;
      this.showSide = true;
    },
    getNodes(nodes, data) {
      return this.getAllRedPoints(nodes, data);
    },
    getRootName(sName, symbol) {
      let alias;
      const symbolCode = symbol ? `[${symbol}]` : '';
      if (sName) {
        const { itType } = searchOptions;
        alias = itType === '1' ? sName : `${sName}${symbolCode}及子公司`;
      } else {
        alias = this.pointName;
      }
      return alias;
    },
    // 获取所有红点舆情公司
    getAllRedPoints(nodes, data) {
      return new Promise((resolve, reject) => {
        const codes = Object.keys(nodes);
        if (!isEmpty(codes)) {
          this.$get('/finchinaAPP/getNewsCount.action', { user, token, itcode: codes.join(',') })
            .then(({ data: { return0: pathes } }) => {
              const withPointNodes = pathes.filter(path => path.row);
              const keys = ['in1d', 'in1m', 'in7d'];
              this.redPointCodes = withPointNodes.reduce((results, point) => {
                const {
                  row: {
                    pathDetail: [detail],
                  },
                } = point;
                if (keys.some(key => detail[key] > 0)) {
                  return results.concat([{ code: detail.code, type, name: nodes[detail.code].name }]);
                }
                if (detail.symbol && detail.code === code) {
                  const symbolObject = searchOptions.itType === '1' ? { symbol: detail.symbol } : {};
                  Object.assign(data, symbolObject, { alias: this.getRootName(detail.sName, detail.symbol) });
                }
                return results;
              }, []);
              this.setTreeData(data, { warn: true }, item => this.redPointCodes.find(r => r.code === item.itcode));
              resolve();
            })
            .catch(err => reject(err));
        } else {
          resolve();
        }
      });
    },
    // 递归操作子节点
    setTreeData(data, valueObject, cb) {
      if (data) {
        if (isFunc(cb)) {
          if (cb(data)) {
            Object.assign(data, valueObject);
          }
        } else {
          Object.assign(data, valueObject);
        }
        if (isArray(data.children) && !isEmpty(data.children)) {
          data.children.forEach(item => {
            this.setTreeData(item, valueObject, cb);
          });
        }
      }
    },
    // 点击线节点
    handleTipsClick(node) {
      console.log(node);
      this.showSide = false;
      const { data } = node;
      this.$set(this.currentNode, 'node', node);
      if (!isUndef(data.detailtype)) {
        const trim = str => str.replace(/\n/, '');
        this.type = parseInt(data.detailtype);
        if (data._isLeave) {
          this.getDetailData({
            selectnameDetail: data.name,
            selectname: trim(node.parent.data.name),
          });
        } else if (data._isCategory) {
          this.getDetailData({ selectname: trim(data.name) });
        }
      }
    },
    // 点击叶子节点
    handleLeaveClick(node) {
      this.type = SIDE_TYPE.COMPANY_INFO;
      this.currentNode.node = node;
      const {
        data: { itcode: code, name, symbol, type: nodeType },
      } = node;
      const companyType = !isUndef(nodeType) ? nodeType : 'company';
      this.conditions = {
        code,
        name,
        symbol,
        type: companyType,
        node,
        user,
        token,
        redPointCodes: this.redPointCodes,
      };
    },
    handleRootClick() {
      this.type = SIDE_TYPE.COMPANY_INFO;
      this.conditions = { code, name, type, user, token, redPointCodes: this.redPointCodes, _isRoot: true };
    },
    handleScroll(e) {
      const el = e.target;
      Object.assign(this.side, {
        el,
        scrollTop: el.scrollTop,
      });
    },
    resetSide() {
      if (this.isVerticalDirection) {
        this.$nextTick(() => {
          this.$set(this.sideStyle, 'height', '');
          this.$nextTick(() => {
            const height = this.$refs.sideWrapper.scrollHeight;
            if (height > realInnerHeight * 0.5) {
              inner5 = height > realInnerHeight * 0.7 ? realInnerHeight * 0.5 : height;
            } else {
              inner5 = height > realInnerHeight * 0.4 ? height : realInnerHeight * 0.4;
            }
            this.$set(this.sideStyle, 'height', inner5 + 'px');
            this.isExpandSide = false;
          });
        });
      }
    },
    handleActive() {
      this.$refs.side.$nextTick(() => {
        if (this.isVerticalDirection) {
          if (oneOf(this.type, [SIDE_TYPE.COMPANY_SEARCH])) {
            inner5 = realInnerHeight * 0.6;
          } else {
            inner5 = realInnerHeight * 0.5;
          }
          this.resetSide();
        }
      });
    },
  },
  watch: {
    showSide() {
      if (this.isVerticalDirection) {
        setTimeout(() => {
          this.isExpandSide = this.$refs.sideWrapper.clientHeight === innerHeight;
        });
      }
    },
    isVerticalDirection(s) {
      if (!s) {
        this.sideStyle = {};
      } else {
        this.$set(this.sideStyle, 'height', inner5 + 'px');
        this.isExpandSide = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>

<style lang="less" scoped>
@import 'less';
</style>
