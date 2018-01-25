<template>
    <div class="order-index">
        <tab class="tab" ref="topBar" bar-active-color="#B79E74">
            <tab-item :selected="true" @on-item-click="orderStatus=0">全部</tab-item>
            <tab-item @on-item-click="orderStatus=1">待发货</tab-item>
            <tab-item @on-item-click="orderStatus=2">待支付</tab-item>
            <tab-item @on-item-click="orderStatus=3">已发货</tab-item>
        </tab>
        <group v-for="(order,index) of orders" :key="order.order_sn" :style="{paddingTop:index===0&&'44px'}" @click.native="$router.push(`/order/detail/${order.order_sn}`)">
            <cell>
                <p slot="title" class="text">订单编号：{{order.order_sn}}</p>
                <p class="text brown">{{order.order_status}}</p>
            </cell>
            <div v-for="(goods,index) of order.goods_list" :key="index">
                <item v-for="(item,index) of goods.list" :key="index" :item="item" v-if="index<2"></item>
                <item v-for="(item,index) of goods.list" :key="index" :item="item" v-if="index>=2" v-show="order.show"></item>
                <p class="text gray center" @click.stop="toggleShow(order)">查看全部{{goods.list.length}}件商品</p>
                <cell>
                    <p slot="title" class="text">共{{goods.list.length}}件商品&nbsp;&nbsp;&nbsp;<span class="text gray">({{goods.targer_name}})</span></p>
                    <p class="text bold">合计：{{totalCount(goods)}}</p>
                </cell>
            </div>
        </group>
    </div>
</template>
<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Tab, TabItem, Cell, Group } from 'vux';
import Item from './item';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { page } from '../../mixin/page';
const OrderAction = namespace('order', Action);
const OrderMutation = namespace('order', Mutation);
const OrderState = namespace('order', State);
@Component({
  mixins: [page],
  components: { Tab, TabItem, Cell, Group, Item }
})
export default class Order extends Vue {
  orderStatus = 0;
  @OrderState orders;
  @OrderMutation setOrders;
  @OrderAction getOrders;
  @Watch('orderStatus')
  onStatusChange (newValue, oldValue) {
    if (newValue !== oldValue) {
      this.setOrders({ orders: [], page: 1 });
      this.getOrders({ orderStatus: this.orderStatus }).then(msg => {
        msg && this.$vux.toast.text(msg);
        this.orders.map(order => {
          !order.show && this.$set(order, 'show', false);
        });
      });
    }
  }
  get totalCount () {
    return goods =>
      goods.list.reduce((sum, item) => sum + Number(item.price), 0);
  }

  filter (type) {
    this.orderStatus = type;
  }
  toggleShow (order) {
    order.show = !order.show;
  }
  activated () {
    this.getOrders({ orderStatus: this.orderStatus }).then(msg => {
      msg && this.$vux.toast.text(msg);
    });
  }
}
</script>
<style lang="less">
.order-index {
  .weui-cell {
    padding: 0 0.15rem !important;
  }
  .vux-flexbox-item {
    margin: 0 !important;
  }
  .text {
    height: 0.44rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .vux-flexbox {
    border-top: 1px solid #D9D9D9;
  }
  .weui-cell:before {
    left: 0 !important;
  }
  .tab {
    top: 46px;
    position: fixed;
    width: 100%;
    z-index: 99;
  }
  .center {
    justify-content: center !important;
  }
}
</style>
