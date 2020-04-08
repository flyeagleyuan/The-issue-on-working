<template>
  <div class="menu-container">
    <ul class="menu-titles">
      <slot name="left"></slot>
      <li
        :class="[
          {
            'menu-active': i === currentMenuIdx,
            'menu-has-selected': o.selectName || o.showName,
            'menu-head-disabled': o.disabled,
            'menu-order': o.type === 'lineSingle',
          },
          o.extraClass,
        ]"
        v-for="(o, i) in list"
        :key="i"
      >
        <!--<a @click="o.disabled ? '': (currentMenuIdx = (i == currentMenuIdx ? -1: i))">-->
        <a @click="menuClick(o, i)">
          <span v-if="o.showName">{{ showList[i].showName.join('') }}</span>
          <span v-else-if="o.single && o.selectName">{{ o.selectName }}</span>
          <span v-else-if="o.name && (!o.selectName || !o.single)">{{ o.name }}</span>
        </a>
      </li>
      <slot name="right"></slot>
    </ul>

    <!--<div id="menu-cover" v-if="currentMenuIdx != -1 && !menus[currentMenuIdx].disabled" @touchmove.prevent @click="cancel">-->
    <div id="menu-cover" v-if="showCover" @touchmove.prevent @click="cancel">
      <transition name="slide-down">
        <div class="menu-dialog" v-if="menus[currentMenuIdx] && menus[currentMenuIdx].type !== 'picker'">
          <single
            @menuSubmit="submit"
            :type="menus[currentMenuIdx].type"
            v-if="list[currentMenuIdx].single && menus[currentMenuIdx].type !== 'columnSingle'"
            :idx="currentMenuIdx"
            :clist="items"
          ></single>

          <multi-option
            @menuSubmit="submit"
            @onChange="change"
            @menuReset="reset"
            :type="menus[currentMenuIdx].type"
            v-if="/multiOption/i.test(menus[currentMenuIdx].type)"
            :idx="currentMenuIdx"
            :clist="items"
          ></multi-option>

          <columns
            @menuSubmit="submit"
            @menuChange="change"
            @menuReset="reset"
            v-if="menus[currentMenuIdx].type === 'columns'"
            :idx="currentMenuIdx"
            :clist="items"
          ></columns>

          <column-single
            @menuSubmit="submit"
            v-if="menus[currentMenuIdx].type === 'columnSingle'"
            :idx="currentMenuIdx"
            :clist="items"
          ></column-single>

          <column-third
            @menuSubmit="submit"
            @menuReset="reset"
            @menuChange="change"
            v-if="menus[currentMenuIdx].type === 'columnThird'"
            :idx="currentMenuIdx"
            :clist="items"
          ></column-third>

          <date-picker
            @menuSubmit="submit"
            :type="menus[currentMenuIdx].type"
            v-if="menus[currentMenuIdx].type === 'datePicker'"
            :idx="currentMenuIdx"
            :clist="items"
          ></date-picker>
        </div>

        <div v-if="menus[currentMenuIdx] && menus[currentMenuIdx].type === 'picker'" class="menu-picker" @click.stop>
          <div class="menu-picker-head">
            <a @click="clickPicker()">完成</a>
          </div>
          <mt-picker :slots="items" @change="onValuesChange"></mt-picker>
        </div>
      </transition>

      <div class="fill-blank"></div>
    </div>
  </div>
</template>

<script>
import multiOption from './components/multiOption';
import columns from './components/columns';
import columnSingle from './components/columnSingle';
import columnThird from './components/columnThird';
import single from './components/single';
import datePicker from './components/datePicker';
import { Picker } from 'mint-ui';
import 'mint-ui/lib/style.css';

let values = [],
  scrollTop = 0;
// , timer;

export default {
  props: {
    menus: Array,
  },
  created() {
    this.init();
  },
  mounted() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) $('.menu-container').addClass('ios');
  },
  components: {
    columns,
    columnSingle,
    columnThird,
    multiOption,
    single,
    datePicker,
    'mt-picker': Picker,
  },
  data() {
    return {
      showList: [],
      list: [],
      currentMenuIdx: -1,
      showCover: false,
    };
  },
  computed: {
    items: function() {
      return this.currentMenuIdx !== -1 ? $.extend(true, [], this.list[this.currentMenuIdx].list) : [];
    },
  },
  watch: {
    menus: {
      deep: true,
      handler() {
        if (this.showList.length === 0) {
          this.init();
        }
        this.list = this.checkSelect();
        this.listCopy = $.extend(true, [], this.list);
      },
    },
    showCover(value) {
      this.$emit('onMenuToggle', value);

      if (value) {
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add('menu-body-fixed');
        document.body.style.top = -scrollTop + 'px';
      } else {
        document.body.classList.remove('menu-body-fixed');
        document.scrollingElement.scrollTop = scrollTop;
      }
    },
  },
  methods: {
    init() {
      this.menus.forEach((menu, index) => {
        this.$set(this.showList, index, {
          showName: [],
          list: [],
          canReset: true,
          disabled: false,
        });
      });
      this.list = this.checkSelect();
      $.extend(true, [], this.list).forEach((item, i) => (this.showList[i].list = item));
    },
    reset(index) {
      if (this.showList[index].canReset) {
        this.listCopy = $.extend(true, [], this.list);
        this.$set(this.list, index, $.extend(true, {}, this.showList[index].list));
        this.showList[index].canReset = false;
      }
    },
    menuClick(o, i) {
      this.showList.forEach(o => (o.canReset = true));

      if (this.listCopy) this.list = this.listCopy;

      if (o.disabled || i === this.currentMenuIdx) {
        this.currentMenuIdx = -1;

        this.$nextTick(() => {
          this.showCover = false;
        });
      } else {
        this.showCover = true;

        if (this.currentMenuIdx === -1) {
          this.$nextTick(() => {
            this.currentMenuIdx = i;
          });
        } else {
          this.currentMenuIdx = -1;

          this.$nextTick(() => {
            this.currentMenuIdx = i;
          });
        }
      }
    },
    menuStatusChange(o) {
      this.$emit('menuStatusChange', o);
    },
    clickPicker() {
      this.list[this.currentMenuIdx].name = values[0];

      let idx = 0;
      this.list[this.currentMenuIdx].list.forEach(o => {
        if (o.values) {
          o.defaultIndex = o.values.indexOf(values[idx]);
          idx++;
        }
      });

      this.submit({
        idx: this.currentMenuIdx,
        list: this.list[this.currentMenuIdx].list,
        selectList: values,
      });
    },
    onValuesChange(picker, vals) {
      values = vals;
    },
    checkSelect() {
      let arr = $.extend(true, [], this.menus);

      if (arr.length > 4) arr.length = 4;
      // debugger;

      arr.forEach((o, index) => {
        if (o.name) {
          o.single = /single/i.test(o.type); //单选页面type包含single

          let selectName = '';
          if (typeof o.extraClass === 'undefined') o.extraClass = '';

          if (o.type !== 'picker') {
            o.list.forEach((obj, idx) => {
              if (!o.single && typeof obj.hasSelectAll === 'undefined') obj.hasSelectAll = true;
              obj.extraClass = obj.extraClass || '';
              obj.selectAllName = obj.selectAllName || '全部';

              if (obj.list) {
                let selectAll = true;
                obj.list.forEach(item => {
                  if (typeof item.selected === 'undefined') item.selected = false;

                  if (item.selected) {
                    selectName = item.name;
                    if (!o.single) {
                      if (typeof o.showName === 'function') {
                        this.showList[index].showName[idx] = o.showName.call(null, o, index, item);
                      } else {
                        this.showList[index].showName[idx] = obj.single ? selectName : o.showName;
                      }
                    } else {
                      this.showList[index].showName = [
                        typeof o.showName === 'function' ? o.showName.call(null, o, index, item) : o.showName,
                      ];
                    }
                  } else {
                    selectAll = false;
                  }

                  obj.selectAll = selectAll;

                  if (o.type === 'columnThird' && item.list) {
                    if (typeof item.hasSelectAll === 'undefined') item.hasSelectAll = true;
                    item.selectAllName = item.selectAllName || '全部';

                    item.open = false;

                    item.list.forEach(node => {
                      if (typeof node.selected === 'undefined') node.selected = false;

                      if (node.selected) {
                        selectName = node.name;
                      } else {
                        selectAll = false;
                      }
                    });
                  }
                });

                o.selectName = selectAll ? o.name : selectName;

                //datePicker显示名称的特殊处理
                if (o.type === 'datePicker') {
                  if (o.list.dateDuration && o.list.dateDuration.length > 0) {
                    o.showName = o.name;
                  } else {
                    o.showName = o.selectName;
                  }
                  this.showList[index].showName = [o.showName];
                }
              }
            });
          }
        }
      });

      return arr;
    },
    submit(o) {
      // console.log($.extend(true, {}, o))
      // let menu = this.list[o.idx];

      this.list[o.idx].list = o.list;

      // console.log($.extend(true, [], this.list), o.idx,  $.extend(true, [],o.selectList))
      this.$emit('menuChange', $.extend(true, [], this.list), o.idx, o.selectList);
      this.showList[o.idx].canReset = true;

      this.showCover = false;
      this.currentMenuIdx = -1;
    },
    change(index) {
      this.showList[index].canReset = true;
    },
    closeCover({ reset = true } = {}) {
      this.showCover = false;
      this.currentMenuIdx = -1;
      if (reset) {
        this.list.forEach((_, index) => {
          this.reset(index);
        });
      }
    },
    cancel() {
      this.showCover = false;
      this.currentMenuIdx = -1;
      this.showList.forEach(o => (o.canReset = true));
      if (this.listCopy) {
        this.list = this.listCopy;
      }
    },
  },
};
</script>

<style lang="less">
.slide-down-enter-active {
  animation: slide-down 0.5s;
}
.slide-down-leave-active {
  animation: slide-down 0 reverse;
}

@keyframes slide-down {
  0% {
    transform: translate3d(0, -100%, 0);

    /*max-height: 0;*/
  }
  100% {
    transform: translate3d(0);
    /*max-height: calc(~"100% - 3rem");*/
    /*max-height: none;*/
  }
}

.menu-container {
  font-family: 'PingFangSC-Regular', 'PingFang SC Regular', 'microsoft yahei', tahoma, arial, simsun, sans-serif;
  background: #f9f9f9;
  height: 0.64rem;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 0.26rem;
  color: #5c5c5c;
  z-index: 1;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul.menu-titles {
    display: flex;
    padding: 0 0.12rem;
    position: relative;
    z-index: 99;
    background: #f9f9f9;

    li {
      line-height: 0.64rem;
      height: 0.64rem;
      flex: 1;
      text-align: center;
      padding: 0 0.1rem;
      /*min-width: 20%;*/

      &.menu-has-selected {
        a {
          color: #ff7500;

          &:after {
            border-top-color: #ff7a15;
          }
        }
      }

      &.menu-active {
        a {
          color: #ff7500;

          &:after {
            transform-origin: center 0.04rem;
            transform: rotate(180deg);
            border-top-color: #ff7a15;
          }
        }
      }

      &.menu-head-disabled {
        a {
          color: #bbb;

          &:after {
            border-top-color: #dfdfdf;
            transform: rotate(0);
          }
        }
      }

      &.menu-order {
        a {
          &:after {
            width: 0.24rem;
            height: 0.24rem;
            border-width: 0;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAb1BMVEUAAAC7u7u8vLy8vLy9vb28vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy+vr68vLy8vLzAwMDCwsLJycm7u7u8vLy8vLy7u7u9vb29vb28vLy+vr7BwcG7u7u7u7u8vLy9vb27u7u8vLy9vb27u7u7u7thwJTsAAAAJHRSTlMA5qTFg8ay8+vLvo9TKvfaGA4I4dGdhHNjXDYUopaCSUA5Mh4FPw5YAAAAvklEQVQ4y+3Ryw6CMBCF4UERKC1XQRTvet7/GZ1GTINpOmzceRZkFl+aP4HcapWZ6bxXXUHeDUA1nQmwPXpRDETTuQaQL0HQSxAOS1D5CKINkMHGCy+tzjZeQi1/oAVEdWTjQ02MaCyBtBUQ7YGymaPdN2KVXIWm9/7oB8h0fev5LfNlwMm+FEQKwCChImV1k8INo+wpILqwUlpAlLBKg028pmIlvWTjZURGRrw4jFy8cqf2o6bPx09hntTk9gLbfyAdAmg9uQAAAABJRU5ErkJggg==);
            background-size: contain;
            transition: all 0s;
            transform: translateY(-50%);
            margin-top: 0;
          }
        }

        &.menu-has-selected,
        &.menu-active {
          a {
            color: #ff7500;

            &:after {
              transform: translateY(-50%);
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAeFBMVEUAAAD/dgD/dgD/dgD/dwD/dQD/dgD/dgD/dgD/dgD/dgD/dwD/fgD/hgD/igD/dgD/dgD/dgD/dwD/dgD/dgD/dQD/dgD/dQD/dQD/dwD/dwD/dgD/ewD/dQD/dgD/dQD/dQD/dgD/dgD/dwD/eAD/eQD/dwD/dQC1Q86sAAAAJ3RSTlMA5qTFg8az+OvLj1MYCgTyvpsp4dvRhHNjXDYvEvHZva6igklAOR54VxoDAAAAwElEQVQ4y+3RyQ6CQBBF0XJiBkVBZHAe7v//oaAYIiFUb9z5Fp1anFRep6RL4Dp+O96TtJTBZJC0owWbYBDNYdKOM2AVGSA8E0RuguxyFC3AATaVsmkav8orKKofPAVJMAHysU41ksKGfagg2YHdQ9s+qtXpqnR6549+gPw0DgfO8h0Hzs2mUeQCmYbWS7BvWnEfcB4KkgvgegoSC1iOdqpTHQBtU1NeR+KbIJmboMgCt/uHJ4MJ42PxabiyAunyBFCxIrd9zZs1AAAAAElFTkSuQmCC);
            }
          }
        }
      }

      a {
        display: inline-block;
        padding: 0 0.3rem 0 0;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        max-width: 100%;

        &:after {
          content: '';
          display: block;
          position: absolute;
          border: 0.1rem solid transparent;
          border-top-color: #bbb;
          right: 0;
          top: 50%;
          margin-top: -0.06rem;
          transition: all 0.3s;
        }
      }
    }
  }

  #menu-cover {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    padding: 0.64rem 0 0;
    background: rgba(17, 17, 17, 0.3);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .menu-dialog {
      flex: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .menu-selected-tick {
        border-color: #2085ed;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqBAMAAAA37dRoAAAAKlBMVEUAAAAihe1p0v8hhu4ghu0hhu4ghu4hhu4iifAkie8hhu0hh+8ih+4ghe2FOVMaAAAADXRSTlMAgAKjnpimmxsnkX1q25ZFqQAAAK5JREFUKM9tzj0KwkAUReFJUFxFIKBYWVnZCGIfyAZs7LMEwQ24EJfgOvyrzl6ETGQG5tzq8fi43GCp9NsoRSlKUYpSlKIUpShFKUpRilKUohSlKEUpShG6ayjpq71R0mO9p6DPdgUF3YYOSjoDEn0MkV6ARK/LkS4AUuuhHv6U1PoNaz6Rkg3o6+EcKdmAd9i0c8YkCn0Ip3hNdMITJaNw79K3okiieZSiFKUo5QfJS0saban8dwAAAABJRU5ErkJggg==')
          no-repeat right bottom;
        background-size: 0.42rem 0.42rem;
      }

      input {
        width: 0.24rem;
        height: 0.24rem;
        border: none;
        outline: none;
        visibility: hidden;

        &:after {
          content: '';
          position: absolute;
          visibility: visible;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAALVJREFUSA1j3L17938GGEDmMMEEQTQjsgyyBBoblzIUw5D14JQg1kaIYXv27NmG0ygqSjDg8iCyn2BsvI6CKUKncToWXSGMT3sNLCCrQJ6BWUmANiUt7kg0HRwFtPf0qA0EYhksTXIogdKSKbFp6f///5CSh5GR8Q1Q42linESCGlOgBSLg1A0y3MXFxYsEzQSVQn3pSXIYETQZTcGoBWgBgskdDSLMMEETGfpBRHq1gxYEhLgA/3E8Oqr9PbUAAAAASUVORK5CYII=')
            no-repeat #fff;
          background-size: 100% 100%;
        }

        &:checked {
          &:after {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAApRJREFUSA21VTtvE0EQ3rVPIEHss3DOebREmEdtCgQISvIDaPgJgRQIBRTFLmwrIkRp4riiTkMP7SFFQJEWIRkiIURB5EvhsxFFfLfLzNpzurXPhy8SJ9kzN/PN9+3s6/hstSPZ8EmhPankuGGkbzDMWHV3FYM8DMOAeua25UXlLO3KrHIiYZBRzFbNXUHUYq1btJpyJrYiWlGVRPxZVfed0gjnaDAqQS9oscUwULVKAY0qFkkVkywyGZOS4fhCrXdNphn3fcGDLqxa508YhP7iZvcqNuBdmvl5vJ75wiSTgYJTzl2A9XoshWwwI1Vknmhl0plsa51r3QYFyOhsmHtg8IcPPxlY7V8VYDNadPJLKdnaIVECdrVYwSxNHoWemarAqndeU5k2SxQMW9jNx0ywrxRTCla187BQ765RkKwCM/bNqZh3KaYKnErujRBiK1wEk/ELVvbIKZt3CIw2GBLuStwGUCSklE8B/B2Yb4fB6GtNYxEobUP8B4BvjYLxPVCg5Nj+p8TQagojuchXVChNu9qwuwc3Dx9szMNIyrMHSyAwSz0fwqQsn51rvHLY5YPEczROFR+hDuJR/8jOb/au+56wYUoKKZ561i5nd6hkTOCeLY3397lHgDiLl5vHhO15/hys4wHPm5fbK/x3uEYTgLOy/PnAfQs7nMHN9QLuta0wmHy8DPuetPvSnwfiD0C85IwQE1YTgHOFVxnH7xEcnz0Qegktr0HLeDrU96nPpH3qiQXO+cf8OfNK6znvEVmU1QQIAEJN8Jsg9ERIsQtCrxhn7qkUJoz4U/68WURihwpibKQA4UGoAX6jUHcfScFumrls+WiVd6chJo5YAQK1N8x98PeTEFPtfz8HyT87NLQp7V/vOwldhPOgfwAAAABJRU5ErkJggg==');
          }
        }
      }
    }

    .menu-picker {
      background: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #929498;

      .menu-picker-head {
        text-align: right;
        padding: 0 0.34rem;
        background: #f6f6f6;
        line-height: 0.86rem;

        a {
          color: #1482f0;
          font-size: 0.3rem;
        }
      }

      .picker {
        background: #d1d5da;

        .picker-center-highlight {
          &:before,
          &:after {
            background: #a8abaf;
          }
        }
      }
    }

    .fill-blank {
      height: 2.5rem;
      flex: none;
    }

    .menu-btns {
      height: 0.88rem;
      flex: none;
      display: flex;
      text-align: center;
      line-height: 0.88rem;
      font-size: 0.28rem;

      a {
        flex: 1;
        /*border-top: 0.02rem solid #dfdfdf;*/
        border-top: 1px solid #dfdfdf;
        color: #5c5c5c;
      }

      button {
        flex: 1;
        color: #fff;
        background: #1482f0;
        border: none;
      }
    }
  }
}

body.menu-body-fixed {
  position: fixed;
}
</style>
