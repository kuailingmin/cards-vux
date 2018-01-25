<template>
    <div class="order-detail">
        <group>
            <cell>
                <flexbox slot="title" class="text lg">
                    <span class="bold">{{name}}</span>
                    <span>&nbsp;{{phone}}</span>
                </flexbox>
                <span slot="inline-desc" class="text">{{address}}</span>
            </cell>
        </group>
        <group>
            <flexbox><span class="text label">订单状态</span><span class="text brown">{{type}}</span></flexbox>
            <flexbox><span class="text label">订单号</span><span class="text">{{orderSn}}</span></flexbox>
            <flexbox><span class="text label" v-if="orderStatus!==1">快递单号</span><span class="text">{{expressNo}}&nbsp;&nbsp;&nbsp;({{expressName}})</span></flexbox>
            <cell is-link class="link" :link="`/order/delivery/${orderSn}`" v-if="orderStatus!==1">
                <p slot="inline-desc" class="text gray">{{time}}</p>
                <p slot="inline-desc" class="text gray">{{context}}</p>
            </cell>
        </group>
        <group>
            <cell><p slot="title" class="text">共{{list.length}}件商品</p></cell>
            <item v-for="item of list" :key="item.id" :item="item"></item>
        </group>
        <group>
            <cell-form-preview :list="preview"></cell-form-preview>
            <cell>
                <span slot="title" class="text gray">实际付款</span>
                <span class="text red">￥{{totalPrice}}</span>
            </cell>
        </group>
    </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Cell, Group, CellFormPreview, Flexbox, FlexboxItem } from 'vux';
import { axios } from '../../js';
import Item from './item';
import qs from 'qs';

@Component({
  components: {
    Cell,
    Group,
    CellFormPreview,
    Item,
    Flexbox,
    FlexboxItem
  }
})
export default class OrderDetail extends Vue {
  name = '';
  phone = '';
  address = '';
  list = [];
  count = 0;
  orderStatus = 0;
  orderSn = '';
  expressNo = '';
  expressName = '';
  time = '';
  context = '';
  totalPrice = 0;
  preview = [
    {
      label: '下单时间',
      value: ''
    },
    {
      label: '运费',
      value: ''
    },
    {
      label: '合计',
      value: ''
    }
  ];

  get type () {
    switch (this.orderStatus) {
      case '1':
        return '待发货';
      case '2':
        return '待收货';
      case '3':
        return '已完成';
    }
  }

  async getInfo () {
    const { result, status: { code, msg } } = await axios.post(
      '/order/details',
      qs.stringify({ order_sn: this.$route.params.id })
    );
    if (code === '00000') {
      this.name = result.address_info.name;
      this.phone = result.address_info.phone;
      this.address = result.address_info.address;
      this.list = result.goods_list[0].list;
      this.orderStatus = result.order_status;
      this.orderSn = result.order_sn;
      this.expressNo = result.express.express_no;
      this.expressName = result.express.express_name;
      this.time = result.express.data[0].time;
      this.context = result.express.data[0].context;
      this.totalPrice = result.total_price;
      this.preview[0].value = result.create_time;
      this.preview[1].value = result.freight;
      this.preview[2].value = result.price;
    } else {
      this.$vux.toast.text(msg);
    }
  }
  activated () {
    this.getInfo();
  }
}
</script>
<style lang="less" scoped>
.order-detail {
  .link {
    width: calc(~"70% - 0.32rem");
    float: right;
  }
  .label {
    width: 30%;
    padding-left: 0.16rem;
  }
}
</style>
<style lang="less">
.order-detail {
  .weui-form-preview__label {
    font-size: 0.14rem;
    color: #a6a6a6;
    letter-spacing: -0.0034rem;
  }
  .weui-form-preview__value {
    font-size: 0.14rem;
    color: #3c3c3c;
    letter-spacing: -0.0034rem;
  }
}
</style>
