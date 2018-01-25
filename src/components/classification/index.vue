<template>
  <div class="classification">
    <tab bar-active-color="transparent" class="tab" ref="topBar">
      <tab-item :selected="index===0?true:false" v-for="(item, index) in tabsList" :key="index" @on-item-click="handleClickTabs(index)">{{item.title}}<span :class="index===isActive?'active':''" class="app-icon">&#xe611;</span></tab-item>
      <div class="drop-down-box" v-show="isShowBox">
        <div v-if="isActive!==3" class="drop-t">
          <div @click="handleSelectCon(index, item)" :class="item.checked===1?'active1':''" class="con-box" v-for="(item, index) in categoryData[isActive].children" :key="index">{{item.name}}</div>
        </div>
        <div v-else class="drop-t">
          <div @click="handleSelectCon(index, item)" :class="index===isActive1?'active1':''" class="order-by" v-for="(item, index) in orderByList" :key="index">{{item.title}}</div>
        </div>
        <div class="drop-b">
          <span class="drop-b-l" @click="handleReset">重 置</span>
          <span class="drop-b-r" @click="handleSearch">确 定</span>
        </div>
      </div>
    </tab>
    <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" style="overflow:initial">
    <div class="card-list-wrap">
      <div @click="handleClickToDetail(item.id)" class="card-list" v-for="(item, index) in dataList" :key="index">
        <div class="card-list-img"><img :src="item.pic_url" alt=""></div>
        <div class="card-list-title">{{item.name}}</div>
        <div class="card-list-price">尊享价:￥ {{item.price}}</div>
        <div class="card-list-btn"><x-button mini @click.native.stop="handleAddCart(item)">加入购物车</x-button></div>
      </div>
    </div>
    <load-more v-show="onFetching" tip="正在加载中"></load-more>
    </scroller>
    <div v-show="isShowBox" class="msk-box"></div>
  </div>
</template>
<script>
import {State, Action, Mutation, namespace} from 'vuex-class';
import {Tab, TabItem, XButton, Toast, Scroller, LoadMore} from 'vux';
import {Component, Vue} from 'vue-property-decorator';
const ProductsState = namespace('products', State);
const ProductsAction = namespace('products', Action);
const ProductsMutation = namespace('products', Mutation);
const GlobalState = namespace('global', State);
const CartAction = namespace('cart', Action);
@Component({
  components: {
    Tab,
    TabItem,
    XButton,
    Toast,
    Scroller,
    LoadMore
  }
})
export default class Classification extends Vue {
  @ProductsState initData
  @ProductsState tempData
  @ProductsState categoryData
  @ProductsAction init
  @ProductsAction initCategoryData
  @ProductsMutation getInitData
  @GlobalState storeId
  @CartAction addReduce
  itemList = []
  currentPage = 1
  isShowBox = false
  isActive = 0
  isActive1 = 0
  orderBy = 1
  orderByType = 1
  intentionData = []
  flag = true
  isLoading = true
  onFetching = false
  dataList = []
  orderByList = [
    {title: '默认排序', orderType: '1'},
    {title: '销量从高到低', orderType: '2'},
    {title: '价格从高到低', orderType: '1'},
    {title: '价格从低到高', orderType: '2'}
  ]
  tabsList = [
    {title: '主题'},
    {title: '对象'},
    {title: '场合'},
    {title: '排序'}
  ]
  handleClickToDetail (id) {
    this.$router.push(`/detail/${id}`);
  }
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
  handleAddCart (item) {
    if (/mine/.test(this.$route.path)) {
      if (this.intentionData.indexOf(item) === -1) {
        this.intentionData.push(item);
        this.tempData.push({
          'id': item.id,
          'num': 1,
          'is_selected': 1
        });
        this.$vux.toast.text('加入购物车成功', 'middle');
      }
    }
    if (/main/.test(this.$route.path)) {
      if (this.flag) {
        const params = {
          'shop_id': item.id
        };
        this.addReduce(params).then(msg => {
          if (msg) {
            this.$vux.toast.text(msg, 'middle');
          } else {
            this.$vux.toast.text('加入购物车成功', 'middle');
          }
        });
        this.flag = false;
        let timer = setTimeout(() => {
          this.flag = true;
          clearTimeout(timer);
        }, 1000);
      } else {
        this.$vux.toast.text('您的操作过于频繁', 'middle');
      }
    }
  }
  handleSearch () {
    this.isShowBox = false;
    this.currentPage = 1;
    this.isLoading = true;
    this.onFetching = false;
    this.dataList = [];
    this.initial();
  }
  handleReset () {
    if (this.isActive !== 3) {
      this.categoryData[this.isActive].children.forEach(item => {
        item.checked = 0;
      });
    }
    this.itemList = [];
  }
  handleSelectCon (n, item) {
    item.checked === 0 ? item.checked = 1 : item.checked = 0;
    this.isActive1 = n;
    if (this.isActive === 3) {
      if (n === 0) {
        this.orderByType = 1;
      } else if (n === 1) {
        this.orderByType = 2;
      } else if (n === 2) {
        this.orderByType = 3;
      } else {
        this.orderByType = 3;
      }
      this.orderBy = item.orderType;
    } else {
      this.itemList.push(item.id);
    }
  }
  handleClickTabs (n) {
    this.itemList = [];
    this.isActive1 = 0;
    this.isActive = n;
    this.isShowBox = true;
  }
  activated () {
    this.intentionData = [];
    this.initial();
    const params = {};
    this.initCategoryData(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
  }
  initial () {
    const params = {
      'store_id': this.storeId,
      'page': this.currentPage,
      'page_size': 8,
      'category_id': this.itemList.join(','),
      'order_by_type': this.orderByType,
      'order_by': this.orderBy
    };
    this.init(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      } else {
        if (this.initData.list.length > 0) {
          this.dataList = this.dataList.concat(this.initData.list);
        } else {
          this.isLoading = false;
          this.$vux.toast.text('暂无更多数据', 'middle');
        }
      }
    });
  }
}
</script>
<style lang="less" scoped>
.classification{
  width: 100%;
  padding-bottom: 0.44rem;
  .weui-loadmore {
    height: 0.44rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
  }
  .order-by {
    height: 0.44rem;
    padding-left: 0.2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #F6F6F6;
  }
  .vux-tab {
    z-index: 993;
  }
  .weui-btn_mini {
    padding: 0 !important;
  }
  .msk-box {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    opacity: 0.7;
    background: #000000;
    z-index: 991;
  }
  .con-box {
    height: 0.44rem;
    width: 50%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #F6F6F6;
  }
  .drop-t {
    height: 1.35rem;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .drop-b {
    display: flex;
    box-sizing: border-box;
  }
  .drop-b-l, .drop-b-r {
    height: 0.44rem;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drop-b-r {
    background: #B79E74;
    color: #ffffff;
  }
  .drop-down-box {
    background: #ffffff;
    position: absolute;
    width: 100%;
    top: 0.44rem;
    left: 0;
    border-bottom: 1px solid #F6F6F6;
    box-sizing: border-box;
  }
  .active {
    color: #B79E74 !important;
  }
  .active1 {
    color: #B79E74 !important;
    border-bottom: 1px solid #B79E74 !important;
  }
  .app-icon {
    font-size: 0.15rem;
    color: #3c3c3c;
    margin-left: 0.05rem;
  }
  .tab{
    position: fixed;
    width: 100%;
  }
  button.weui-btn, input.weui-btn {
    width: 1.1rem !important;
  }
  .card-list-wrap {
    padding-top: 0.46rem;
  }
  .card-list {
    margin-left: 2px;
    margin-top: 2px;
    float: left;
    width: 49%;
    background: #ffffff;
  }
  .card-list div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-list-img {
    height: 1.8rem;
  }
  .card-list-title {
    height: 0.35rem;
    color: #3C3C3C;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    padding: 0 5px;
    line-height: 0.18rem;
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .card-list-price {
    height: 0.25rem;
    font-size: 0.14rem;
    font-weight: bolder;
    color: #C61A2A;
  }
  .card-list-btn {
    height: 0.5rem;
  }
  .card-list-img img {
    width: 95%;
    border: none;
  }
}
</style>