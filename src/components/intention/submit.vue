<template>
    <div class='submit'>
        <l-input v-for="(item, index) in list" :key="index" :textarea="item.textarea" :placeholder="item.placeholder" :label="item.label" v-model="item.value"></l-input>
        <x-button class="submit-btn" @click.native="handleSubmit">提 交</x-button>
    </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import LInput from '../common/input';
import { XButton, Toast } from 'vux';
import { State, namespace, Action } from 'vuex-class';
const ProductsAction = namespace('products', Action);
const GlobalState = namespace('global', State);
const IndexState = namespace('index', State);
@Component({
  components: { LInput, XButton, Toast }
})
export default class IntentionSubmit extends Vue {
  @GlobalState storeId;
  @ProductsAction submitIntentionList;
  @IndexState shareInfo;
  @IndexState shareId;
  list = [
    {
      label: '姓名',
      placeholder: '请填写姓名',
      value: '',
      textarea: false
    },
    {
      label: '联系方式',
      placeholder: '请填写联系方式',
      value: '',
      textarea: false
    },
    {
      label: '企业名称',
      placeholder: '请填写企业全称',
      value: '',
      textarea: false
    },
    {
      label: '收货地址',
      placeholder: '请填写收货地址',
      value: '',
      textarea: true
    }
  ];
  handleSubmit () {
    let flag = true;
    let arr = this.list;
    let len = this.list.length;
    for (let i = 0; i < len; i++) {
      if (arr[i].value === '') {
        this.$vux.toast.text('请您把表单填写完整', 'middle');
        flag = false;
        break;
      }
    }
    if (flag) {
      let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (!reg.test(arr[1].value)) {
        this.$vux.toast.text('请输入有效的手机号码', 'middle');
      } else {
        let myTempData = localStorage.getItem('myTempData');
        const params = {
          store_id: this.storeId,
          shop_ids: myTempData,
          share_user_id: this.shareId,
          full_address: arr[3].value,
          phone: arr[1].value,
          name: arr[0].value,
          company: arr[2].value
        };
        this.submitIntentionList(params).then(msg => {
          if (msg) {
            this.$vux.toast.text(msg, 'middle');
          } else {
            this.$router.push('/submitSuccess');
          }
        });
      }
    }
  }
}
</script>
<style lang="less" scoped>
.submit {
  position: relative;
  height: 100%;
  .l-input {
    margin-bottom: 0.15rem;
    margin-top: 0;
  }
  .submit-btn {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
