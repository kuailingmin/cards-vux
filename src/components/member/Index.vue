<template>
  <div class="member">
    <div class="mer">
      <avatar :backgroundColor="setColor" color="#ffffff" :size="60" :src="token===''?'':userInfo.head_pic" username="Avatar"></avatar>
       <p v-if="token===''" class="logintxt" :style="{'color':setColor}" @click="toLogin">请登录</p>
       <ul class="merinfo" v-else>
         <li>
           <label class="lableft labcom">{{userInfo.mobile}}</label>
           <label class="labright labcom">{{kname}}</label>
         </li>
         <li class="text gray">{{userInfo.company}}</li>
       </ul>
    </div>
    <group>
      <cell title="我的订单" is-link :link="token===''?'/login':'/order'"></cell>
    </group>
    <group>
      <cell title="现金账户" :value="`￥${token===''?0:userInfo.balance == undefined ? '' : userInfo.balance}`" is-link :link="token===''?'/login':'/member/money'"></cell>
      <cell title="收货地址" is-link :link="token===''?'/login':'/address'"></cell>
      <cell title="我的卡券商城" @click.native="handleSetShowEdit" is-link>{{isRead.is_read==='0'?'':'有新的订单'}}</cell>
    </group>
    <group v-once>
      <cell title="客户服务" @click.native="handleClickTel" is-link>{{kfPhone}}</cell>
      <cell title="帮助中心" is-link link="/help"></cell>
    </group>
    <div class="exit text" @click="exitshow(1)" v-if="token!==''">退出登录</div>  
    <div class="support">飞象企服提供技术支持</div>
     <div class="exitcss" v-show="exitcss == true">
      <div class="k">
        <div class="kdiv">
          <p style="font-size: 0.18rem;font-weight:bold;">提示</p>
          <p style="font-size: 0.14rem;">是否退出登录？</p>
        </div>
         <div class="btn-clss">
           <a class="extBtn"  @click="exitshow(0)">取消</a>
           <a class="extOK"  @click="exit" :style="{'background-color':setColor}" >确认</a>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Cell, Group, XImg, Toast, Confirm } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import Avatar from 'vue-avatar';
const UserState = namespace('user', State);
const UserAction = namespace('user', Action);
@Component({
  components: {
    Cell,
    Group,
    XImg,
    Toast,
    Avatar,
    Confirm
  }
})
export default class Member extends Vue {
  @UserState token;
  @UserState userInfo;
  @UserState isRead;
  @UserAction initGetIsRead;
  @UserAction getInfos;
  setColor = localStorage.getItem('setColor')
  exitcss = false
  kfPhone = localStorage.getItem('kfPhone') || ''
  kname =''
  handleClickTel () {
    window.location.href = `wtai://wp//mc;${this.kfPhone}`;
  }
  handleSetShowEdit () {
    if (this.token === '') {
      this.$router.push('/login');
    } else {
      localStorage.setItem('showEdit', '');
      this.$router.push('/mine');
    }
  }
  created () {
    if (this.token !== '') {
      this.initial();
    }
  }
  initial () {
    const params = {};
    this.getInfos(params).then(res => {
      if (res.status === '00000') {
        this.$vux.toast.text(res.status.msg, 'middle');
      } else {
        this.kname = res.result.level_name;
        localStorage.setItem('balancePrice', this.userInfo.balance);
        localStorage.setItem('userId', this.userInfo.user_id);
      }
    });
    this.initGetIsRead(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
  }
  toLogin () {
    this.$router.push('/login');
  }
  exitshow (id) {
    if (id === 0) {
      this.exitcss = false;
    } else {
      this.exitcss = true;
    }
  }
  exit () {
    localStorage.setItem('token', '');
    this.$store.commit('user/setToken', '');
    this.exitshow(0);
  }
}
</script>
<style lang="less">
.member {
  .weui-cell:before {
    left: 0 !important;
  }
  .vue-avatar--wrapper {
    margin: 0 0.15rem;
  }
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

    img {
      border-radius: 50%;
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
    .logintxt {
      width: 70%;
      height:0.6rem;
      line-height: 0.6rem;
      color: #b79e74;
      font-size: 0.18rem;
    }
  }
  .exit {
    width: 100%;
    height: 0.44rem;
    text-align: center;
    line-height: 0.44rem;
    background: #fff;
    margin-top: 0.15rem;
  }
  .support {
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a6a6a6;
    font-size: 0.14rem;
  }
}
.exitcss{
    width: 100%;
    height: calc(100vh);
    position: fixed;
    top:0px;
    left: 0px;
    z-index: 999999;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  .k{
    width: 80%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 4px;
    .kdiv{
      height:1.56rem;
      width:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      p{
        color: #3c3c3c;
        text-align: center;
      }
    }
    
    .btn-clss{
      width: 100%;
      display: flex;
      justify-content:center;

      a{
        width: 50%;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        font-size: 0.14rem;
        color: #fff;
      }
      .extBtn{
          background: #d9d9d9;
      }
      .extOK{
         background: #B79E74;
      }
    }
  }
}
</style>

