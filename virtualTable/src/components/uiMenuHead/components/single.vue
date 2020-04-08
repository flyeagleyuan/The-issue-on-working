<template>
  <div @click.stop class="menu-single" :class="[{ 'menu-has-scroll': hasScroll }, this.type]">
    <div class="menu-scroll" v-scroll-fix>
      <ul>
        <li v-for="(obj, idx) in list" :key="idx">
          <dl>
            <dt v-if="obj.name">
              <span v-if="obj.name">{{ obj.name }}</span>
            </dt>

            <dd
              v-for="(o, i) in obj.list"
              :key="i"
              class="needsclick"
              :class="[o.extraClass, { 'menu-selected': o.selected, 'menu-disabled': o.disabled }]"
              @click="selectedItem(o, obj)"
            >
              {{ o.name }}
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
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
    cancel() {
      this.$parent.cancel();
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

      this.list.forEach(sub => {
        sub.list &&
          sub.list.forEach(node => {
            if (node !== o) node.selected = false;
          });
      });

      let selectList = o.selected ? [o] : [];

      this.$emit('menuSubmit', { idx: this.idx, list: this.list, selectList });
      if (obj.cancelable !== false || (obj.cancelable === false && o.selected === false)) {
        this.$emit('onChange', o, obj);
      }
    },
    checkHasScroll() {
      this.$nextTick(() => {
        this.hasScroll =
          document.querySelector('.menu-dialog').offsetHeight < document.querySelector('.menu-scroll ul').offsetHeight;
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
  .menu-single {
    .menu-scroll {
      ul {
        li {
          dl {
            dd {
              border-width: 0.01rem !important;
            }
          }
        }
      }
    }
  }
}

.menu-single {
  background: #fff;
  /*flex: auto;*/
  flex: none;
  display: flex;
  flex-direction: column;

  &.menu-has-scroll {
    flex: auto;
    height: 100%;
  }

  &.equalSingle {
    .menu-scroll {
      padding-right: 0;
    }

    dl {
      margin: 0 0 0.22rem;

      dd {
        /*width: 2.1rem;*/
        /*margin-right: .28rem;*/
        width: 29.25%;
        margin-right: 3.9%;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 0.02rem;
        padding-right: 0.02rem;

        &:nth-of-type(3n) {
          margin-right: 0;
        }
      }
    }
  }

  &.unEqualSingle {
    font-size: 0.24rem;
  }

  &.lineSingle {
    .menu-scroll {
      ul {
        padding-top: 0;

        li {
          dl {
            margin-bottom: 0.46rem;

            dd {
              display: block;
              border: none;
              text-align: left;
              border-bottom: 1px solid #eee;
              margin: 0;
              line-height: 0.68rem;
              height: auto;

              &.menu-selected {
                border-color: #ff7a15;
              }
            }
          }
        }
      }
    }
  }

  .menu-scroll {
    padding: 0 0.32rem;
    flex: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    ul {
      padding: 0.32rem 0 0;

      li {
        overflow: hidden;

        &:last-of-type {
          dl {
            margin-bottom: 0.4rem;
          }
        }
      }
    }
  }

  dl {
    margin: 0;

    dt {
      overflow: hidden;
      font-size: 0.24rem;
      margin: 0 0 0.16rem;
      color: #8c8c8c;

      label {
        float: right;

        input {
          position: relative;
          top: 0.04rem;
          margin: 0 0.12rem 0 0;
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
      line-height: 0.44rem;
      height: 0.48rem;
      color: #5c5c5c;
      position: relative;
      border-radius: 0.04rem;
      overflow: hidden;

      &.menu-selected {
        border-color: #ff9347;
        color: #ff6b12;
      }

      &.menu-disabled {
        color: #ccc;
        background: #efefef;
      }
    }
  }
}
</style>
