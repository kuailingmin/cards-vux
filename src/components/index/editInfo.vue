<template>
  <div class="edit-info">
    <group>
      <cell title="商城头像" is-link>
        <span class="img-box">
          <avatar backgroundColor="#B79E74" color="#ffffff" :size="40" :src="imagesVal" username="Avatar"></avatar>
          <input type="file" ref="uploadImg" @change="handleUpload($event)" class="upload" accept="image/gif,image/jpeg,image/png,image/jpg">
        </span>
      </cell>
    </group>
    <group class="my-input"><x-input title="商城名称" v-model="shopName" show-clear></x-input></group>
    <x-button @click.native="handleSave">保 存</x-button>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Toast, Group, Cell, XInput, XButton } from 'vux';
import { Action, namespace, State } from 'vuex-class';
import Avatar from 'vue-avatar';
import { setTimeout, clearTimeout } from 'timers';
const IndexAction = namespace('index', Action);
const IndexState = namespace('index', State);
@Component({
  components: {Toast, Group, Cell, XInput, XButton, Avatar}
})
export default class EditInfo extends Vue {
  @IndexAction saveEditInfo
  @IndexAction initUploadImg
  @IndexState uploadRes
  @IndexState shareInfo
  shopName = ''
  imagesVal = ''
  created () {
    this.imagesVal = this.shareInfo.head_pic;
    this.shopName = this.shareInfo.realname;
  }
  handleUpload (e) {
    let file = e.target.files[0];
    let imgSize = file.size / 1024;
    if (imgSize > 200) {
      this.$vux.toast.text('请上传大小不要超过200KB的图片', 'middle');
    } else {
      let formData = new FormData();
      formData.append('file', file);
      this.initUploadImg(formData).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          this.imagesVal = this.uploadRes.file_url;
        }
      });
    }
  }
  handleSave () {
    if (this.shopName === '') {
      this.$vux.toast.text('请填写商城名称', 'middle');
    } else {
      let params = {
        'realname': this.shopName,
        'head_pic': this.uploadRes.file_hash
      };
      this.saveEditInfo(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          this.$vux.toast.text('修改信息成功', 'middle');
          let timer = null;
          timer = setTimeout(() => {
            clearTimeout(timer);
            this.$router.push('/mine');
          }, 1000);
        }
      });
    }
  }
}
</script>
<style lang="less">
  .edit-info {
    font-size: 0.14rem;
    .weui-btn {
      border-radius: 0 !important;
    }
    .weui-btn::after {
      content: initial;
    }
    .img-box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .upload {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 0.4rem;
      height: 0.4rem;
      border: none;
    }
    .weui-btn {
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .my-input .weui-cells:before {
      border: none !important;
    }
    .weui-cell__ft {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vux-label, .weui-label {
      color: #a6a6a6;
    }
    .img {
      margin-right: 0.07rem;
    }
    .weui-cells {
      margin: 0 !important;
      height: 0.55rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .weui-cell {
      padding: 0 0.15rem !important;
      width: 100%;
    }
  }
</style>

