<template>
  <div class="confirm-order">
    <group>
      <cell title="请选择收货地址" is-link @click.native="handleSelectAddress"></cell>
    </group>
    <div class="order-con" v-for="(item, index) in orderList" :key="index">
      <div class="con-top">共{{item.list.length}}件商品<span>（{{item.title}}）</span></div>
      <div class="con-mid" v-for="(subItem, i) in item.list" :key="i">
        <div><img class="img" :src="subItem.pic" alt=""></div>
        <div class="con-mid-m">{{subItem.desc}}</div>
        <div class="con-mid-r">
          <span class="my-color-t">￥{{subItem.price}}</span>
          <span class="my-color-b">x{{subItem.num}}</span>
        </div>
      </div>
      <div class="con-foot">
        <span class="con-total">商品合计</span>
        <span class="my-color-t">￥{{item.total}}</span>
      </div>
      <div class="con-foot">
        <span class="con-total">运费</span>
        <span class="my-color-t">￥{{item.freight}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Cell, Group } from 'vux'
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  components: {
    Cell,
    Group
  }
})
export default class ConfirmOrder extends Vue {
  orderList = [
    {
      title: '京东自营',
      total: '1000.00',
      freight: '6.00',
      list: [
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'},
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'},
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'}
      ]
    },
    {
      title: '苏宁易购',
      total: '1000.00',
      freight: '6.00',
      list: [
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'}
      ]
    },
    {
      title: '淘宝商城',
      total: '1000.00',
      freight: '6.00',
      list: [
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'},
          {pic: '/static/img/card1.dd4d063.png', desc: '科海客户回馈卡(黑金) 适用于科海商城 官方卡 100元面值卡', price: '100.00', num: '2'}
      ]
    }
  ]
  handleSelectAddress () {
    console.log('sdf')
  }
}
</script>
<style lang="less">
  .confirm-order {
    font-size: 0.14rem;
    overflow: hidden;
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
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 0 0.15rem;
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
    .img {
      width: 1rem;
      border: none;
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

