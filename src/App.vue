<template>
  <div id="app">
     <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">
       <x-header slot="header" :title="title" class="header"></x-header>
       <transition name="vux-header-fade-in-right">
            <router-view></router-view>
       </transition> 
     </view-box>
  </div>
</template>

<script>
import { ViewBox, XHeader } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, namespace} from 'vuex-class';

const GlobalState = namespace('global', State);

@Component({
  components: {ViewBox, XHeader}
})
export default class App extends Vue {
    @GlobalState title
};
</script>

<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height:100%;
  background: #F6F6F6;

  .header{
    width:100%;
    position: absolute;
    left:0;
    top:0;
    z-index:100;
  }
}

</style>
<style lang="less">
@import "~vux/src/styles/reset.less";
@import "./css/common.less";
  #vux_view_box_body{
    overflow-x: hidden;
  }
.weui-grid{
  text-decoration: none;
  padding:0.04rem!important;
}

.vux-cell-form-preview{
  font-size:0.14rem
}
</style>

