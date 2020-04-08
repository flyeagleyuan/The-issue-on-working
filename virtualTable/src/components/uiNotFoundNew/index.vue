<template>
  <div id="no-found">
    <div class="bg"></div>
    <div class="msg">此筛选条件下无结果，请重新筛选</div>
  </div>
</template>

<style lang="less">
#no-found {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2.24rem;
  margin: 0 auto;
  transform: translate(-50%, -50%);

  .bg {
    margin: 0 auto 0.84rem;
    width: 2.24rem;
    height: 2.22rem;
    background: url(not_found.png) no-repeat;
    background-size: 100% auto;
  }

  .msg {
    margin: 0 auto;
    color: #c6c6c6;
    font-size: 0.28rem;
    text-align: center;
    font-weight: normal;
    letter-spacing: 0.02rem;
  }
}
</style>
