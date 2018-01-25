<template>
  <div id="app">
     <view-box ref="viewBox" body-padding-top="46px" :body-padding-bottom="/main/.test($route.path)?'55px':'0'">
       <x-header slot="header" :title="title" class="header"></x-header>
       <transition name="vux-header-fade-in-right">
         <keep-alive exclude="/商品详情|订单详情|物流信息|意向单详情|充值详情/">
            <router-view></router-view>
         </keep-alive>
       </transition>
       <tabbar slot="bottom" v-show="/main|mine/.test($route.path)">
          <tabbar-item v-for="(item,index) in tabs" :key="index" :selected="item.selected" :badge="item.badge" :link="item.link">
            <span slot="icon" class="app-icon" v-html="item.iconfont"></span>
            <span slot="label" class="tabbar-item">{{item.name}}</span>
          </tabbar-item>
       </tabbar> 
     </view-box>
  </div>
</template>
<script>
import { ViewBox, XHeader, Tabbar, TabbarItem } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
const GlobalState = namespace('global', State);
@Component({
  components: { ViewBox, XHeader, Tabbar, TabbarItem },
  watch: {
    $route: function (val, oldval) {
      if (/mine/.test(location.hash.split('/')[1])) {
        this.tabs = [
          { name: '首页', selected: true, iconfont: '&#xe65d;', link: '/mine' },
          { name: '分类', iconfont: '&#58965;', link: '/mine/classification' },
          { name: '意向单', iconfont: '&#xe660;', link: '/mine/intentionList' }
        ];
      } else {
        this.tabs = [
          { name: '首页', selected: true, iconfont: '&#xe65d;', link: '/main' },
          { name: '分类', iconfont: '&#58965;', link: '/main/classification' },
          { name: '购物车', iconfont: '&#xe65c;', link: '/main/cart' },
          { name: '会员', iconfont: '&#58967;', link: '/main/member' }
        ];
      }
    }
  }
})
export default class App extends Vue {
  @GlobalState title;
  tabs = [];
}
</script>
<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  font-size: 0.14rem;
  background: #f6f6f6;
  .header {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 992;
  }
}
</style>
<style lang="less">
@import "~vux/src/styles/reset.less";
@import "./css/common.less";
#vux_view_box_body {
  overflow-x: hidden;
}
.weui-grid {
  text-decoration: none;
  padding: 0.04rem !important;
}
.vux-cell-form-preview {
  font-size: 0.14rem;
}
</style>

