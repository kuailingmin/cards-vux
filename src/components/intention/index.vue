<template>
    <div class="intention">
        <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" style="overflow:initial">
            <group gutter="0">
                <cell is-link v-for="(item, index) in dataList" :key="index" :link="`/intention/detail/${item.id}`">
                    <flexbox slot="title" align="center">
                        <flexbox-item :span="0.6" class="text">{{item.create_time}}</flexbox-item>
                        <flexbox-item class="text">{{item.name}}</flexbox-item>
                    </flexbox>
                    <flexbox v-show="item.is_read==='1'">
                        <div class="dot"></div>
                    </flexbox>
                </cell>
            </group>
            <load-more v-show="onFetching" tip="正在加载中"></load-more>
        </scroller>
    </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import {Flexbox, FlexboxItem, Group, Cell, Scroller, LoadMore, Toast} from 'vux';
import {State, Action, namespace} from 'vuex-class';
const IndexState = namespace('index', State);
const IndexAction = namespace('index', Action);
@Component({
  components: {Flexbox, FlexboxItem, Group, Cell, Scroller, LoadMore, Toast}
})
export default class Intention extends Vue {
    @IndexState intentionList
    @IndexAction initIntentionList
    currentPage = 1
    isLoading = true
    onFetching = false
    dataList = []
    onScrollBottom () {
      if (!this.onFetching && this.isLoading) {
        this.onFetching = true;
        setTimeout(() => {
          this.currentPage++;
          this.initial();
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.onFetching = false;
        }, 2000);
      }
    }
    created () {
      this.initial();
    }
    initial () {
      const params = {
        'page': this.currentPage
      };
      this.initIntentionList(params).then(msg => {
        if (msg) {
          this.$vux.toast.text(msg, 'middle');
        } else {
          if (this.intentionList.list.length > 0) {
            this.dataList = this.dataList.concat(this.intentionList.list);
          } else {
            this.isLoading = false;
            this.$vux.toast.text('暂无更多数据', 'middle');
          }
        }
      });
    }
}
</script>
<style lang="less">
.intention{
    font-size: 0.14rem;
    padding-bottom: 0.44rem;
    .text {
      margin-left: 0.3rem !important;
    }
    .weui-cell {
      height: 0.4rem;
    }
    .weui-cells {
        margin-bottom: 0.15rem !important;
    }
    .weui-loadmore {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 !important;
    }
    .dot{
        width:0.08rem;
        height:0.08rem;
        border-radius:50%;
        background: #F76868;
    }
}
</style>
