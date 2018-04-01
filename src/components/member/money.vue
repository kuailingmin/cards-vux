<template>
    <div class="money">
        <flexbox class="top" orient="vertical" justify="space-around">
          <img class="my-img" src="../../assets/bg.png" alt="">
          <flexbox-item v-once class="title">余额</flexbox-item>
          <flexbox-item class="head-money-show">
              <flexbox align="center" style="height:100%">
                  <div><span class="price-mark">￥</span><span class="head-price">{{balancePrice}}</span></div>
                  <x-button class="button" @click.native="$router.push('/recharge')" :style="{'color':setColor}">充值</x-button>
              </flexbox>
          </flexbox-item>
        </flexbox>
        <group class="list">
            <cell link="/rechargeDetailed" is-link v-once>
                <span slot="title" class="text lg">交易记录</span>
                <span class="text">更多</span>
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

@Component({
  components: { Flexbox, FlexboxItem, XButton, Cell, Group, Toast }
})
export default class Money extends Vue {
  @BalanceState recordList;
  @BalanceState userInfo;
  @BalanceAction getRecords;
  @BalanceAction getInfo;
  currentPage = 1;
  setColor = localStorage.getItem('setColor')
  params = {};
  balancePrice = localStorage.getItem('balancePrice') || '0.00';
  created () {
    const params = {
      page: this.currentPage
    };
    this.getRecords(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
    this.init();
  }
  init () {
    const params = {};
    this.getInfo(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      } else {
        this.balancePrice = this.userInfo.balance;
        localStorage.setItem('balancePrice', this.userInfo.balance);
      }
    });
  }
}
</script>
<style lang="less" scoped>
.money {
  .weui-cell:before {
    left: 0 !important;
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
  .my-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  .head-money-show {
    z-index: 1;
  }
  .top {
    position: relative;
    padding: 0 0.15rem;
    width: unset;
    height: 100%;
    .title {
      font-size: 0.18rem;
      color: #ffffff;
      letter-spacing: -0.0043rem;
      display: flex;
      align-items: center;
      z-index: 1;
      height: 0.95rem;
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
      width: 0.8rem;
      height: 0.3rem;
      line-height: 0.3rem !important;
    }
  }
  .list {
    .card {
      background: #ffffff;
    }
  }
}
</style>
