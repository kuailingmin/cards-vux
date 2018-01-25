<template>
    <div class="address-index">
        <group v-for="item of list" :key="item.id">
            <cell>
                <p class="text lg" slot="title"><span class="bold">{{item.name}}</span>&nbsp;{{item.phone}}</p>
                <p class="text" slot="title">{{item.province}} {{item.city}} {{item.district}} {{item.address}}</p>
            </cell>
            <cell>
                <check-icon slot="title"><span class="text brown">默认地址</span></check-icon>
                <div class="text brown"><span @click="$router.push(`/address/edit/${item.id}`)">编辑</span>&nbsp;&nbsp;<span @click="deleteAddress(item.id)">删除</span></div>
            </cell>
        </group>
        <x-button class="bottom-button" @click.native="$router.push('/address/add')">添加新地址</x-button>
        <div v-transfer-dom>
            <confirm
            v-model="show"
            @on-cancel="onCancel"
            @on-confirm="onConfirm">
                <p class="text" style="font-size: 0.18rem;font-weight:bold">提示</p>
                <p class="text" style="margin-top:0.08rem">确定要删除该地址吗？</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import {
  Group,
  Cell,
  CheckIcon,
  Confirm,
  TransferDomDirective as TransferDom,
  XButton
} from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const AddressState = namespace('address', State);
const AddressAction = namespace('address', Action);

@Component({
  directives: {
    TransferDom
  },
  components: { Group, Cell, CheckIcon, Confirm, XButton }
})
export default class Address extends Vue {
  show = false;
  clickId = '';

  @AddressState list;

  @AddressAction remove;
  @AddressAction getData;

  onCancel () {
    this.show = false;
  }

  onConfirm () {
    this.show = false;
    this.remove(this.clickId).then(msg => msg && this.$vux.toast.show(msg));
  }
  deleteAddress (id) {
    this.show = true;
    this.clickId = id;
  }
  created () {
    this.getData();
  }
}
</script>
<style lang="less">
.address-index {
  .vux-no-group-title,
  .weui-cells {
    margin-top: 0 !important;
    margin-bottom: 0.15rem;
  }
  .weui-cell:before {
    left: 0 !important;
  }
  .bottom-button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
