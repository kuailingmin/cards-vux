<template>
  <div class="submit-success">
    <div class="con-top">
      <span class="app-icon">&#xe605;</span>
      <span class="con-top-title">提交成功</span>
    </div>
    <div class="con-bot">
      <x-button class="btn-l" link="/recharge">返回</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
    XButton
  }
})
export default class submitSuccess extends Vue {

}
</script>
<style lang="less">
  .submit-success {
    font-size: 0.14rem;
    overflow: hidden;
    .app-icon {
      font-size: 0.45rem;
      color: #B79E74;
    }
    .con-top-title {
      font-size: 18px;
      color: #3C3C3C;
    }
    .btn-l {
      width: 3.45rem;
      background: #B79E74;
      font-size: 0.16rem;
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

