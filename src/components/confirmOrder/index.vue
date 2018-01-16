<template>
  <div class="confirm-order">
    <group>
      <cell v-if="JSON.stringify(confirmOrderInitData.address) !== '{}'" is-link link="/address">
        <div class="address-t"><span class="address-name">{{confirmOrderInitData.address.name}}</span>&nbsp;<span>{{confirmOrderInitData.address.phone}}</span></div>
        <div class="address-b">{{confirmOrderInitData.address.province+' '+confirmOrderInitData.address.city+' '+confirmOrderInitData.address.district+' '+confirmOrderInitData.address.town+confirmOrderInitData.address.address}}</div>
      </cell>
      <cell class="no-address" v-else title="请选择收货地址" is-link link="/address"></cell>
    </group>
    <div class="order-con" v-for="(item, index) in confirmOrderInitData.list" :key="index">
      <div class="con-top">共{{item.goods.length}}件商品<span>（{{item.title}}）</span></div>
      <div class="con-mid" v-for="(subItem, i) in item.goods" :key="i">
        <div class="my-img"><img class="img" :src="subItem.pic" alt=""></div>
        <div class="con-mid-m">{{subItem.name}}</div>
        <div class="con-mid-r">
          <span class="my-color-t">￥{{subItem.member_price}}</span>
          <span class="my-color-b">x{{subItem.num}}</span>
        </div>
      </div>
      <div class="con-foot">
        <span class="con-total">商品合计</span>
        <span class="my-color-t">￥{{item.total_price || '0'}}</span>
      </div>
      <div class="con-foot">
        <span class="con-total">运费</span>
        <span class="my-color-t">￥{{confirmOrderInitData.freight}}</span>
      </div>
    </div>
    <div class="con-foot foot-money">
      <span class="con-total">账户余额</span>
      <span v-if="isCreditEnough" class="my-color-t">￥{{confirmOrderInitData.balance}}</span>
      <span v-else class="my-color-t">￥{{confirmOrderInitData.balance}}<span class="con-total">（余额不足）</span></span>
    </div>
    <div class="confirm-foot">
      <span class="pay-price">合计：￥{{confirmOrderInitData.total_price}}</span>
      <span class="pay-btn" @click="handlePayBtn">{{isCreditEnough?'去付款':'去充值'}}</span>
    </div>
    <div>
      <confirm v-model="isConfirmPay" title="确认支付" @on-cancel="isConfirmPay===false" @on-confirm="onConfirm">
        <p style="text-align:center;">本次消费将从账户余额中扣除</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import { Cell, Group, Confirm, Toast } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, namespace} from 'vuex-class';
const ConfirmOderState = namespace('confirmOrder', State);
@Component({
  components: {
    Cell,
    Group,
    Confirm,
    Toast
  }
})
export default class ConfirmOrder extends Vue {
  @ConfirmOderState confirmOrderInitData
  @ConfirmOderState isCreditEnough
  @ConfirmOderState ids
  isConfirmPay = false
  onConfirm () {
    const params = {
      'ids': this.ids,
      'address_id': this.confirmOrderInitData.address.id
    };
    this.isConfirmOrder(params).then(msg => {
      if (!msg) {
        this.$router.push({
          path: 'orderPaySuccess'
        });
      } else {
        this.isConfirmPay = false;
        this.$vux.toast.text(msg, 'middle');
      }
    }).catch(error => console.log(error));
  }
  handlePayBtn () {
    if (this.isCreditEnough) {
      this.isConfirmPay = true;
    } else {
      this.$router.push({
        path: 'recharge'
      });
    }
  }
}
</script>
<style lang="less">
  .confirm-order {
    padding-bottom: 0.15rem;
    font-size: 0.14rem;
    overflow: hidden;
    .no-address .vux-cell-primary {
      flex: initial;
      width: 100%;
    }
    .weui-cells {
      margin: 0;
    }
    .weui-cell_access .weui-cell__ft {
      width: 100%;
    }
    .address-b {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .address-name {
      font-weight: bolder;
    }
    .address-t, .address-b {
      width: 100%;
      font-size: 0.16rem;
      color: #303030;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
    }
    .weui-dialog__btn_primary {
      color: #ffffff;
      background: #B79E74;
    }
    .weui-dialog__btn_default {
      color: #ffffff;
      background: #A6A6A6;
    }
    .pay-price {
      color: #C61A2A;
    }
    .pay-btn {
      margin-right: 15px;
      height: 100%;
      background: #B79E74;
      width: 147px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .confirm-foot {
      position: fixed;
      left: 0;
      bottom: 0;
      height: 0.5rem;
      width: 100%;
      background: #ffffff;
      padding-left: 0.15rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .foot-money {
      margin-top: 0.2rem;
      height: 0.44rem;
      background: #ffffff;
    }
    .weui-cell {
      height: 1rem;
      padding: 0 0.15rem !important;
    }
    .vux-label {
      font-size: 0.16rem;
    }
    .con-total {
      font-size: 0.14rem;
      color: #A6A6A6;
    }
    .con-foot {
      height: 0.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.15rem;
    }
    .con-mid-m {
      height: 100%;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 0 0.15rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      line-height: 0.2rem;
      text-align: left;
    }
    .my-color-t {
      font-size: 0.14rem;
      color: #C61A2A;
    }
    .my-color-b {
      font-size: 10px;
      color: #A6A6A6;
    }
    .con-mid-r {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-direction: column;
    }
    .img, .my-img {
      width: 1rem;
      border: none;
      height: 100%;
    }
    .con-mid {
      height: 0.6rem;
      border-bottom: 1px solid #D9D9D9;
      padding: 0.15rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .con-top {
      height: 0.44rem;
      border-bottom: 1px solid #D9D9D9;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0.15rem;
    }
    .order-con {
      background: #ffffff;
      margin-top: 0.15rem;
    }
  }
</style>

