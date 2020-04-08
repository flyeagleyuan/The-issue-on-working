<template>
  <form class="menu-columns" @click.stop v-on:submit.prevent="onSubmit">
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
            @click="index = i"
            v-for="(o, i) in list"
            :key="i"
          >
            {{ o.name }}
          </li>
        </ul>
      </div>
      <div class="menu-second needsclick" v-scroll-fix>
        <ul>
          <li v-if="list[index].hasSelectAll" :class="{ 'menu-selected-item': list[index].selectAll }">
            <label :for="'selectAll' + index">
              <input
                class="needsclick"
                :id="'selectAll' + index"
                type="checkbox"
                v-model="list[index].selectAll"
                @change="clickAll()"
              />
              {{ list[index].selectAllName }}
            </label>
          </li>
          <li
            v-for="(item, idx) in list[index].list"
            :key="idx"
            :class="[item.extraClass, { 'menu-selected-item': item.selected, 'menu-lines': item.line > 1 }]"
          >
            <label :for="item.name + idx + index">
              <input
                class="needsclick"
                type="checkbox"
                :id="item.name + idx + index"
                v-model="item.selected"
                @change="checkList(list[index], item)"
              />
              {{ item.name }}
            </label>
          </li>
        </ul>
      </div>
    </div>

    <div class="menu-btns">
      <a @click="$emit('menuReset', idx)">重置</a>
      <!--<a @click="cancel">取消</a>-->
      <button type="submit">确认</button>
    </div>
  </form>
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
    onSubmit() {
      let selectList = [];
      this.list.forEach(d => {
        if (d.selectAll && d.value) {
          selectList.push(d);
        } else {
          d.list &&
            d.list.forEach(o => {
              o.selected && selectList.push(o);
            });
        }
      });

      this.$emit('menuSubmit', { idx: this.idx, list: this.list, selectList });
    },
    cancel() {
      this.$parent.cancel();
    },
    clickAll() {
      this.$nextTick(() => {
        let current = this.list[this.index];

        current.hasSelected = current.selectAll;

        current.list.forEach(o => (o.selected = current.selectAll));

        this.menuStatusChange({ changeGroup: this.list[this.index] });
      });
      this.$emit('menuChange', this.idx);
    },
    menuStatusChange(options) {
      this.$parent.menuStatusChange(
        $.extend(
          {
            idx: this.idx,
            list: this.list,
          },
          options
        )
      );
    },
    checkList(o, item) {
      this.$nextTick(() => {
        this.calcCheckAll(o);

        this.menuStatusChange({ changeGroup: this.list[this.index], item });
      });
      this.$emit('menuChange', this.idx);
    },
    calcCheckAll(o) {
      let selectAll = true,
        hasSelected = false;

      $.each(o.list, (i, obj) => {
        if (!obj.selected) {
          selectAll = false;
        } else {
          hasSelected = true;
        }

        if (!selectAll && hasSelected) return false;
      });

      o.hasSelected = hasSelected;
      o.selectAll = selectAll;
    },
    handleData() {
      let arr = $.extend(true, [], this.clist),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        width = document.body.clientWidth || document.documentElement.clientWidth,
        rate = width / 750,
        mainWidth = (266 - 10 - 28) * rate,
        contentWidth = (750 - 266 - 32 * 2 - 24) * rate;

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
.menu-columns {
  background: #fff;
  flex: auto;
  display: flex;
  flex-direction: column;
  font-size: 0.24rem;
  color: #333;
  /*border-top: 1px solid #DFDFDF;*/
  border-top: 1px solid #dfdfdf;
  height: 100%;

  .menu-content {
    flex: auto;
    display: flex;
    height: 1px;

    .menu-main {
      flex: none;
      width: 2.66rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      ul {
        li {
          line-height: 0.38rem;
          padding: 0.16rem 0.1rem 0.16rem 0.28rem;
          border-bottom: 1px solid #efefef;

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
          padding: 0 0.32rem;
          border-bottom: 1px solid #efefef;

          &.menu-selected-item {
            color: #1482f0;
          }

          label {
            display: block;
            padding: 0.16rem 0.24rem 0.16rem 0;
            line-height: 0.38rem;
            position: relative;

            input {
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);

              &:after {
                background-color: #f6f6f6 !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
