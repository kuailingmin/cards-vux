<template>
  <div class="index-myIndex">
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
      <div v-show="mainRecommend.is_show==='1'" class="block">
        <p class="recommend-title">{{mainRecommend.block_content.title}}</p>
        <flexbox wrap="wrap" :gutter="0">
            <flexbox-item style="display:flex" :key="index" :span="item.show_type===1?0.5:1/1.0001" v-for="(item, index) in mainRecommend.block_content.list">
              <img class="my-img" v-show="item.show_type===1" :src="item.pic_url" alt="">
              <img class="my-img" v-show="item.show_type===2" :src="item.pic_url" alt="">
            </flexbox-item>
        </flexbox>
      </div>
      <l-scroller :style="{'background':`linear-gradient(to right,${scroller.color_start},${scroller.color_end})`}" v-show="scrollers.is_show==='1'" v-for="(scroller, index) in scrollers.block_content" :key="index" color="blue" :title="scroller.title" :list="scroller.card_list"></l-scroller>
      <div v-show="recommend.is_show==='1'" class="block">
        <p class="recommend-title">{{recommend.block_content.title}}</p>
        <grid :cols="2">
          <grid-item v-for="(item, index) in recommend.block_content.list" :key="index">
            <card class="my-card" :item="item" @click.native="$router.push(`/detail/${item.id}`)"></card>
          </grid-item>
        </grid>
      </div>
      <load-more tip="正在加载" v-show="loading" ref="loadMore"></load-more>
      <div v-transfer-dom>
        <x-dialog :dialog-style="{width:'2.56rem',height:'2.08rem',background:'transparent'}" v-model="showTip" hide-on-blur>
          <img src="../../assets/share.png" style="width:100%;height:100%;"/>
        </x-dialog>
      </div>
  </div>
</template>
<script>
import LHeader from './header';
import LScroller from './scroller';
import { Toast, Flexbox, FlexboxItem, Grid, GridItem, LoadMore, XButton, XDialog, TransferDomDirective as TransferDom } from 'vux';
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
let wx = require('weixin-js-sdk');
@Component({
  directives: {
    TransferDom
  },
  components: {LHeader, LScroller, Card, Flexbox, FlexboxItem, GridItem, Grid, LoadMore, XButton, XDialog, Avatar, Toast}
})
export default class Index extends Vue {
  @IndexState recommend
  @IndexState shareInfo
  @IndexState WxShare
  @UserState userInfo
  @IndexState mainRecommend
  @IndexState scrollers
  @IndexState page
  @IndexState isEnd
  @IndexAction init
  @IndexAction loadMore
  @IndexAction initGetShareInfo
  @IndexAction initWxshare
  @IndexMutation setPage
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
    if (/main/.test(this.$route.path)) {
      this.showEdit = localStorage.setItem('showEdit', JSON.stringify(false));
    } else {
      this.showEdit = JSON.parse(localStorage.getItem('showEdit'));
    }
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
    const params = {
      'share_url': location.href.split('#')[0]
    };
    this.initWxshare(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      } else {
        let {appId, timestamp, nonceStr, signature, jsApiList} = this.WxShare.wechat;
        let {share} = this.WxShare;
        wx.config({
          debug: false,
          appId: appId,
          timestamp: timestamp,
          nonceStr: nonceStr,
          signature: signature,
          jsApiList: jsApiList
        });
        wx.ready(() => {
          wx.checkJsApi({
            jsApiList: jsApiList,
            success: function (res) {}
          });
          wx.onMenuShareTimeline({
            title: share.share_title,
            link: share.link,
            imgUrl: share.share_img,
            success: function () {},
            cancel: function () {}
          });
          wx.onMenuShareAppMessage({
            title: share.share_title,
            desc: share.share_describe,
            link: share.link,
            imgUrl: share.share_img,
            type: 'link',
            dataUrl: '',
            success: function () {},
            cancel: function () {}
          });
        });
      }
    });
  }
}
</script>

<style lang="less">
.index-myIndex {
  font-size: 0.14rem;
  .my-img {
    width: 100%;
    height: 100%;
    border: none;
  }
  .my-card {
    height: 2.6rem !important;
  }
  .focus {
    margin-right: 0 !important;
    width: 40% !important;
  }
  .marquee-height {
    width: 2.4rem;
    padding: 0 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card img {
    height: 1.1rem;
  }
  .my-card img {
    height: 1.34rem;
  }
  .card {
    height: 2.05rem;
    justify-content: space-around !important;
  }
  .vux-flexbox {
    justify-content: flex-start;
  }
  .scroller {
    margin-top: 0.2rem !important;
    padding: 0 0.08rem;
  }
  .bold {
    color: #ffffff !important;
    font-weight: initial;
  }
  .block {
    margin-top: 0.3rem !important;
  }
  .title {
    height: 0.44rem;
    line-height: 0.44rem !important;
  }
  .vux-swiper {
    height: 2.44rem !important;
  }
  .marqueediv  {
    margin: 0 !important;
    padding: 0 !important;
    height: 0.44rem;
  }
  .vux-icon-dot {
    width: 0.12rem !important;
    height: 0.04rem !important;
    background: #D9D9D9;
  }
  .active {
    background: #3c3c3c !important;
  }
  .weui-btn_mini {
    font-size: 0.12rem !important;
  }
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
    z-index: 1;
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
    width: 100%;
    position: relative;
  }
}
</style>
