<template>
  <div class="menu-columns-single" @click.stop>
    <div class="menu-content">
      <div class="menu-main" v-scroll-fix>
        <ul>
          <li
            :class="[
              o.extraClass,
              {
                'menu-active': i === index,
                'menu-has-selected': o.hasSelected,
                'menu-lines': o.line > 1,
              },
            ]"
            class="needsclick"
            @click="index = i"
            v-for="(o, i) in list"
            :key="i"
          >
            {{ o.name }}
          </li>
        </ul>
      </div>
      <div class="menu-second" v-scroll-fix>
        <ul>
          <li
            v-for="(item, idx) in list[index].list"
            :key="idx"
            class="needsclick"
            :class="[item.extraClass, { 'menu-selected-item': item.selected, 'menu-lines': item.line > 1 }]"
            @click="selectItem(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import scrollFix from '../director/scrollFix';

export default {
  props: {
    clist: Array,
    idx: Number,
  },
  directives: {
    scrollFix,
  },
  data() {
    return {
      list: this.handleData(),
      index: 0,
    };
  },
  methods: {
    onSubmit(results) {
      this.$emit('menuSubmit', { idx: this.idx, list: this.list, selectList: results });
    },
    cancel() {
      this.$parent.cancel();
    },
    selectItem(item) {
      let results = [];
      if (item.selected) {
        item.selected = false;
      } else {
        this.list.forEach(o => {
          o.list.forEach(obj => {
            obj.selected = obj.value == item.value;
          });
        });

        results.push(item);
      }

      this.calcCheckAll(this.list[this.index]);

      this.onSubmit(results);
    },
    calcCheckAll(o) {
      let hasSelected = false;

      $.each(o.list, (i, obj) => {
        if (obj.selected) {
          hasSelected = true;
          return false;
        }
      });

      o.hasSelected = hasSelected;
    },
    handleData() {
      let arr = $.extend(true, [], this.clist),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        width = document.body.clientWidth || document.documentElement.clientWidth,
        rate = width / 750,
        mainWidth = (266 - 10 - 28) * rate,
        contentWidth = (750 - 266 - 32 - 10) * rate;

      ctx.font = `${rate *
        24}px 'PingFangSC-Regular','PingFang SC Regular', 'microsoft yahei', '宋体', tahoma, arial, simsun, sans-serif`;

      arr.forEach(o => {
        o.line = Math.ceil(ctx.measureText(o.name).width / mainWidth);

        o.list.forEach(obj => (obj.line = Math.ceil(ctx.measureText(obj.name).width / contentWidth)));

        this.calcCheckAll(o);
      });

      return arr;
    },
  },
  watch: {
    clist: {
      deep: true,
      handler() {
        this.list = this.handleData();
      },
    },
  },
};
</script>

<style lang="less">
.menu-columns-single {
  background: #fff;
  flex: auto;
  display: flex;
  flex-direction: column;
  font-size: 0.24rem;
  color: #333;
  border-top: 1px solid #dfdfdf;
  height: 100%;

  .menu-content {
    flex: auto;
    display: flex;
    height: 100%;

    .menu-main {
      flex: none;
      width: 2.66rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      ul {
        li {
          line-height: 0.38rem;
          padding: 0.16rem 0.1rem 0.16rem 0.28rem;
          border-bottom: 1px solid #dfdfdf;

          /*&.menu-lines {*/
          /*line-height: .35rem;*/
          /*}*/

          &.menu-active {
            background: #f6f6f6;
          }

          &.menu-has-selected {
            color: #1482f0;
          }
        }
      }
    }

    .menu-second {
      flex: auto;
      background: #f6f6f6;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      ul {
        li {
          padding: 0.16rem 0.1rem 0.16rem 0.32rem;
          border-bottom: 1px solid #dfdfdf;
          line-height: 0.38rem;

          &.menu-selected-item {
            color: #1482f0;
          }

          &.menu-lines {
            line-height: 0.35rem;
          }
        }
      }
    }
  }
}
</style>
