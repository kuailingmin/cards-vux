<template>
  <div class="delivery">
    <flexbox class="text lg first">
        <flexbox-item :span="0.3">物流状态</flexbox-item>
        <flexbox-item>{{status}}</flexbox-item>
    </flexbox>
    <flexbox class="text lg">
        <flexbox-item :span="0.3">快递单号</flexbox-item>
        <flexbox-item>{{expressNo}}&nbsp;&nbsp;&nbsp;({{expressName}})</flexbox-item>
    </flexbox>
    <flexbox orient="vertical" v-for="(item,index) of list" :key="index" :class="`text ${index>0&&'gray'}`">
        <flexbox-item>{{item.context}}</flexbox-item>
        <flexbox-item>{{item.time}}</flexbox-item>
    </flexbox>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Flexbox, FlexboxItem } from 'vux';
import { axios } from '../../js';
import qs from 'qs';

@Component({
  components: { Flexbox, FlexboxItem }
})
export default class Delivery extends Vue {
  state = 0;
  expressNo = '';
  expressName = '';
  list = [];

  get status () {
    switch (this.state) {
      case 0:
        return '在途';
      case 1:
        return '揽件';
      case 2:
        return '疑难';
      case 3:
        return '签收';
      case 4:
        return '退签';
      case 5:
        return '派件';
      case 6:
        return '退回';
    }
  }

  async getInfo () {
    const { result, status: { code, msg } } = await axios.post(
      '/order/get-express',
      qs.stringify({ order_sn: this.$route.params.id })
    );
    if (code === '00000') {
      this.list = result.data;
      this.state = result.state;
      this.expressNo = result.express_no;
      this.expressName = result.express_name;
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
.delivery {
  > * {
    padding: 0.08rem 0.16rem;
    width: calc(~"100% - 0.32rem");
    background: #ffffff;
  }
  .text {
    background: #ffffff;
  }
}
</style>
