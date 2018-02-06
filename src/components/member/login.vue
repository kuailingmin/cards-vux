<template>
  <div class="login">
      <x-img class="top-image"/>
      <flexbox class="box">
        <input placeholder="请输入手机号" v-model="phone" type="tel"/>
      </flexbox>
      <flexbox class="box" v-show="!type">
        <input placeholder="请输入密码" v-model="password" type="password"/>
      </flexbox>
      <flexbox v-show="type">
        <flexbox-item :span="0.6">
            <flexbox class="box">
                <input placeholder="请输入验证码" v-model="code"/>
            </flexbox>
        </flexbox-item>
        <flexbox-item>
            <x-button class="button" @click.native="sendCodeClick" v-show="time===0">发送验证码</x-button>
            <x-button class="button" v-show="time>0">已发送{{time}}s</x-button>
        </flexbox-item>
      </flexbox>
      <x-button class="button" @click.native="signIn">登录</x-button>
      <flexbox justify="space-between" class="line">
          <p class="text brown"><span class="gray">没有账号？</span><span @click="$router.push('/register')">马上注册</span></p>
          <span class="text brown " @click="type=!type">{{type?'密码登录':'短信登录'}} >></span>
      </flexbox>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Flexbox, FlexboxItem, XButton, XImg, Toast } from 'vux';
import { Action, State, namespace } from 'vuex-class';
const UserAction = namespace('user', Action);
const GlobalState = namespace('global', State);
let timer = null;
@Component({
  components: { Flexbox, FlexboxItem, XButton, XImg, Toast },
  watch: {
    $route: function (val, oldval) {
      if (timer) {
        this.time = 0;
        clearInterval(timer);
      }
    }
  }
})
export default class Login extends Vue {
  @UserAction login;
  @UserAction sendCode;
  @GlobalState storeId;
  type = false;
  phone = '';
  password = '';
  code = '';
  time = 0;
  isType = 0;
  bStop = false;
  sendCodeClick () {
    let reg = /^(((1[0-9]{2}))+\d{8})$/;
    if (!reg.test(this.phone)) {
      this.$vux.toast.text('请输入有效的手机号码', 'middle');
    } else {
      const params = {
        store_id: this.storeId,
        mobile: this.phone,
        type: 'login-shop'
      };
      this.sendCode(params).then(msg => {
        if (msg) {
          this.bStop = false;
          this.$vux.toast.text(msg, 'middle');
        } else {
          this.bStop = true;
          this.time = 60;
          timer = setInterval(() => {
            if (this.time > 0) {
              this.time--;
            } else {
              clearInterval(timer);
            }
          }, 1000);
        }
      });
    }
  }
  signIn () {
    let flag = true;
    let reg = /^(((1[0-9]{2}))+\d{8})$/;
    if (this.type && this.code === '') {
      this.$vux.toast.text('请输入验证码', 'middle');
      flag = false;
    }
    if (this.phone === '' || !reg.test(this.phone)) {
      this.$vux.toast.text('请输入有效的手机号码', 'middle');
      flag = false;
    }
    if (!this.type && this.password === '') {
      this.$vux.toast.text('请输入密码', 'middle');
      flag = false;
    }
    if (!this.type) {
      this.bStop = true;
      this.isType = 0;
    } else {
      this.isType = 1;
    }
    if (flag && this.bStop) {
      const params = {
        store_id: this.storeId,
        mobile: this.phone,
        pwd: this.type ? this.code : this.password,
        type: this.isType
      };
      this.login(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          clearInterval(timer);
          this.$router.push('/main');
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  .weui-btn {
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 0.42rem !important;
  }
  background: #ffffff;
  height: 100%;
  padding: 0 0.16rem;
  .top-image {
    width: 100%;
    max-height: 1.25rem;
    overflow: hidden;
  }
  .box {
    margin-top: 0.16rem;
    border: 1px solid #979797;
    border-radius: 0.03rem;
    width: 100%;
    height: 0.4rem;
    input {
      padding: 0 0.08rem;
      border: none;
      width: 100%;
      height: 100%;
      font-size: 0.14rem;
    }
  }
  .button {
    margin-top: 0.16rem;
  }
  .line {
    margin-top: 0.16rem;
  }
}
</style>
