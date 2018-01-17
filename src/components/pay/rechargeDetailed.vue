<template>
  <div class="recharge-detailed">
    <!-- <div v-for="(item, index) in detailList" :key="index"> -->
      <!-- <div class="r-d-top">记录条数<span class="r-d-num">（{{rechargeRecords.list.length}}）</span></div> -->
      <!-- <group v-for="(subItem, i) in rechargeRecords.list" :key="i" @click.native="handleRechargeDetail(subItem)">
        <cell class="r-d-g" is-link>
          <div class="r-d-con1">
            <span class="con1-desc">充值金额</span>
            <span class="con1-desc">+￥{{subItem.income}}</span>
          </div>
          <div class="r-d-con1">
            <span class="con2-time">{{subItem.create_time}}</span>
            <span class="con2-status">{{subItem.title}}</span>
          </div>
        </cell>
      </group> -->
    <!-- </div> -->
    <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" style="overflow:initial">
      <div>
        <group v-for="(item, i) in list" :key="i" @click.native="handleRechargeDetail(item)">
          <cell class="r-d-g" is-link>
            <p class="r-d-con1">
              <span class="con1-desc">充值金额</span>
              <span class="con1-desc">+￥{{item.income}}</span>
            </p>
            <p class="r-d-con1">
              <span class="con2--time">{{item.create_time}}</span>
              <span class="con2-status">{{item.title}}</span>
            </p>
          </cell>
        </group>
        <load-more v-show="onFetching" tip="loading"></load-more>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Group, Cell, Toast, Scroller, LoadMore } from 'vux';
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, Mutation, namespace} from 'vuex-class';
const rechargeState = namespace('recharge', State);
const rechargeAction = namespace('recharge', Action);
const rechargeMutation = namespace('recharge', Mutation);
@Component({
  components: {
    Group,
    Cell,
    Toast,
    Scroller,
    LoadMore
  }
})
export default class rechargeDetailed extends Vue {
  @rechargeState rechargeRecords
  @rechargeAction getRechargeRecords
  @rechargeMutation initGetRechargeRecords
  list = []
  isLoading = true
  onFetching = false
  currentPage = 1
  onScrollBottom () {
    if (this.onFetching) {
      // do nothing
    } else {
      if (this.isLoading) {
        this.onFetching = true;
        setTimeout(() => {
          this.currentPage++;
          this.getInitData();
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.onFetching = false;
        }, 2000);
      }
    }
  }
  created () {
    this.getInitData();
  }
  getInitData () {
    const params = {
      'page': this.currentPage
    };
    this.getRechargeRecords(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      } else {
        if (this.rechargeRecords.list.length > 0) {
          this.list = this.list.concat(this.rechargeRecords.list);
        } else {
          this.isLoading = false;
          this.$vux.toast.text('暂无更多数据', 'middle');
        }
      }
    });
  }
  handleRechargeDetail (item) {
    console.log('item', item);
    this.$router.push({
      path: '/rechargeDetails'
    });
  }
}
</script>
<style lang="less">
  .recharge-detailed {
    font-size: 0.14rem;
    .xs-container {
      padding-bottom: 0.8rem;
    }
    .weui-cells:before {
      border: none !important;
    }
    .con2-time {
      color: #A6A6A6;
    }
    .con2-status {
      color: #B79E74;
    }
    .con1-desc {
      color: #3c3c3c;
    }
    .weui-cell_access .weui-cell__ft {
      width: 100%;
      padding-right: 0.2rem;
    }
    .r-d-con1 {
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.16rem;
    }
    .r-d-num {
      color: #000000;
    }
    .weui-cells {
      margin: 0!important;
    }
    .r-d-g {
      height: 0.5rem;
      padding: 0.1rem 0.15rem;
    }
    .r-d-top {
      height: 0.44rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 0.15rem;
      color: #3c3c3c;
    }
  }
</style>

