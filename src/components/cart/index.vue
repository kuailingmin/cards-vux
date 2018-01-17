<template>
    <div class="cart">
        <div class="cart-top">
            <span>共{{initData.num}}件</span>
            <span class="cart-edit" @click="handleCartEdit(isEdit)">{{isEdit?'完成':'编辑'}}</span>
        </div>
        <div class="cart-con" v-for="(item, index) in initData.list" :key="index">
            <div class="con-top">
                <check-icon :value.sync="item.is_selected===1?true:false" @click.native="handleSelectList(item)">{{item.title}}</check-icon><span class="my-num">（{{item.num}}）</span>
            </div>
            <div class="con-mid" v-for="(subItem, i) in item.goods" :key="i">
                <check-icon :value.sync="subItem.is_selected===1?true:false" @click.native="handleSelect(subItem)"></check-icon>
                <span class="my-img"><img class="img" :src="subItem.pic" alt=""></span>
                <div class="con-r">
                    <div class="con-mid-t">{{subItem.name}}</div>
                    <div class="con-mid-b">
                        <span class="bottom-l">￥{{subItem.member_price}}</span>
                        <div class="add-or-reduce" v-show="isEdit">
                            <span class="reduce" @click="handleChange(-1, subItem)">－</span>
                            <span class="num-value"><input onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" type="text" :value="subItem.num>0?subItem.num:'0'" @blur="handleInputChange($event.target.value, subItem.shop_id)"></span>
                            <span class="add" @click="handleChange(1, subItem)">＋</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-foot">
            <check-icon :value.sync="initData.is_all_selected===1?true:false" @click.native="handleSelectAll">全选</check-icon>
            <span>合计：<span class="bottom-l">￥{{initData.goods_total_price}}</span></span>
            <span class="settlement" @click="handleClick(isEdit)">{{isEdit?'删除':'结算'}}</span>
        </div>
    </div>
</template>
<script>
import { CheckIcon, Toast } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, Mutation, namespace} from 'vuex-class';
const CartState = namespace('cart', State);
const CartAction = namespace('cart', Action);
const CartMutation = namespace('cart', Mutation);
const ConfirmOderState = namespace('confirmOrder', State);
const ConfirmOderAction = namespace('confirmOrder', Action);
const ConfirmOderMutation = namespace('confirmOrder', Mutation);
@Component({
  components: {
    CheckIcon,
    Toast
  }
})
export default class Cart extends Vue {
    @CartAction init
    @CartAction addReduce
    @CartAction isSelected
    @CartAction deleteList
    @CartMutation getInitData
    @CartState initData
    @ConfirmOderAction confirmOrderInit
    @ConfirmOderAction isConfirmOrder
    @ConfirmOderMutation confirmOrderGetInitData
    @ConfirmOderState confirmOrderInitData
    isEdit = false
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
      this.initData.list.forEach(item => {
        if (item.is_selected === 1) {
          item.goods.forEach(subItem => {
            if (subItem.is_selected === 0) {
              item.is_selected = 0;
            }
          });
        } else {
          item.goods.forEach(subItem => {
            if (subItem.is_selected === 0) {
              item.is_selected = 0;
            } else {
              item.is_selected = 1;
            }
          });
        }
      });
      this.initData.list.forEach(item => {
        if (item.is_selected === 0) {
          this.initData.is_all_selected = 0;
        } else {
          this.initData.is_all_selected = 1;
        }
      });
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
      this.initData.list.forEach(item => {
        if (item.is_selected === 0) {
          this.initData.is_all_selected = 0;
        } else {
          this.initData.is_all_selected = 1;
        }
      });
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
      if (n === -1) {
        item.num--;
      } else {
        item.num++;
      }
      const params = {
        'shop_id': item.shop_id,
        'num': item.num
      };
      this.addReduce(params).then(msg => {
        if (!msg) {
          this.init();
        } else {
          this.$vux.toast.text(msg, 'middle');
        }
      }).catch(error => console.log(error));
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
            } else {
              this.$vux.toast.text(msg, 'middle');
            }
          }).catch(error => console.log(error));
        } else {
          this.$vux.toast.text('您还没有勾选宝贝哦~', 'middle');
        }
      } else {
        if (ids.length > 0) {
          this.$store.commit('confirmOrder/getIds', ids.join(','));
          const params = {
            'ids': ids.join(',')
          };
          this.confirmOrderInit(params).then(msg => {
            if (!msg) {
              if (parseFloat(this.confirmOrderInitData.balance) >= parseFloat(this.confirmOrderInitData.total_price)) {
                this.$store.commit('confirmOrder/getIsCreditEnough', true);
              } else {
                this.$store.commit('confirmOrder/getIsCreditEnough', false);
              }
              this.$router.push({
                path: '/confirmOrder'
              });
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
      this.init().then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        }
      }).catch(error => console.log(error));
    }
}
</script>
<style lang="less" scoped>
    .cart {
        padding-top: 0.44rem;
        padding-bottom: 1rem;
        overflow: hidden;
        font-size: 0.14rem;
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
            border-radius: 3px;
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
            height: 0.25rem;
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
        .img, .my-img {
            width: 1rem;
            border: none;
            height: 100%;
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
