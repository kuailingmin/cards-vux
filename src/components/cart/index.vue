<template>
    <div class="cart">
        <div class="cart-top">
            <span>共{{4}}件</span>
            <span class="cart-edit" @click="handleCartEdit(isEdit)">{{isEdit?'完成':'编辑'}}</span>
        </div>
        <div class="cart-con" v-for="(item, index) in orderList" :key="index">
            <div class="con-top">
                <check-icon :value.sync="item.checked">{{item.title}}</check-icon>
            </div>
            <div class="con-mid" v-for="(subItem, i) in item.list" :key="i">
                <check-icon :value.sync="subItem.checked"></check-icon>
                <span><img class="img" :src="subItem.pic" alt=""></span>
                <div class="con-r">
                    <div class="con-mid-t">{{subItem.desc}}</div>
                    <div class="con-mid-b">
                        <span class="bottom-l">￥{{subItem.price}}</span>
                        <inline-x-number :min="0" @on-change="handleChange"></inline-x-number>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-foot">
            <check-icon value.sync="false">全选</check-icon>
            <span>合计：<span class="bottom-l">￥{{49000.00}}</span></span>
            <span class="settlement" @click="handleClick(isEdit)">{{isEdit?'删除':'结算'}}</span>
        </div>
    </div>
</template>
<script>
import { CheckIcon, InlineXNumber } from 'vux'
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  components: {
    CheckIcon,
    InlineXNumber
  }
})
export default class Cart extends Vue {
  isEdit = false
  orderList = [
    {
      title: '京东自营',
      checked: false,
      list: [
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: true},
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: false},
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: true}
      ]
    },
    {
      title: '京东自营',
      checked: true,
      list: [
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: false},
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: true}
      ]
    },
    {
      title: '京东自营',
      checked: false,
      list: [
            {desc: '飞象X苏宁联名圣诞卡 面值500元', pic: '/static/img/card1.dd4d063.png', price: '49000.00', checked: true}
      ]
    }
  ]
  handleCartEdit (isEdit) {
    if (isEdit) {
      this.isEdit = false
    } else {
      this.isEdit = true
    }
  }
  handleChange (val) {
    console.log('sss', val)
  }
  handleClick (isEdit) {
    if (!isEdit) {
      this.$router.push({
        path: 'confirmOrder'
      })
    }
  }
}
</script>
<style lang="less">
    .cart {
        .vux-number-selector-sub, .vux-number-selector-plus {
            padding: 3px !important;
            margin-right: 0 !important;
        }
        .vux-number-input {
            font-size: 14px;
            width: 30px !important;
        }
    }
</style>

<style lang="less" scoped>
    .cart {
        padding-top: 0.44rem;
        padding-bottom: 1rem;
        overflow: hidden;
        font-size: 0.14rem;
        .cart-foot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 0.14rem;
        }
        .settlement {
            height: 100%;
            width: 1rem;
            color: #ffffff;
            background: #B79E74;
            line-height: 0.44rem;
            text-align: center;
            margin-right: 0.14rem;
        }
        .cart-foot {
            height: 0.44rem;
            width: 100%;
            background: #ffffff;
            position: fixed;
            left: 0;
            bottom: 53px;
        }
        .bottom-l {
            color: #C61A2A;
        }
        .con-mid-b {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-top {
            position: fixed;
            left: 0;
            top: 46px;
            width: 100%;
            height: 0.44rem;
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.14rem;
            font-size: 0.14rem;
        }
        .cart-edit {
            color: #B79E74;
            margin-right: 0.3rem;
        }
        .cart-con {
            background: #ffffff;
            margin-top: 0.15rem;
        }
        .con-top {
            height: 0.44rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 0.14rem;
            border-bottom: 1px solid #D9D9D9;
        }
        .con-mid {
            border-bottom: 1px solid #D9D9D9;
            height: 1rem;
            padding: 0.15rem 0.14rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .img {
            width: 1rem;
            border: none;
        }
        .con-r {
            padding: 0 0.1rem;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
        }
    }
</style>
