<template>
  <div id="app">
    <h2>1、总体介绍</h2>
    <p>
      融资图谱以图形方式，全景展示企业及其子公司（子公司范围：除上市平台外，取直接+间接持股比例大于等于20%的公司；上市平台展示直接+间接持股比例大于等于5%的子公司发行的证券）发生的融资事件，包括以下几种融资类型：股权融资、债券融资、租赁融资、应收账款融资、信托融资、银行借款、银行授信、股权质押。
    </p>
    <p>通过融资图谱，用户可以一键查询企业及其子公司共发生几次融资以及有哪些机构参与了融资，分别参与过几次。</p>
    <p>点击融资明细数据还能查询融资金额、融资期限、利率等数据。</p>
    <h2>2、数据来源</h2>
    <p>
      财汇根据上市公司公告、债券募集说明书、信托产品公告、动产融资统一登记公示系统、工商信息数据、交易所网站等数据来源进行收集整理，统一展示。
    </p>
    <h2>3、功能简述</h2>
    <p>
      搜索融资参与方：在设置界面中，输入融资参与方关键字（融资参与方包括：借款银行、出租人、信托公司、质权人、受让人等）后，图谱上只展示包含该关键字的借款银行、出租人、质权人等机构。
    </p>
    <p>
      包含下属公司：打开该功能时，图谱展示本企业及其下属子公司发生的融资事件；关该功能时，仅展示企业本身的融资事件。该功能默认是打开状态。
    </p>
    <p>
      分支行合并到总行：打开该功能时，所有分支行参与的融资事件都按总行展示；关闭功能时，总行与分支行分开展示。该功能默认是打开状态。
    </p>
    <p>
      融资期限：适用类型：银行借款、信托融资、租赁融资、应收账款融资。未到期表示该笔融资未到披露的截止日期；已到期表示该笔融资已超过截止日期；不确定表示未披露明确的截止日期，无法确认该笔融资是否到期。
    </p>
    <h2>4、指标释义</h2>
    <p>
      融资次数：企业实际发生的融资次数。假如一个企业进行融资时有多个融资对手方，则该企业的融资次数只算一次，融资对手方参与的融资次数各算一次。因此在图谱上可能会出现融资对手方参与的融资次数之和大于公司本身的融资次数。
    </p>
    <p>授信额度：企业披露的最新授信额度。</p>
    <p>
      境内债券/境外债券：企业发行的尚未到期的债券数量；境内发行的跨市场债券统计数量为一只，点击明细可查看各个市场的多条记录。
    </p>
    <p>
      上市平台：企业及子公司已发行上市的证券数量，不包含待上市或已退市证券。上市平台展示直接+间接持股比例大于等于5%的子公司
    </p>
    <div class="small">
      免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议，请于与我们联系，<a
        href="fcnews://chat/feedback"
        target="_blank"
        >线上反馈</a
      >
      或拨打客服热线<a href="tel:021-20219912">021-20219912</a>
    </div>
  </div>
</template>

<script>
import { resize } from '@/utils/dom';

export default {
  mounted() {
    resize({ isAddWaterMark: false });
  },
};
</script>

<style lang="less">
:root {
  font-size: 625%;
  color: #333;
  font-family: 'PingFangSC-Regular', 'PingFang SC Regular', 'microsoft yahei', '宋体', tahoma, arial, simsun, sans-serif;
  height: 100%;

  a,
  button {
    -webkit-touch-callout: none !important;
    user-select: none !important;
  }
}

#app {
  padding: 0.2rem 0.24rem 0.4rem;
  font-size: 0.28rem;
  color: #111111;

  h1 {
    margin: 0 0 0.3rem;
    font-size: 0.32rem;
    text-align: center;
    display: none;
  }

  h2 {
    margin: 0.32rem 0 0.22rem;
    font-size: 0.3rem;

    ~ p {
      margin-top: -0.04rem;
    }
  }

  h3 {
    font-weight: normal;
    font-size: 0.26rem;
    margin: 0 0 0.2rem;
  }

  h4 {
    font-weight: normal;
    margin: 0 0 0.16rem;
  }

  p {
    margin: 0 0 0.08rem;
    line-height: 1.6;

    > a {
      color: #0070c0;
      text-decoration: none;
    }
  }

  ul {
    line-height: 1.6;

    li {
      margin-bottom: 0.08rem;
    }
  }

  .small {
    color: gray;
    font-size: 0.24rem;
    line-height: 1.5;
    margin-top: 0.2rem;

    a {
      color: #0070c0;
      text-decoration: none;
    }
  }
}
</style>
