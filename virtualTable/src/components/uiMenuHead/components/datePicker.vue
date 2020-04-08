<template>
  <div @click.stop class="date-picker" :class="[{ 'menu-flex-none': !hasScroll }, this.type]">
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
              :class="{ 'menu-selected': o.selected, 'menu-disabled': o.disabled }"
              @click="selectedItem(o, obj)"
            >
              {{ o.name }}
            </dd>
          </dl>
        </li>
      </ul>
    </div>

    <div class="picker-area">
      <h4>自定义</h4>
      <div>
        <input class="date-input" v-model="beginDate" readonly @click="openPicker(beginDate, 'beginDate')" />
        <img class="left" src="../assets/Triangle@2x.png" />
        <span>—</span>
        <input class="date-input" v-model="endDate" readonly @click="openPicker(endDate, 'endDate')" />
        <img class="left" src="../assets/Triangle@2x.png" />
        <button class="date-button" @click="confirmDateDuration">确定</button>
      </div>
    </div>

    <mt-datetime-picker
      ref="picker"
      type="date"
      v-model="pickerValue"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="year1990"
      :endDate="today"
      @confirm="handleConfirm"
    >
    </mt-datetime-picker>

    <power-hint v-if="noPower" @changeHintShow="noPower = false" :hintText="hintText"></power-hint>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'dayjs';
import scrollFix from '../director/scrollFix';
import powerHint from './powerHint';
import { DatetimePicker } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);

export default {
  components: {
    powerHint,
  },
  props: {
    clist: Array,
    idx: Number,
    type: String,
  },
  data() {
    return {
      list: $.extend(true, [], this.clist),
      hasScroll: true,
      dateType: '',
      beginDate: '',
      endDate: '',
      today: new Date(),
      year1990: new Date(1990, 0, 1),
      pickerValue: new Date(),
      noPower: false,
      hintText: '',
    };
  },
  directives: {
    scrollFix,
  },
  methods: {
    cancel() {
      this.$parent.cancel();
    },
    selectedItem(o) {
      if (o.disabled) return;

      this.list['dateDuration'] = [];
      o.selected = !o.selected;

      this.list.forEach(sub => {
        sub.list &&
          sub.list.forEach(node => {
            if (node !== o) node.selected = false;
          });
      });

      let selectList = o.selected ? [o] : [];
      this.$emit('menuSubmit', { idx: this.idx, list: this.list, selectList });
    },
    confirmDateDuration() {
      if (this.beginDate === '' && this.endDate === '') {
        this.hintText = '请至少选择一个时间';
        this.noPower = true;
        return;
      }
      if (this.beginDate !== '' && this.endDate !== '' && parseInt(this.beginDate) > parseInt(this.endDate)) {
        this.hintText = '开始时间不能大于结束时间, 请重新选择';
        this.noPower = true;
        return;
      }

      this.list['dateDuration'] = [this.beginDate, this.endDate];
      let selectList = [this.beginDate, this.endDate];
      this.$emit('menuSubmit', {
        idx: this.idx,
        list: this.list,
        selectList,
      });
    },
    checkHasScroll() {
      this.$nextTick(() => {
        this.hasScroll =
          document.querySelector('.menu-scroll').offsetHeight < document.querySelector('.menu-scroll ul').offsetHeight;
      });
    },
    openPicker(date, type) {
      this.dateType = type;
      if (date) {
        this.pickerValue = new Date(moment(date).format('YYYY-MM-DD'));
      } else {
        this.pickerValue = new Date();
      }
      this.$refs.picker.open();
    },
    handleConfirm(value) {
      if (this.dateType === 'beginDate') {
        this.beginDate = moment(value).format('YYYYMMDD');
      } else if (this.dateType === 'endDate') {
        this.endDate = moment(value).format('YYYYMMDD');
      }

      this.list.forEach(sub => {
        sub.list &&
          sub.list.forEach(node => {
            node.selected = false;
          });
      });
    },
  },
  mounted() {
    if (this.list.dateDuration && this.list.dateDuration.length > 0) {
      this.beginDate = this.list.dateDuration[0];
      this.endDate = this.list.dateDuration[1];
    }

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
  .date-picker {
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

.date-picker {
  background: #fff;
  flex: auto;
  display: flex;
  flex-direction: column;

  &.menu-flex-none {
    flex: none;
  }

  .menu-scroll {
    padding: 0 0 0 0.32rem;
    flex: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    ul {
      padding: 0.32rem 0;

      li {
        overflow: hidden;

        &:last-of-type {
          dl {
            margin-bottom: 0;
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
      width: 29.25%;
      display: inline-block;
      padding: 0 0.24rem;
      margin-bottom: 0.1rem;
      margin-right: 3.9% !important;
      box-sizing: border-box;
      border: 1px solid #dfdfdf;
      text-align: center;
      line-height: 0.44rem;
      height: 0.48rem;
      color: #5c5c5c;
      position: relative;
      /*box-sizing: border-box;*/
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

.picker-area {
  padding: 0 0 0.32rem 0.32rem;
  margin: 0;
  h4 {
    margin: 0;
    padding: 0;
    font-size: 0.26rem;
    font-weight: normal;
  }
  .date-input {
    display: inline-block;
    width: 2.16rem !important;
    height: 0.64rem !important;
    line-height: 0.64rem;
    border-radius: 0.32rem;
    background-color: #f6f6f6;
    margin-top: 0.28rem;
    color: #bbbbbb;
    font-size: 0.26rem;
    padding-left: 0.26rem;
    box-sizing: border-box;
  }
  span {
    margin: 0 0.16rem;
    color: #bbbbbb;
  }
  .date-button {
    width: 1.58rem;
    height: 0.64rem;
    color: #1482f0;
    border-radius: 0.04rem;
    border: 1px solid #1482f0;
    background-color: white;
    margin-left: 0.16rem;
    font-size: 0.28rem;
  }
  img {
    width: 0.2rem;
    position: absolute;
    margin-left: -0.56rem;
    margin-top: 0.55rem;
  }
}
</style>
