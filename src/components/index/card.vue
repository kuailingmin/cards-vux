<template>
    <div class="card">
        <x-img container="#vux_view_box_body" :src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,jpg`" :webp-src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,webp`"/>
        <p class="text">{{item.name}}</p>
        <p class="text red">尊享价:{{item.price}}</p>
        <x-button mini @click.native.stop="handleAddCart(item)">加入购物车</x-button>
    </div>
</template>
<script>
import {XImg, XButton} from 'vux';
import {Action, namespace} from 'vuex-class';
import { Component, Vue, Prop } from 'vue-property-decorator';
const CartAction = namespace('cart', Action);
@Component({
  components: {XImg, XButton}
})
export default class Card extends Vue {
  @Prop([Object]) item
  imgWidth= parseInt(screen.width / 2)
  @CartAction addReduce
  flag = true
  showEdit = false
  tempData = []
  created () {
    this.showEdit = JSON.parse(localStorage.getItem('showEdit') || 'false');
    this.tempData = JSON.parse(localStorage.getItem('tempData') || '[]');
  }
  handleAddCart (item) {
    if (this.showEdit) {
      let bStop = true;
      this.tempData.forEach(project => {
        if (project.id === item.id) {
          bStop = false;
        }
      });
      if (bStop) {
        this.tempData.push({
          'id': item.id,
          'num': 1,
          'is_selected': 1
        });
        localStorage.setItem('tempData', JSON.stringify(this.tempData));
      }
      this.$vux.toast.text('加入购物车成功', 'middle');
    } else {
      if (this.flag) {
        const params = {
          'shop_id': item.id
        };
        this.addReduce(params).then(msg => {
          if (msg) {
            this.$vux.toast.text(msg, 'middle');
          } else {
            this.$vux.toast.text('加入购物车成功', 'middle');
          }
        });
        this.flag = false;
        let timer = setTimeout(() => {
          this.flag = true;
          clearTimeout(timer);
        }, 1000);
      } else {
        this.$vux.toast.text('您的操作过于频繁', 'middle');
      }
    }
  }
}
</script>
<style lang="less" scoped>
.card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:0.08rem;
    text-decoration: none;
    background: #ffffff;
    box-shadow: 0 0 0.1rem 0 rgba(0,0,0,0.05);
    .weui-btn_mini {
        font-size: 0.12rem !important;
        width: 1.1rem !important;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 !important;
        padding: 0 !important;
        height: 0.24rem;
        text-align: center;
        line-height: 0.24rem !important;
    }
    img{
        width: 100%;
        vertical-align: middle;
        margin: 0.08rem 0;
    }
    p{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin: 0 !important;
        text-align: center;
    }
    .red{
        font-size: 0.12rem;
    }
}
</style>
