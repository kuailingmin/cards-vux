<template>
    <div class="container">
       <transition name="vux-header-fade-in-right">
          <keep-alive>
            <router-view class="router-view"></router-view>
          </keep-alive>
       </transition> 
       <tabbar slot="bottom">
          <tabbar-item v-for="(item,index) in tabs" :key="index" :selected="item.selected" :badge="item.badge" :link="item.link">
            <span slot="icon" class="app-icon" v-html="item.iconfont"></span>
            <span slot="label" class="tabbar-item">{{item.name}}</span>
          </tabbar-item>
       </tabbar>
    </div>     
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  components: {
    Tabbar,
    TabbarItem
  }
})
export default class Container extends Vue {
  tabs= [
    { name: '首页', selected: true, iconfont: '&#58972;', link: '/main' },
    { name: '分类', iconfont: '&#58965;', link: '/main/classification' },
    { name: '购物车', badge: '2', iconfont: '&#58971;', link: '/main/cart' },
    { name: '会员', iconfont: '&#58967;', link: '/main/member' }
  ]
}
</script>
<style lang="less" scoped>
.container {

}
</style>
