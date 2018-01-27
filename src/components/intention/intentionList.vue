<template>
    <div class="cart">
        <div class="cart-top">
            <span>共{{intentionList.num}}件</span>
            <span class="cart-edit" @click="handleCartEdit(isEdit)">{{isEdit?'完成':'编辑'}}</span>
        </div>
        <div class="cart-con" v-for="(item, index) in intentionList.list" :key="index">
            <div class="con-top">
                <check-icon :value.sync="item.is_selected===1?true:false" @click.native="handleSelectList(item)">{{item.title}}</check-icon><span class="my-num">（{{item.goods.length}}）</span>
            </div>
            <div class="con-mid" v-for="(subItem, i) in item.goods" :key="i">
                <check-icon :value.sync="subItem.is_selected===1?true:false" @click.native="handleSelect(subItem)"></check-icon>
                <span @click="handleClickToDetail(subItem.id)" class="my-img"><img class="img" :src="subItem.pic" alt=""></span>
                <div class="con-r">
                    <div class="con-mid-t">{{subItem.name}}</div>
                    <div class="con-mid-b">
                        <span class="bottom-l">￥{{subItem.member_price}}</span>
                        <div class="add-or-reduce" v-show="isEdit">
                            <span class="reduce" @click="handleChange(-1, subItem)">－</span>
                            <span class="num-value"><input onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" type="text" :value="parseFloat(subItem.num)>0?subItem.num:0" @blur="handleInputChange($event.target.value, subItem)"></span>
                            <span class="add" @click="handleChange(1, subItem)">＋</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-foot">
            <check-icon :value.sync="intentionList.is_all_selected===1?true:false" @click.native="handleSelectAll">全选</check-icon>
            <span>合计：<span class="bottom-l">￥{{intentionList.goods_total_price}}</span></span>
            <span class="settlement" @click="handleClick">{{isEdit?'删除':'提交意向单'}}</span>
        </div>
    </div>
</template>
<script>
import { CheckIcon, Toast } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace, Action } from 'vuex-class';
const ProductsState = namespace('products', State);
const ProductsAction = namespace('products', Action);
const GlobalState = namespace('global', State);
@Component({
  components: {
    CheckIcon,
    Toast
  }
})
export default class Cart extends Vue {
  @ProductsState intentionList;
  @GlobalState storeId;
  @ProductsAction initGetIntentionList;
  isEdit = false;
  myTempData = []
  computedPrice () {
    let totalPrice = 0;
    this.intentionList.list.forEach(item => {
      item.goods.forEach(subItem => {
        if (subItem.is_selected === 1) {
          totalPrice +=
            parseFloat(subItem.num) * parseFloat(subItem.member_price);
        }
      });
    });
    this.intentionList.goods_total_price = totalPrice.toFixed(2);
  }
  handleClickToDetail (id) {
    this.$router.push(`/detail/${id}`);
  }
  handleInputChange (a, item) {
    item.num = a;
    this.computedPrice();
  }
  handleSelectAll () {
    if (this.intentionList.list) {
      if (this.intentionList.is_all_selected === 1) {
        this.intentionList.is_all_selected = 0;
        this.intentionList.list.forEach(item => {
          item.is_selected = 0;
          item.goods.forEach(subItem => {
            subItem.is_selected = 0;
          });
        });
      } else {
        this.intentionList.is_all_selected = 1;
        this.intentionList.list.forEach(item => {
          item.is_selected = 1;
          item.goods.forEach(subItem => {
            subItem.is_selected = 1;
          });
        });
      }
      this.computedPrice();
    }
  }
  handleSelect (item) {
    if (item.is_selected === 1) {
      item.is_selected = 0;
      this.intentionList.is_all_selected = 0;
    } else {
      item.is_selected = 1;
    }
    let arr = this.intentionList.list;
    let len = this.intentionList.list.length;
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
      flag ? (arr[i].is_selected = 1) : (arr[i].is_selected = 0);
    }
    this.getFlag();
    this.computedPrice();
  }
  getFlag () {
    let flag = true;
    let arr = this.intentionList.list;
    let len = this.intentionList.list.length;
    for (let i = 0; i < len; i++) {
      if (arr[i].is_selected === 0) {
        flag = false;
        break;
      }
    }
    flag
      ? (this.intentionList.is_all_selected = 1)
      : (this.intentionList.is_all_selected = 0);
  }
  handleSelectList (item) {
    if (item.is_selected === 1) {
      item.is_selected = 0;
      this.intentionList.is_all_selected = 0;
      item.goods.forEach(subItem => {
        subItem.is_selected = 0;
      });
    } else {
      item.is_selected = 1;
      item.goods.forEach(subItem => {
        subItem.is_selected = 1;
      });
    }
    this.getFlag();
    this.computedPrice();
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
      if (item.num > 0) {
        item.num--;
      }
    } else {
      item.num++;
    }
    this.computedPrice();
  }
  handleClick () {
    if (this.isEdit) {
      let arr = this.intentionList.list;
      let len = this.intentionList.list.length;
      for (let i = 0; i < len; i++) {
        let arr2 = arr[i].goods;
        let len2 = arr[i].goods.length - 1;
        for (let j = len2; j >= 0; j--) {
          if (arr2[j].is_selected === 1) {
            arr2.splice(j, 1);
          }
        }
      }
      let tempData = [];
      this.intentionList.list.forEach(item => {
        item.goods.forEach(subItem => {
          tempData.push({
            'id': subItem.id,
            'num': subItem.num,
            'is_selected': subItem.is_selected
          });
        });
      });
      localStorage.setItem('tempData', JSON.stringify(tempData));
      this.computedPrice();
    } else {
      if (this.intentionList.list) {
        let flag = false;
        this.intentionList.list.forEach(item => {
          item.goods.forEach(subItem => {
            if (subItem.is_selected === 1) {
              this.myTempData.push({
                'id': subItem.id,
                'num': subItem.num,
                'is_selected': subItem.is_selected
              });
              flag = true;
            }
          });
        });
        if (flag) {
          localStorage.setItem('myTempData', JSON.stringify(this.myTempData));
          this.$router.push('/intention/submit');
        } else {
          this.$vux.toast.text('您还没有勾选宝贝哦~', 'middle');
        }
      }
    }
  }
  created () {
    let tempData = localStorage.getItem('tempData') || '[]';
    const params = {
      'store_id': this.storeId,
      'shop_ids': tempData
    };
    this.initGetIntentionList(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
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
  .reduce,
  .add {
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
    background: #b79e74;
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
    color: #c61a2a;
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
    z-index: 999;
  }
  .cart-edit {
    color: #b79e74;
    margin-right: 0.3rem;
  }
  .cart-con {
    background: #ffffff;
    margin-top: 0.15rem;
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
    content: " ";
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
  .con-mid:before {
    content: " ";
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
  .img,
  .my-img {
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
