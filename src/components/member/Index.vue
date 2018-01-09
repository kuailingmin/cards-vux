<template>
  <div>
    <div class="mer">
       <x-img :src="merberImg" width="60" height="60" container="#vux_view_box_body"/>
       <p v-show="status == 0" class="logintxt" @click="loginEvent">请登录</p>
       <ul class="merinfo" v-show="status == 1">
         <li>
           <label class="lableft labcom">李松鹏</label>
           <label class="labright labcom">三级会员</label>
         </li>
         <li class="company">杭州礼管家网络科技有限公司</li>
       </ul>
    </div>

    <group>
      <cell title="我的订单" is-link link="/"></cell>
    </group>
    <group>
      <cell title="现金账户" :value="price"  is-link link="/"></cell>
      <cell title="收货地址" is-link link="/"></cell>
      <cell title="我的卡券商城" :value="sta"  is-link link="/"></cell>
    </group>
    <group>
      <cell title="客户服务" value="0571-12345678"  is-link link="/"></cell>
      <cell title="帮助中心" is-link link="/"></cell>
    </group>
    <div class="exit" @click="exitEvent" v-show="status == 1">退出登录</div>  
    <p class="bottomTxt">飞象企服提供技术支持</p>
  </div>
</template>
<script>
import { Cell, Group, XImg } from 'vux'
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  components: {
    Cell,
    Group,
    XImg
  }
})
export default class Member extends Vue {
  merberImg = require('../../img/online.png');
  status = 0;
  price = '￥1000000.00';
  sta = '有新的订单';
  created () {
    this.init()
  }
  init () {}
  back () {
    this.$router.go(-1)
  }
  exitEvent () {}
  loginEvent () {}
}
</script>
<style lang="less" scoped>
.disflex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.mer {
  width: 100%;
  height: 1rem;
  .disflex();
  background: #fff;
  .cellFont {
    font-size: 14px;
  }

  img {
    border-radius: 70%;
    margin: 0 0.15rem;
  }
  .merinfo {
    width: 50%;
    .lableft {
      font-size: 0.18rem;
      color: #3c3c3c;
    }
    li {
      .disflex();
    }
    .labright {
      font-size: 0.14rem;
      color: #4386f4;
      margin-left: 0.1rem;
    }
    .labcom {
      float: left;
    }
  }
  .company {
    font-size: 0.14rem;
    color: #a6a6a6;
  }
  .logintxt {
    color: #b79e74;
    font-size: 0.18rem;
  }
}
.exit {
  width: 100%;
  height: 0.44rem;
  text-align: center;
  line-height: 0.44rem;
  font-size: 0.14rem;
  color: #3c3c3c;
  background: #fff;
  margin-top: 0.15rem;
}
.bottomTxt {
  font-size: 0.14rem;
  text-align: center;
  color: #a6a6a6;
  margin-top: 0.6rem;
}
</style>

