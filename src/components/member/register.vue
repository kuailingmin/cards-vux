<template>
  <div class="register">
      <x-img class="top-image"/>
      <flexbox class="box">
        <input placeholder="请填写企业全称" v-model="company"/>
      </flexbox>
      <flexbox class="box">
        <input placeholder="请输入密码" v-model="password" type="password"/>
      </flexbox>
      <flexbox class="box">
        <input placeholder="请输入手机号" v-model="phone" type="tel"/>
      </flexbox>
      <flexbox align="center">
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
      <div class="bottom">
        <x-button class="button" @click.native="signUp">{{type?'关联账号':'注册'}}</x-button>
        <span class="text brown" v-if="!type" @click="$router.push('/login')">马上登录</span>
      </div>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Flexbox, FlexboxItem, XButton, XImg } from 'vux';
import { Action, namespace, State } from 'vuex-class';
const UserAction = namespace('user', Action);
const GlobalState = namespace('global', State);
let timer = null;
@Component({
  components: { Flexbox, FlexboxItem, XButton, XImg },
  watch: {
    $route: function (val, oldval) {
      if (timer) {
        this.time = 0;
        clearInterval(timer);
      }
    }
  }
})
export default class Register extends Vue {
  company = '';
  password = '';
  phone = '';
  code = '';
  time = 0;
  bStop = false;
  @UserAction register;
  @UserAction sendCode;
  @GlobalState storeId;
  get type () {
    return this.$route.path === '/register/wechat';
  }
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
          this.$vux.toast.text(msg);
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
  signUp () {
    let flag = true;
    let reg = /^(((1[0-9]{2}))+\d{8})$/;
    if (this.code === '') {
      this.$vux.toast.text('请输入验证码', 'middle');
      flag = false;
    }
    if (this.phone === '' || !reg.test(this.phone)) {
      this.$vux.toast.text('请输入有效的手机号码', 'middle');
      flag = false;
    }
    if (this.password === '') {
      this.$vux.toast.text('请输入密码', 'middle');
      flag = false;
    }
    if (this.company === '') {
      this.$vux.toast.text('请输入企业名称', 'middle');
      flag = false;
    }
    if (flag && this.bStop) {
      const params = {
        store_id: this.storeId,
        mobile: this.phone,
        company: this.company,
        password: this.password,
        code: this.code
      };
      this.register(params).then(
        msg =>
          msg
            ? this.$vux.toast.text(msg, 'middle')
            : this.$router.push('/login')
      );
    }
  }
}
</script>
<style lang="less" scoped>
.register {
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
  .bottom {
    text-align: center;
    position: fixed;
    bottom: 0.64rem;
    width: calc(~"100% - 0.32rem");
    .button {
      padding: 0;
      margin: 0;
      margin-bottom: 0.08rem;
    }
    p {
      text-align: center;
    }
  }
}
</style>
