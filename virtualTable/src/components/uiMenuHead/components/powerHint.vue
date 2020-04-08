<template>
  <div id="power-hint">
    <div class="hint-content">
      <div class="up-content">
        <h3>提示</h3>
        <div>{{ hintText }}</div>
      </div>
      <div class="btn-group">
        <div @click="hideHintPage">确定</div>
        <!--<a :href="goPromote()" target="_blank">提升等级</a>-->
        <!--<div @click="hideHintPage">稍后设置</div>-->
      </div>
    </div>
    <div class="hint-mask"></div>
  </div>
</template>

<script>
export default {
  name: 'powerHint',
  props: ['hintText'],
  data() {
    return {};
  },
  watch: {},
  created() {
    // window.history.pushState(null, '', 'hintPage.html')
  },
  methods: {
    hideHintPage() {
      this.$emit('changeHintShow');
    },
    goPromote() {
      let url = '../../user_rights_and_interests.html',
        searchStr = location.search;
      return url + searchStr;
    },
  },
};
</script>

<style lang="less">
#power-hint {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
  left: 0;
  .hint-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0 auto;
    z-index: 11;
    background-color: rgba(140, 140, 140, 0.5);
  }
  .hint-content {
    width: 5.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 12;
    background: #fff;
    border-radius: 0.32rem;
    .up-content {
      margin: 0.22rem 0 0;
      border-bottom: 0.01rem solid #d4d5d7;
      h3 {
        width: 100%;
        margin: 0.2rem 0;
        text-align: center;
        font-size: 0.34rem;
        line-height: 1;
      }
      div {
        font-size: 0.28rem;
        line-height: 0.38rem;
        padding: 0 0.45rem 0.34rem;
      }
    }
    .btn-group {
      display: flex;
      div,
      a {
        height: 0.88rem;
        line-height: 0.88rem;
        flex: 1;
        text-align: center;
        display: inline-block;
        color: #007aff;
        font-size: 0.34rem;
      }
      div {
        border-right: 0.015rem solid #d4d5d7;
      }
    }
  }
}
</style>
