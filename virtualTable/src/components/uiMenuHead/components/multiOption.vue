<template>
  <form
    @click.stop
    class="menu-multi-option"
    :class="[{ 'menu-has-scroll': hasScroll }, type]"
    v-on:submit.prevent="onSubmit"
  >
    <div class="menu-scroll" v-scroll-fix>
      <ul>
        <li v-for="(obj, idx) in list" :key="idx">
          <dl>
            <dt v-if="obj.name || typeof obj.hasSelectAll === 'undefined' || obj.hasSelectAll">
              <span v-if="obj.name">{{ obj.name }}</span>

              <label
                :for="obj.name"
                v-if="typeof obj.hasSelectAll === 'undefined' || obj.hasSelectAll"
                @change="checkAll(obj)"
              >
                <input type="checkbox" v-model="obj.selectAll" :id="obj.name" />{{ obj.selectAllName }}
              </label>
            </dt>

            <dd
              v-for="(o, i) in obj.list"
              :key="i"
              class="needsclick"
              :class="[
                o.extraClass,
                {
                  'menu-selected-tick': o.selected,
                  'menu-disabled': o.disabled,
                },
              ]"
              @click="selectedItem(o, obj)"
            >
              <span>{{ o.name }}</span>
            </dd>
          </dl>
        </li>
      </ul>
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
    type: String,
  },
  data() {
    return {
      list: $.extend(true, [], this.clist),
      hasScroll: true,
    };
  },
  directives: {
    scrollFix,
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
              if (o.selected) selectList.push(o);
            });
        }
      });

      this.$emit('menuSubmit', { idx: this.idx, list: this.list, selectList });
    },
    cancel() {
      this.$parent.cancel();
    },
    checkAll(obj) {
      if (obj.disabled) return;

      this.$nextTick(() => {
        obj.list.forEach(o => {
          if (!o.disabled) o.selected = obj.selectAll;
        });

        this.list = $.extend(true, [], this.list);
      });
      this.$emit('onChange', this.idx);

      this.menuStatusChange({ changeGroup: obj });
    },
    selectedItem(o, obj) {
      if (o.disabled) return;

      o.selected = !o.selected;

      if (obj.cancelable === false) {
        const isAllUnCheck = obj.list.every(item => !item.selected);
        if (isAllUnCheck) {
          o.selected = true;
        }
      }

      if (o.cancelable === false) {
        o.selected = true;
      }

      if (typeof obj.hasSelectAll === 'undefined' || obj.hasSelectAll) {
        if (o.selected && !obj.selectAll) {
          let selectAll = true;
          $.each(obj.list, (i, item) => {
            if (!item.selected) {
              selectAll = false;
              return false;
            }
          });

          obj.selectAll = selectAll;
        } else if (!o.selected && obj.selectAll) {
          obj.selectAll = false;
        }
      } else if (obj.single) {
        obj.list.forEach(d => {
          d.selected = d.name === o.name;
        });
      } else if (obj.radio) {
        obj.list.forEach(d => {
          d.selected = d.name === o.name ? d.selected : false;
        });
      }

      if (obj.cancelable !== false || (obj.cancelable === false && o.selected === false)) {
        this.$emit('onChange', this.idx, o, obj);
      }

      this.menuStatusChange({ item: o, changeGroup: obj });
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
    checkHasScroll() {
      this.$nextTick(() => {
        this.hasScroll =
          document.querySelector('.menu-scroll ul').offsetHeight +
            document.querySelector('.menu-btns').offsetHeight +
            10 >
          document.querySelector('.menu-dialog').offsetHeight;
      });
    },
  },
  mounted() {
    this.checkHasScroll();
  },
  watch: {
    clist: {
      deep: true,
      handler() {
        this.list = $.extend(true, [], this.clist);

        this.hasScroll = true;

        this.checkHasScroll();
      },
    },
  },
};
</script>

<style lang="less">
.ios {
  .menu-multi-option {
    dl {
      dd {
        border-width: 0.01rem;
      }
    }
  }
}

.menu-multi-option {
  background: #fff;
  flex: none;
  display: flex;
  flex-direction: column;

  &.menu-has-scroll {
    height: 100%;
    flex: auto;
  }

  &.multiOption {
    .menu-scroll {
      padding-right: 0.12rem;

      dl {
        dt {
          label {
            margin-right: -0.12rem;
          }
        }
      }
    }
  }

  &.equalMultiOption {
    .menu-scroll {
      dl {
        overflow: hidden;

        dt {
          min-height: 0.32rem;
          color: #3c3c3c;
          margin-bottom: 0.22rem;

          label {
            padding-right: 0.32rem;
          }
        }
        dd {
          /*width: 2.1rem;*/
          width: 29.25%;
          height: 0.64rem;
          margin: 0 3.9% 0.16rem 0;
          line-height: 100%;
          padding-left: 0.02rem;
          padding-right: 0.02rem;

          &:nth-of-type(3n) {
            margin-right: 0;
          }
          float: left;
          display: flex;
          span {
            margin: auto;
          }
        }
      }
    }
  }

  .menu-scroll {
    padding: 0 0 0 0.32rem;
    flex: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    min-height: 3rem;

    ul {
      padding: 0.32rem 0 0;
      overflow: hidden;
    }
  }

  dl {
    margin: 0 0 0.24rem;

    dt {
      /*overflow: hidden;*/
      font-size: 0.24rem;
      margin: 0 0 0.16rem;
      color: #8c8c8c;

      label {
        float: right;
        line-height: 0.24rem;
        height: 0.24rem;
        padding: 0.24rem 0.32rem 0.24rem 1.66rem;
        margin: -0.2rem 0;
        position: relative;

        input {
          position: absolute;
          top: 0.24rem;
          left: 1.3rem;
        }
      }
    }

    dd {
      display: inline-block;
      padding: 0 0.24rem;
      margin: 0 0.16rem 0.1rem 0;
      box-sizing: border-box;
      border: 1px solid #dfdfdf;
      text-align: center;
      line-height: 0.48rem;
      color: #5c5c5c;
      position: relative;
      border-radius: 0.04rem;
      overflow: hidden;

      &.menu-selected-tick {
        background-size: 0.28rem 0.28rem !important;
      }

      &.menu-disabled {
        color: #ccc;
        background: #efefef;
      }
    }
  }
}
</style>
