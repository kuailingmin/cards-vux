<template>
  <div class="order-pay-success">
    <div class="con-top">
      <span><img class="con-top-img" src="../../assets/pay-success.png" alt=""></span>
      <span class="con-top-title">支付成功</span>
    </div>
    <div class="con-bot">
      <x-button class="btn-l" @click.native="handleCheckOrder">查看订单</x-button>
      <x-button class="btn-r" link="/main">返回首页</x-button>
    </div>
  </div>
</template>
<script>
  import { XButton } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, namespace} from 'vuex-class';
const ConfirmOderState = namespace('confirmOrder', State);
@Component({
    components: {
      XButton
    }
  })
  export default class OrderPaySuccess extends Vue {
    @ConfirmOderState orderId
    handleCheckOrder () {
      this.$router.push({
        path: `/order/${this.orderId}`
      });
    }
  }
</script>
<style lang="less">
  .order-pay-success {
    font-size: 0.14rem;
    overflow: hidden;
    .con-top-img {
      width: 0.45rem;
      border: none;
    }
    .con-top-title {
      font-size: 18px;
      color: #3C3C3C;
    }
    .btn-l, .btn-r {
      width: 1.6rem;
      height: 0.44rem;
      font-size: 16px;
      margin: 0 !important;
      background: #B79E74;
    }
    .btn-r {
      background: #ffffff;
      color: #B79E74;
    }
    .con-top {
      height: 0.9rem;
      padding: 0.3rem 0;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
    }
    .con-bot {
      margin-top: 0.15rem;
      height: 0.44rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>

