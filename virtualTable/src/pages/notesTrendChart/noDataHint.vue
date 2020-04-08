<template>
  <div class="no-data-wrapper">
    <div>暂无相关数据</div>
  </div>
</template>

<script>
export default {
  name: 'noDataHint',
};
</script>

<style lang="less">
.no-data-wrapper {
  margin: 0.72rem auto;
  width: 100%;
  color: #8c8c8c;
  font-size: 0.26rem;
  line-height: 0.36rem;
  div {
    width: 100%;
    text-align: center;
  }
}
</style>
