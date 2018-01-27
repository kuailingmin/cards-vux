<template>
  <div class="index">
      <flexbox class="top" align="center" v-show="showEdit">
        <x-button mini link="/intention">意向单</x-button>
        <x-button mini @click.native="handleClickIsShow">立即推广</x-button>
        <div class="info-edit-box">
          <div class="info-left">
            <span class="img-box"><avatar :src="shareInfo.head_pic" backgroundColor="#B79E74" color="#ffffff" :size="40" username="Avatar"></avatar></span>
            <span class="info-title">{{shareInfo.realname}}</span>
          </div>
          <div @click="handleToInfoEdit" class="info-right">
            <span class="info-title info-edit">编辑</span>
            <span class="app-icon info-title">&#xe684;</span>
          </div>
        </div>
      </flexbox>
      <l-header></l-header>
      <div class="block">
        <p class="recommend-title">{{mainRecommend.title}}</p>
        <flexbox wrap="wrap" :gutter="0">
            <flexbox-item style="display:flex" :key="index" :span="item.show_type===1?0.5:1/1.0001" v-for="(item, index) in mainRecommend.list" >
                <x-img v-if="item.show_type===1" :src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${parseInt(imgWidth/2)}/format,jpg`" :webp-src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${parseInt(imgWidth/2)}/format,webp`" container="#vux_view_box_body"></x-img>
                <x-img v-else-if="item.show_type===2" :src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,jpg`" :webp-src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,webp`" container="#vux_view_box_body"></x-img>
            </flexbox-item>
        </flexbox>
      </div>
      <l-scroller v-for="(scroller, index) in scrollers" :key="index" color="blue" :title="scroller.title" :list="scroller.card_list"></l-scroller>
      <div class="block">
        <p class="recommend-title">{{recommend.title}}</p>
        <grid :cols="2">
          <grid-item v-for="(item, index) in recommend.list" :key="index">
            <card :item="item"></card>
          </grid-item>
        </grid>
      </div>
      <load-more tip="正在加载" v-show="loading" ref="loadMore"></load-more>
      <div v-transfer-dom>
        <x-dialog :dialog-style="{background:'transparent'}" v-model="showTip" hide-on-blur>
          <img src="../../assets/share.png" style="width:100%"/>
        </x-dialog>
      </div>
  </div>
</template>
<script>
import LHeader from './header';
import LScroller from './scroller';
import { Toast, XImg, Flexbox, FlexboxItem, Grid, GridItem, LoadMore, XButton, XDialog, TransferDomDirective as TransferDom } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, Mutation, namespace} from 'vuex-class';
import Card from './card';
import Avatar from 'vue-avatar';
import {isBottom} from '../../js';
const IndexState = namespace('index', State);
const IndexAction = namespace('index', Action);
const IndexMutation = namespace('index', Mutation);
const UserState = namespace('user', State);
const GlobalState = namespace('global', State);
@Component({
  directives: {
    TransferDom
  },
  components: {
    LHeader,
    LScroller,
    XImg,
    Card,
    Flexbox,
    FlexboxItem,
    GridItem,
    Grid,
    LoadMore,
    XButton,
    XDialog,
    Avatar,
    Toast
  }
})
export default class Index extends Vue {
  @IndexState recommend
  @IndexState shareInfo
  @UserState userInfo
  @IndexState mainRecommend
  @IndexState scrollers
  @IndexState page
  @IndexState isEnd
  @IndexState intentionList
  @IndexAction init
  @IndexAction loadMore
  @IndexAction initGetShareInfo
  @IndexAction initIntentionList
  @IndexMutation setPage
  handleClickToIntention
  @GlobalState storeId;
  imgWidth= screen.width
  showTip=false
  loading=false
  showEdit = false
  handleToInfoEdit () {
    this.$router.push('/editInfo');
  }
  handleClickIsShow () {
    this.showTip ? this.showTip = false : this.showTip = true;
  }
  created () {
    this.showEdit = JSON.parse(localStorage.getItem('showEdit'));
    this.init().then(msg => {
      msg && this.$vux.toast.text(msg);
      this.setPage(this.page + 1);
    }).catch(error => console.log(error));
    if (this.showEdit) {
      const params = {
        'share_user_id': this.userInfo.user_id,
        'store_id': this.storeId
      };
      this.initGetShareInfo(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        }
      });
    }
  }
  mounted () {
    const element = document.querySelector('#vux_view_box_body');
    isBottom(element,
      () => {
        !this.isEnd && !this.loading && (() => {
          this.loading = true;
          this.loadMore().then(() => {
            this.loading = false;
            this.setPage(this.page + 1);
            element.scrollTop -= (this.$refs.loadMore.$el.getBoundingClientRect().height + 10);
          }).catch(error => console.log(error));
        })();
      }
    );
  }
}
</script>

<style lang="less" scoped>
.index {
  font-size: 0.14rem;
  padding-bottom: 0.44rem;
  .weui-btn {
    width: 1rem;
  }
  .app-icon {
    margin: 0 0.15rem;
  }
  .info-edit {
    font-size: 0.16rem !important;
  }
  .info-left, .info-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .img-box {
    margin: 0 0.15rem;
  }
  .info-title {
    font-size: 0.18rem;
    color: #FFFFFF;
  }
  .info-img {
    width: 0.4rem;
    height: 0.4rem;
    border: none;
  }
  .info-edit-box {
    position: absolute;
    top: 0.44rem;
    left: 0;
    height: 0.6rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
  }
  .weui-btn {
    margin: 0 !important;
  }
  .top{
      margin: 0 !important;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 0.44rem;
      position: relative;
  }
  .recommend-title{
      position: absolute;
      top: -0.17rem;
      left: 0;
      width: 1rem;
      height: 0.3rem;
      line-height: 0.3rem;
      border-radius: 0 0.25rem 0.25rem 0;
      background: #f76868;
      text-align: center;
      color: #fff;
      font-weight: bold;
      font-size: 0.16rem;
      z-index:50;
  }
  .block{
    margin:0.16rem 0;
    width: 100%;
    position: relative;
  }
}
</style>
