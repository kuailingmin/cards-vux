<template>
  <div class="recharge">
    <tab>
      <tab-item v-for="(item, index) in tabList" :key="index" :selected="index===0" @on-item-click="onItemClick(index)">{{item.title}}</tab-item>
    </tab>
    <div class="recharge-1" v-show="active===0">
      <div class="r-top">充值金额</div>
      <group>
        <x-input title="￥" onkeypress="return event.keyCode>=48&&event.keyCode<=57 || event.keyCode==46" ng-pattern="/[^a-zA-Z]/" v-model="rechargeVal" @on-blur="rechargeValOnBlur"></x-input>
      </group>
      <div class="r-desc">
        <span class="desc-l">注意：大额支付建议使用转账汇款</span>
        <span class="desc-r" @click="handleRechargeDetail">充值记录</span>
      </div>
      <div class="r-foot">
        <x-button class="r-foot-btn" @click.native="handleToPayLink">微信支付</x-button>
      </div>
    </div>
    <div class="recharge-2" v-show="active===1">
      <div class="r-2-top">
        <span class="r-2-t-l">汇款信息</span>
        <span class="r-2-t-r" @click="handleRechargeDetail">充值记录</span>
      </div>
      <div class="r-2-con">
        <div class="r-2-c-item">
          <span class="r-2-con-l">收款银行</span>
          <span class="r-2-t-l">中国工商银行浙江分行</span>
        </div>
        <div class="r-2-c-item">
          <span class="r-2-con-l">收款人</span>
          <span class="r-2-t-l">李晓明</span>
        </div>
        <div class="r-2-c-item">
          <span class="r-2-con-l">收款账号</span>
          <span class="r-2-t-l">147298762836846282</span>
        </div>
      </div>
      <div class="r-top">汇款金额</div>
      <group class="r-2-remit">
        <x-input title="￥" v-model="remitVal" @on-blur="remitValOnBlur"></x-input>
      </group>
      <div class="r-2-top r-2-foot">
        <span class="r-2-t-l">汇款底单</span>
        <span class="app-icon">&#xe6e9;</span>
      </div>
      <div class="upload-img">
        <uploader
          :max="varmax"
          :images="images"
          :handle-click="true"
          :show-header="false"
          :readonly="false"
          :upload-url="uploadUrl"
          :params="params"
          size="small"
          :handleClick="false"
          @preview="previewMethod"
          @add-image="addImageMethod"
          @remove-image="removeImageMethod">
        </uploader>
      </div>
      <div class="r-foot">
        <x-button class="r-foot-btn" link="/submitSuccess">提交</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, Tab, TabItem, XInput, Group, Toast } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import Uploader from 'vux-uploader';
import {State, Action, Mutation, namespace} from 'vuex-class';
const rechargeState = namespace('recharge', State);
const rechargeAction = namespace('recharge', Action);
const rechargeMutation = namespace('recharge', Mutation);
@Component({
  components: {
    XButton,
    Tab,
    TabItem,
    XInput,
    Group,
    Uploader,
    Toast
  }
})
export default class OrderPaySuccess extends Vue {
  @rechargeState payLink
  @rechargeAction init
  @rechargeMutation getLink
  rechargeVal = '';
  remitVal = '';
  active = 0;
  varmax = 1;
  images = [];
  uploadUrl = 'http://cardshopapi.koudaiqifu.cn/site/upload';
  params = {};
  tabList = [{ title: '在线支付' }, { title: '转账汇款' }];
  handleRechargeDetail () {
    this.$router.push({
      path: '/rechargeDetailed'
    });
  }
  onItemClick (index) {
    this.active = index;
  }
  handleToPayLink () {
    const params = {
      'balance': this.rechargeVal
    };
    this.init(params).then(msg => {
      if (!msg) {
        window.location.href = this.payLink;
        // this.$router.push({
        //   path: '/rechargeResults'
        // });
      } else {
        this.$vux.toast.text(msg, 'middle');
      }
    }).catch(error => console.log(error));
  }
  rechargeValOnBlur () {
    this.rechargeVal = parseFloat(this.rechargeVal).toFixed(2);
  }
  remitValOnBlur () {}
  previewMethod () {}
  addImageMethod () {}
  removeImageMethod () {}
}
</script>
<style lang="less">
.recharge {
  font-size: 0.14rem;
  overflow: hidden;
  .foot-img {
    width: 0.2rem;
    height: 0.17rem;
  }
  .r-2-foot {
    border: none !important;
  }
  .r-2-remit {
    margin-bottom: 0.15rem;
  }
  .r-2-remit .weui-cell {
    height: 0.5rem;
  }
  .r-2-remit .weui-input {
    font-size: 0.2rem;
    color: #3c3c3c;
  }
  .r-2-remit .weui-label {
    font-size: 0.2rem;
    color: #3c3c3c;
  }
  .r-2-con-l {
    font-size: 0.14rem;
    color: #a6a6a6;
  }
  .r-2-c-item {
    height: 0.33rem;
    padding: 0 0.15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .r-2-con {
    background: #ffffff;
  }
  .r-2-t-l {
    font-size: 0.14rem;
    color: #3c3c3c;
  }
  .r-2-top {
    height: 0.44rem;
    background: #ffffff;
    padding: 0 0.15rem;
    margin-top: 0.15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d9d9d9;
  }
  .weui-cells {
    margin-top: 0 !important;
  }
  .r-foot {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.3rem;
  }
  .r-foot-btn {
    width: 3.45rem;
    background: #b79e74;
    font-size: 0.16rem;
  }
  .desc-l {
    color: #a6a6a6;
  }
  .desc-r {
    color: #b79e74;
  }
  .r-2-t-r {
    color: #b79e74;
  }
  .r-desc {
    height: 0.44rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.15rem;
  }
  .r-inp {
    height: 0.44rem;
    background: #ffffff;
  }
  .r-top {
    height: 0.44rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 0.15rem;
  }
  .vux-tab-ink-bar {
    background-color: #b79e74;
    height: 1px !important;
  }
}
</style>