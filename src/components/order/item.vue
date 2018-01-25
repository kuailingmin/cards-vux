<template>
    <flexbox class="my-item" align="center">
        <flexbox-item :span="0.25" class="image-container">
            <x-img class="image" :src="`${item.goods_pic.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,jpg`" :webp-src="`${item.goods_pic.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,webp`" container="#vux_view_box_body"/></flexbox-item>
        <flexbox-item :span="0.5" class="text">{{item.goods_name}}</flexbox-item>
        <flexbox-item>
            <flexbox style="border:none;" orient="vertical">
                <flexbox-item class="text red">￥{{item.price}}</flexbox-item>
                <flexbox-item class="count">x {{item.num}}</flexbox-item>
            </flexbox>
        </flexbox-item>
    </flexbox>  
</template>
<script>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Flexbox, XImg, FlexboxItem } from 'vux';
@Component({
  components: { Flexbox, XImg, FlexboxItem }
})
export default class Item extends Vue {
  imgWidth = parseInt(screen.width / 2);
  @Prop([Object])
  item;
}
</script>
<style lang="less">
.my-item {
  .text {
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin-left: 0 !important;
    height: 100%;
  }
  .vux-flexbox .vux-flexbox-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.3rem;
    text-align: right;
  }
  .image-container {
    display: flex;
    justify-content: center;
    padding: 0.08rem;
    .image {
      height: 0.6rem;
    }
  }
  .count {
    font-size: 0.1rem;
    color: #a6a6a6;
    letter-spacing: -0.0024rem;
  }
}
</style>
