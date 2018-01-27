<template>
  <div class="detail-index">
    <div class="image">
      <span class="left" @click="$router.go(-1)"><img src="../../assets/back.png" alt=""></span>
      <span class="right" @click="showEdit?$router.push('/mine/intentionList'):$router.push('/main/cart')"><img src="../../assets/cart.png" alt=""></span>
      <img class="my-img" :src="shopDetails.pic_url" alt="">
    </div>
    <div class="shop-title">{{shopDetails.name}}</div>
    <div class="shop-price"><span class="market-price">￥{{shopDetails.price}}</span><span><del class="original-price"> ￥{{'1000'}}</del></span></div>
    <group>
      <cell><span>库存</span><span>{{shopDetails.stock}}</span></cell>
      <cell is-link :link="shopDetails.mall_url"><span>{{shopDetails.mall_title}}</span></cell>
    </group>
    <div class="card">
      <div class="card-title">购卡须知</div>
      <div class="card-con">{{shopDetails.use_service}}</div>
    </div>
    <div class="card">
      <div class="card-title">使用规则</div>
      <div class="card-con">{{shopDetails.use_service}}</div>
    </div>
    <div class="detail-foot">
      <div class="detail-foot-left">
        <span class="cart-num">数量</span>
        <inline-x-number class="add-reduce-num" width="0.4rem" :min="1" :max="Number(shopDetails.stock)" v-model="count" :fillable="true"></inline-x-number>
      </div>
      <x-button class="add-cart" @click.native="addCart">加入购物车</x-button>
    </div>
  </div>
</template>
<script>
import { Group, InlineXNumber, XButton, Cell } from 'vux';
import { State, Action, namespace } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
const ProductsState = namespace('products', State);
const ProductsAction = namespace('products', Action);
const CartAction = namespace('cart', Action);
const GlobalState = namespace('global', State);
@Component({
  components: { Group, InlineXNumber, XButton, Cell }
})
export default class Detail extends Vue {
  @CartAction addReduce
  @ProductsState shopDetails
  @ProductsAction initGetShopDetails
  @GlobalState storeId
  imgWidth = parseInt(screen.width)
  count = 1
  showEdit = false
  tempData = []
  created () {
    this.showEdit = JSON.parse(localStorage.getItem('showEdit') || 'false');
    this.tempData = JSON.parse(localStorage.getItem('tempData') || '[]');
    const params = {
      'store_id': this.storeId,
      'id': this.$route.params.id
    };
    this.initGetShopDetails(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
  }
  addCart () {
    if (this.showEdit) {
      let flag = true;
      this.tempData.forEach(item => {
        if (item.id === this.shopDetails.id) {
          item.num = this.count;
          flag = false;
        }
      });
      if (flag) {
        this.tempData.push({
          'id': this.shopDetails.id,
          'num': this.count,
          'is_selected': 1
        });
      }
      localStorage.setItem('tempData', JSON.stringify(this.tempData));
      this.$vux.toast.text('加入购物车成功', 'middle');
    } else {
      const params = {
        'num': this.count,
        'shop_id': this.shopDetails.id
      };
      this.addReduce(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          this.$vux.toast.text('加入购物车成功', 'middle');
        }
      });
    }
  }
}
</script>
<style lang="less">
.detail-index {
  overflow: hidden;
  padding-top: 0.15rem;
  padding-bottom: 0.44rem;
  .cart-num {
    font-size: 0.14rem;
    color: #A6A6A6;
    padding: 0 0.15rem;
  }
  .detail-foot-left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .weui-btn {
    margin: 0 !important;
  }
  .add-cart {
    width: 1.5rem;
    height: 100%;
    padding: 0 !important;
  }
  .detail-foot {
    background: #ffffff;
    width: 100%;
    height: 0.5rem;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-title {
    height: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.14rem;
    color: #3C3C3C;
  }
  .card-con {
    min-height: 0.6rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.15rem 0.15rem 0.15rem;
    font-size: 0.12rem;
    color: #3C3C3C;
    line-height: 0.16rem;
  }
  .card {
    margin: 0.15rem auto;
    width: 90%;
    background: #F0F0F0;
  }
  .weui-cell:before {
    left: 0 !important;
  }
  .weui-cell__ft {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .market-price {
    font-size: 0.2rem;
    color: #C61A2A;
    padding-right: 0.05rem;
  }
  .original-price {
    font-size: 0.14rem;
    color: #A6A6A6;
  }
  .shop-price {
    height: 0.44rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.15rem;
  }
  .shop-title {
    margin-top: 0.1rem;
    height: 0.44rem;
    font-size: 0.16rem;
    color: #3C3C3C;
    padding: 0 0.15rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 0.22rem;
    font-weight: bold;
  }
  .my-img {
    border: none;
    width: 73%;
  }
  .image {
    position: relative;
    margin: 0 auto;
    width: 90%;
    height: 3.45rem;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left img {
    width: 100%;
    height: 100%;
    border: none;
  }
  .right img {
    width: 100%;
    height: 100%;
    border: none;
  }
  .left {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    width: 0.35rem;
    height: 0.35rem;
    overflow: hidden;
  }
  .right {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 50%;
    width: 0.35rem;
    height: 0.35rem;
    overflow: hidden;
  }
}
</style>
