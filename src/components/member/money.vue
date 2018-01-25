<template>
    <div class="money">
        <flexbox class="top" orient="vertical" justify="space-around">
            <flexbox-item v-once class="title">余额</flexbox-item>
            <flexbox-item>
                <flexbox align="center" style="height:100%">
                    <div><span class="price-mark">￥</span><span class="head-price">{{userInfo.balance || '0.00'}}</span></div>
                    <x-button class="button" @click.native="$router.push('/recharge')">充值</x-button>
                </flexbox>
            </flexbox-item>
        </flexbox>
        <group class="list">
            <cell is-link v-once>
                <span slot="title" class="text lg">交易记录</span>
                <span class="text" @click="$router.push('/rechargeDetailed')">更多</span>
            </cell>
            <cell v-for="(item, index) in recordList" :key="index" class="card">
                <flexbox slot="title" justify="space-between">
                    <span class="text lg">{{item.title}}</span>
                    <span class="text lg">{{item.income}}</span>
                </flexbox>
                <span slot="inline-desc" class="text lg gray">{{item.create_time}}</span>
            </cell>
        </group>
    </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { Flexbox, FlexboxItem, XButton, Cell, Group, Toast } from 'vux';
import { State, Action, namespace } from 'vuex-class';
const BalanceState = namespace('balance', State);
const BalanceAction = namespace('balance', Action);
const UserState = namespace('user', State);
@Component({
  components: { Flexbox, FlexboxItem, XButton, Cell, Group, Toast }
})
export default class Money extends Vue {
  @BalanceState recordList;
  @UserState userInfo;
  @BalanceAction getRecords;
  currentPage = 1;
  activated () {
    const params = {
      page: this.currentPage
    };
    this.getRecords(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
  }
}
</script>
<style lang="less" scoped>
.money {
  .title {
    height: 0.95rem;
  }
  .vux-flexbox-item {
    margin-top: 0 !important;
  }
  .price-mark {
    font-size: 0.24rem;
    color: #ffffff;
  }
  .vux-flexbox {
    justify-content: space-between;
  }
  .weui-btn {
    margin: 0 !important;
  }
  .button {
    width: 0.8rem;
    height: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: initial !important;
  }
  .top {
    padding: 0 0.15rem;
    width: unset;
    height: 100%;
    background: url("../../assets/bg.png") center center no-repeat;
    .title {
      font-size: 0.18rem;
      color: #ffffff;
      letter-spacing: -0.0043rem;
      display: flex;
      align-items: center;
    }
    .head-price {
      font-size: 0.48rem;
      color: #ffffff;
    }
    .button {
      font-size: 0.18rem;
      color: #b79e74;
      letter-spacing: -0.0043rem;
      background: #ffffff;
      border-radius: 0.03rem;
    }
  }
  .list {
    .card {
      background: #ffffff;
    }
  }
}
</style>
