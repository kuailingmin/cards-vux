<template>
    <div class="cart">
        <div class="cart-top">
            <span>共{{initData.num||0}}件</span>
            <span class="cart-edit" @click="handleCartEdit(isEdit)" :style="{'color':setColor}">{{isEdit?'编辑':'完成'}}</span>
        </div>
        <div class="cart-con" v-for="(item, index) in initData.list" :key="index">
            <div class="con-top">
                <icon :type="item.is_selected===1?'success':'circle'" :style="{'color':setColor}" @click.native="handleSelectList(item)">{{item.title}}</icon><span class="my-num">（{{item.num}}）</span>
            </div>
            <div class="con-mid" v-for="(subItem, i) in item.goods" :key="i">
                <icon :type="subItem.is_selected===1?'success':'circle'" :style="{'color':setColor}" @click.native="handleSelect(subItem)">{{item.title}}</icon>
                <span @click="$router.push('/detail/'+ subItem.shop_id )" class="my-img"><img class="img" :src="subItem.pic" alt=""></span>
                <div class="con-r">
                    <div class="con-mid-t">{{subItem.name}}</div>
                    <div class="con-mid-b">
                        <span class="bottom-l">￥{{subItem.member_price}}</span>
                        <div class="add-or-reduce" v-show="isEdit">
                            <span class="reduce" @click="handleChange(-1, subItem)">－</span>
                            <span class="num-value"><input onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" type="text" :value="subItem.num>0?subItem.num:'1'" @blur="handleInputChange($event.target.value, subItem.shop_id)"></span>
                            <span class="add" @click="handleChange(1, subItem)">＋</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-foot">
            <icon :type="initData.is_all_selected===1?'success':'circle'" :style="{'color':setColor}" @click.native="handleSelectAll">全选</icon>
            <span>合计：<span class="bottom-l">￥{{initData.goods_total_price}}</span></span>
            <span v-if="isShowPayBtn" class="settlement" @click="$router.push('/recharge')" :style="{'background-color':setColor}">去充值</span>
            <span v-else class="settlement" @click="handleClick(!isEdit)" :style="{'background-color':setColor}">{{isEdit?'结算':'删除'}}</span>
        </div>
    </div>
</template>
<script>
import { CheckIcon, Toast, Icon } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, namespace} from 'vuex-class';
const CartState = namespace('cart', State);
const CartAction = namespace('cart', Action);
const ConfirmOderState = namespace('confirmOrder', State);
const ConfirmOderAction = namespace('confirmOrder', Action);
@Component({
  components: {
    CheckIcon,
    Toast,
    Icon
  }
})
export default class Cart extends Vue {
    @CartAction init
    @CartAction addReduce
    @CartAction isSelected
    @CartAction deleteList
    @CartState initData
    @ConfirmOderAction confirmOrderInit
    @ConfirmOderAction isConfirmOrder
    @ConfirmOderState confirmOrderInitData
    isEdit = true
    isShowPayBtn = false
    setColor = localStorage.getItem('setColor')
    handleInputChange (num, id) {
      const params = {
        'shop_id': id,
        'num': num
      };
      this.addReduce(params).then(msg => {
        if (!msg) {
          this.init();
        } else {
          this.$vux.toast.text(msg, 'middle');
        }
      }).catch(error => console.log(error));
    }
    handleSelectAll () {
      let ids = [];
      let isSelect = 0;
      if (this.initData.is_all_selected === 1) {
        isSelect = 0;
        this.initData.is_all_selected = 0;
        this.initData.list.forEach(item => {
          item.is_selected = 0;
          item.goods.forEach(subItem => {
            subItem.is_selected = 0;
            ids.push(subItem.id);
          });
        });
      } else {
        isSelect = 1;
        this.initData.is_all_selected = 1;
        this.initData.list.forEach(item => {
          item.is_selected = 1;
          item.goods.forEach(subItem => {
            subItem.is_selected = 1;
            ids.push(subItem.id);
          });
        });
      }
      this.getIsSelected(ids, isSelect);
    }
    handleSelect (item) {
      let ids = [];
      let isSelect = 0;
      if (item.is_selected === 1) {
        isSelect = 0;
        ids.push(item.id);
        item.is_selected = 0;
        this.initData.is_all_selected = 0;
      } else {
        ids.push(item.id);
        isSelect = 1;
        item.is_selected = 1;
      }
      this.getIsSelected(ids, isSelect);
      let arr = this.initData.list;
      let len = this.initData.list.length;
      for (let i = 0; i < len; i++) {
        let flag = true;
        let arr2 = arr[i].goods;
        let len2 = arr[i].goods.length;
        for (let j = 0; j < len2; j++) {
          if (arr2[j].is_selected === 0) {
            flag = false;
            break;
          }
        }
        flag ? arr[i].is_selected = 1 : arr[i].is_selected = 0;
      }
      this.getFlag();
    }
    getFlag () {
      let flag = true;
      let arr = this.initData.list;
      let len = this.initData.list.length;
      for (let i = 0; i < len; i++) {
        if (arr[i].is_selected === 0) {
          flag = false;
          break;
        }
      }
      flag ? this.initData.is_all_selected = 1 : this.initData.is_all_selected = 0;
    }
    getIsSelected (a, b) {
      const params = {
        'ids': a.join(','),
        'is_selected': b
      };
      this.isSelected(params).then(msg => {
        if (!msg) {
          let totalPrice = 0;
          this.initData.list.forEach(item => {
            item.goods.forEach(subItem => {
              if (subItem.is_selected === 1) {
                totalPrice = totalPrice + subItem.member_price * subItem.num;
              }
            });
          });
          this.initData.goods_total_price = totalPrice.toFixed(2);
        } else {
          this.$vux.toast.text(msg, 'middle');
        }
      }).catch(error => console.log(error));
    }
    handleSelectList (item) {
      let ids = [];
      let isSelect = 0;
      if (item.is_selected === 1) {
        isSelect = 0;
        item.is_selected = 0;
        this.initData.is_all_selected = 0;
        item.goods.forEach(subItem => {
          subItem.is_selected = 0;
          ids.push(subItem.id);
        });
      } else {
        isSelect = 1;
        item.is_selected = 1;
        item.goods.forEach(subItem => {
          subItem.is_selected = 1;
          ids.push(subItem.id);
        });
      }
      this.getFlag();
      this.getIsSelected(ids, isSelect);
    }
    handleCartEdit (isEdit) {
      if (isEdit) {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    }
    handleChange (n, item) {
      var l = 0;
      var id = parseInt(item.num);
      if (n === -1) {
        if (id > 1) {
          id--;
          l = 1;
        } else if (id === 1) {
          l = 0;
        } else {
          l = 1;
        }
      } else {
        id++;
        l = 1;
      }
      if (l === 1) {
        const params = {
          'shop_id': item.shop_id,
          'num': id
        };
        this.addReduce(params).then(msg => {
          if (!msg) {
            this.init();
          } else {
            this.$vux.toast.text(msg, 'middle');
          }
        }).catch(error => console.log(error));
      }
    }
    handleClick (isEdit) {
      let ids = [];
      this.initData.list.forEach(item => {
        item.goods.forEach(subItem => {
          if (subItem.is_selected === 1) {
            ids.push(subItem.id);
          }
        });
      });
      if (isEdit) {
        if (ids.length > 0) {
          const params = {
            'ids': ids.join(',')
          };
          this.deleteList(params).then(msg => {
            if (!msg) {
              this.init();
              this.$bus.emit('addToCart', 'ok');
            } else {
              this.$vux.toast.text(msg, 'middle');
            }
          }).catch(error => console.log(error));
        } else {
          this.$vux.toast.text('您还没有勾选宝贝哦~', 'middle');
        }
      } else {
        if (ids.length > 0) {
          localStorage.setItem('ids', ids.join(','));
          const params = {
            'ids': ids.join(',')
          };
          this.confirmOrderInit(params).then(msg => {
            if (!msg) {
              if (parseFloat(this.confirmOrderInitData.balance) >= parseFloat(this.confirmOrderInitData.total_price)) {
                localStorage.setItem('isCreditEnough', '1');
                this.$router.push({
                  path: '/confirmOrder'
                });
              } else {
                localStorage.setItem('isCreditEnough', '0');
                this.$vux.toast.text('账户余额不足,请充值', 'middle');
                this.isShowPayBtn = true;
              }
            } else {
              this.$vux.toast.text(msg, 'middle');
            }
          }).catch(error => console.log(error));
        } else {
          this.$vux.toast.text('您还没有勾选宝贝哦~', 'middle');
        }
      }
    }
    created () {
      const params = {};
      this.init(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          let cartNum = 0;
          this.initData.list.forEach(item => {
            cartNum += item.goods.length;
          });
          this.$store.commit('cart/getCartNum', cartNum.toString());
        }
      }).catch(error => console.log(error));
    }
}
</script>
<style lang="less" scoped>
    .cart {
        min-height: 5rem;
        padding: 0.6rem 0;
        overflow: hidden;
        font-size: 0.14rem;
        position: relative;
        .con-mid-t {
          line-height: 0.24rem;
          height: 0.75rem;
          width: 100%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
        .reduce, .add {
            width: 0.23rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .reduce {
          border-right: 1px solid #a6a6a6;
        }
        .add {
          border-left: 1px solid #a6a6a6;
        }
        .num-value {
            overflow: hidden;
            width: 0.57rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .num-value input {
            text-align: center;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
        }
        .add-or-reduce {
            border: 1px solid #a6a6a6;
            border-radius: 0.03rem;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
        .my-num {
            color: #a6a6a6;
        }
        .cart-foot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 0.14rem;
            height: 0.44rem;
            width: 100%;
            background: #ffffff;
            position: absolute;
            left: 0;
            bottom: 0;
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
        .bottom-l {
            color: #C61A2A;
            font-weight: bold;
        }
        .con-mid-b {
            width: 100%;
            height: 0.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-top {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 0.44rem;
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.14rem;
            font-size: 0.14rem;
            z-index: 999;
        }
        .cart-edit {
            color: #B79E74;
            margin-right: 0.3rem;
        }
        .cart-con {
            background: #ffffff;
        }
        .con-top {
          position: relative;
          height: 0.44rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0 0.14rem;
        }
        .con-top:before {
          content: ' ';
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #D9D9D9;
          color: #D9D9D9;
          transform-origin: 0 100%;
          transform: scaleY(0.5);
        }
        .con-mid:before {
          content: ' ';
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #D9D9D9;
          color: #D9D9D9;
          transform-origin: 0 100%;
          transform: scaleY(0.5);
        }
        .con-mid {
          position: relative;
          height: 1rem;
          padding: 0.15rem 0.14rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .img, .my-img {
            width: 1rem;
            border: none;
            height: 0.66rem;
        }
        .my-img {
          margin-left: 0.08rem;
        }
        .con-r {
            width: 100%;
            padding: 0 0.1rem;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>
