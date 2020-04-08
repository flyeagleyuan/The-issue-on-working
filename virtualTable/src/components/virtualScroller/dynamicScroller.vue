<template>
  <div @scroll.passive="onScrollVertical" :style="wrapperStyle">
    <div :style="bodyStyle" @scroll.passive="onScrollLeft" ref="body">
      <div
        :class="classNames('table-row')"
        v-for="(row, rowIndex) in renderData"
        :key="rowIndex"
        :style="getRowStyle(row)"
      >
        <slot v-bind="{ row, index: row.__index }"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { clearOffsetCache, getOffsetIndex, triggerLast, last } from './utils';

const triggerAtLast = triggerLast(300);

export default {
  name: 'dynamicScroller',
  props: {
    prefix: {
      type: String,
      default: 'dzh--',
    },
    data: Array,
    minRowHeight: Number,
    viewportHeight: Number,
    rowKey: String,
    buffer: {
      type: Number,
      default: 200,
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
    enablePullUp: Boolean,
  },
  data() {
    return {
      renderHeight: this.viewportHeight,
      renderData: [],
      rowHeights: this.data.map(() => this.minRowHeight),
      virtualData: [],
      minItemHeight: this.minRowHeight,
    };
  },
  provide() {
    return {
      updateRowHeightList: this.updateRowHeightList,
    };
  },
  computed: {
    wrapperStyle() {
      return {
        height: this.renderHeight + 'px',
        overflowX: 'hidden',
        overflowY: 'auto',
        '-webkit-overflow-scrolling': 'touch',
      };
    },
    maxRemainCount() {
      return Math.ceil((this.buffer * 2) / this.minItemHeight);
    },
    maxViewportItemCount() {
      return Math.ceil(this.viewportHeight / this.minItemHeight);
    },
    rowsHeightStacks() {
      let tempTotal = 0;
      return this.rowHeights.reduce(
        (total, height, index) => {
          tempTotal += height;
          total[index + 1] = tempTotal;
          return total;
        },
        [0]
      );
    },
    rowsHeightTotal() {
      return this.rowsHeightStacks ? last(this.rowsHeightStacks) : 0;
    },
    bodyStyle() {
      return {
        height: last(this.rowsHeightStacks) + 'px',
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'hidden',
        '-webkit-overflow-scrolling': 'touch',
      };
    },
  },
  created() {
    this.dataToHeight = {};
  },
  methods: {
    classNames(classes) {
      const prefixCls = this.prefix;
      if (typeof classes === 'string') {
        return prefixCls + classes;
      } else if (Array.isArray(classes)) {
        return classes.map(c => prefixCls + c);
      } else if (typeof classes === 'object') {
        return Object.keys(classes).reduce((newObj, key) => {
          return { ...newObj, ...{ [prefixCls + key]: classes[key] } };
        }, {});
      }
      return classes;
    },
    getRowStyle(row) {
      return {
        transform: `translate3d(0, ${row.translateY}, 0)`,
      };
    },
    getVirtualDataIndexToRaw(virtualData) {
      return virtualData.reduce((indexToRaw, item) => {
        indexToRaw[item.__index] = item;
        return indexToRaw;
      }, {});
    },
    calcDomItemHeight(rowsHeightStacks, scrollTop) {
      const buffer = this.buffer;
      const minIndex = scrollTop - buffer <= 0 ? 0 : getOffsetIndex(scrollTop - buffer, rowsHeightStacks);
      const perhapsMaxIndex = minIndex + this.maxRemainCount + this.maxViewportItemCount;
      const maxIndex = perhapsMaxIndex >= rowsHeightStacks.length ? rowsHeightStacks.length - 1 : perhapsMaxIndex;
      return [minIndex, maxIndex];
    },
    refreshRenderData() {
      const virtualScrollBody = this.$el;
      const scrollTop = virtualScrollBody ? virtualScrollBody.scrollTop : 0;
      const [minIndex, maxIndex] = this.calcDomItemHeight(this.rowsHeightStacks, scrollTop);
      this.updateRenderData(this.buildRenderData(minIndex, maxIndex));
    },
    buildRenderData(minIndex, maxIndex) {
      const rowsHeightStacks = this.rowsHeightStacks;
      const startIndex = minIndex >= 0 ? minIndex : -1;
      const endIndex = maxIndex > this.virtualData.length ? this.virtualData.length : maxIndex;
      const renderData = [];
      for (let index = startIndex; index < endIndex; index++) {
        const item = this.virtualData[index];
        const recordIndexHeight = rowsHeightStacks[index];
        item.__key = index;
        item.translateY = `${recordIndexHeight}px`;
        renderData.push(item);
      }
      return renderData;
    },
    updateRenderData(newData) {
      if (this.renderData.length === 0) {
        this.renderData = newData;
        return;
      }
      const newItems = this.buildNewItems(newData);
      const replaceItemIndex = this.buildOutDateItems(newData);
      this.refreshVirtualItems(newItems, replaceItemIndex);
    },
    buildNewItems(newData) {
      const newItems = [];
      const renderData = this.renderData;
      for (const newRecord of newData) {
        if (!renderData.some(item => item.__key === newRecord.__key)) {
          newItems.push(newRecord);
        }
      }
      return newItems;
    },
    buildOutDateItems(newData) {
      const replaceItemsIndex = [];
      for (const [index, record] of this.renderData.entries()) {
        if (!newData.some(item => item.__key === record.__key)) {
          replaceItemsIndex.push(index);
        }
      }
      return replaceItemsIndex;
    },
    refreshVirtualItems(newItems, replaceItemsIndex) {
      if (
        newItems.length === this.renderData.length &&
        newItems.every(d => this.renderData.some(r => r.__index === d.__index))
      ) {
        this.renderData = newItems;
        return;
      }
      for (const [index, newRecord] of newItems.entries()) {
        if (index < replaceItemsIndex.length) {
          this.$set(this.renderData, replaceItemsIndex[index], newRecord);
        } else {
          this.renderData.push(newRecord);
        }
      }
    },
    onScrollVertical(e) {
      this.lock = true;
      window.requestAnimationFrame(this.refreshRenderData);
      triggerAtLast(() => {
        this.lock = false;
      });
      this.enablePullUp && this.rowsHeightTotal - this.viewportHeight - e.target.scrollTop < 200 && this.handleNext();
      this.$emit('scrollVertical', e.target.scrollTop, e);
    },
    onScrollLeft(e) {
      this.$emit('scrollHorizontal', e.target.scrollLeft, e);
    },
    updateRowHeightList(index, height) {
      const row = this.virtualDataIndexToRaw[index];
      if (row) row['_rendered'] = true;
      const rowHeights = this.rowHeights;
      if (rowHeights[index] !== height) {
        this.$set(rowHeights, index, height);
        if (height < this.minRowHeight) this.minItemHeight = height;
        const rowKey = this.rowKey;
        if (this.enablePullUp && this.rowKey) this.dataToHeight[row[rowKey]] = height;
        clearOffsetCache();
        !this.lock && this.refreshRenderData();
      }
    },
    handleNext() {
      if (!this.nextLock && !this.isReachBottom) {
        this.$emit('next', this.finishNext);
        this.nextLock = true;
      }
    },
    finishNext(isReachBottom) {
      this.nextLock = false;
      this.isReachBottom = isReachBottom;
    },
    resize() {
      this.dataToHeight = {};
      this.$el.scrollTop = 0;
      this.$refs.body && (this.$refs.body.scrollLeft = 0);
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(data) {
        clearOffsetCache();
        this.renderData = [];
        const rowKey = this.rowKey;
        const dataToHeight = this.dataToHeight || {};
        const minRowHeight = this.minRowHeight;
        if (rowKey && this.enablePullUp) {
          this.rowHeights = data.map(row => (dataToHeight[row[rowKey]] ? dataToHeight[row[rowKey]] : minRowHeight));
        } else {
          this.rowHeights = data.map(() => minRowHeight);
        }
        this.virtualData = data.map((d, index) => {
          d.__index = index;
          return d;
        });
        this.virtualDataIndexToRaw = this.getVirtualDataIndexToRaw(this.virtualData);
        this.refreshRenderData();
      },
    },
    viewportHeight(val) {
      this.renderHeight = val;
      this.refreshRenderData();
    },
    scrollLeft(scrollLeft) {
      const els = [this.$refs.body];
      for (let el of els) {
        el.scrollLeft = scrollLeft;
      }
    },
  },
};
</script>
