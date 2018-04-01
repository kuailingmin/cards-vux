<template>
  <div class="classification-index">
    <tab bar-active-color="transparent" class="tab" ref="topBar">
      <tab-item  :selected="index===0?true:false" v-for="(item, index) in tabsList" :key="index" @on-item-click="handleClickTabs(index)">
        <span class="title-bold" :style="{'color':index===isActive ? setColor :''}">{{item.title}}</span>
        <span :class="{'active':index===isActive&&isShowBox}" :style="{'color':index===isActive ? setColor :''}" class="app-icon">&#xe611;</span>
      </tab-item>
      <div class="drop-down-box" v-show="isShowBox">
        <div v-if="isActive!==3" class="drop-t">
          <div @click="handleSelectCon(index, item)" :style="{'color':item.checked===1?setColor:''}"  class="con-box" v-for="(item, index) in categoryData[isActive].children" :key="index">{{item.name}}</div>
        </div>
        <div v-else class="drop-t">
          <div @click="handleSelectCon(index, item)" :style="{'color':index===isActive1?setColor:''}"  class="order-by" v-for="(item, index) in orderByList" :key="index">{{item.title}}</div>
        </div>
        <div class="drop-b">
          <span class="drop-b-l" @click="handleReset">重 置</span>
          <span class="drop-b-r" @click="handleSearch" :style="{'background-color':setColor}">确 定</span>
        </div>
      </div>
    </tab>
    <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" style="overflow:initial">
      <div class="my-scorller">
        <div class="card-list-wrap">
          <div @click="$router.push('/detail/' + item.id)" class="card-list" v-for="(item, index) in dataList" :key="index">
            <div class="card-list-img"><img :src="item.pic_url" alt=""></div>
            <div class="card-list-title">{{item.name}}</div>
            <div class="card-list-price">尊享价:￥{{item.price}}</div>
            <div class="card-list-btn"><x-button mini @click.native.stop="handleAddCart(item)"  :style="{'background-color':setColor}">加入购物车</x-button></div>
          </div>
        </div>
        <load-more v-show="onFetching" tip="正在加载中"></load-more>
      </div>
    </scroller>
    <div @click="handleClickStopEvent($event)" v-show="isShowBox" class="msk-box"></div>
  </div>
</template>
<script>
import {State, Action, namespace} from 'vuex-class';
import {Tab, TabItem, XButton, Toast, Scroller, LoadMore} from 'vux';
import {Component, Vue} from 'vue-property-decorator';
const ProductsState = namespace('products', State);
const ProductsAction = namespace('products', Action);
const CartAction = namespace('cart', Action);
@Component({
  components: {Tab, TabItem, XButton, Toast, Scroller, LoadMore}
})
export default class Classification extends Vue {
  @ProductsState initData
  @ProductsState categoryData
  @ProductsAction init
  @ProductsAction initCategoryData
  @CartAction addReduce
  currentPage = 1
  isShowBox = false
  isActive = 0
  isActive1 = 0
  orderBy = 1
  orderByType = 1
  flag = true
  isLoading = true
  onFetching = false
  setColor = localStorage.getItem('setColor') + ' !important'
  dataList = []
  tempData = JSON.parse(localStorage.getItem('tempData') || '[]')
  showEdit = localStorage.getItem('showEdit')
  idList = []
  orderByList = [
    {title: '默认排序', orderType: '1'},
    {title: '销量从高到低', orderType: '1'},
    {title: '价格从高到低', orderType: '1'},
    {title: '价格从低到高', orderType: '2'}
  ]
  tabsList = [
    {title: '主题'},
    {title: '对象'},
    {title: '场合'},
    {title: '排序'}
  ]
  handleClickStopEvent (e) {
    this.isShowBox = !this.isShowBox;
    e.stopPropagation();
  }
  onScrollBottom () {
    if (this.onFetching) {
    } else {
      this.onFetching = true;
      setTimeout(() => {
        this.currentPage++;
        this.initial();
        this.onFetching = false;
      }, 2000);
    }
  }
  handleAddCart (item) {
    if (this.showEdit === '1') {
      let bStop = true;
      this.tempData.forEach(project => {
        if (project.id === item.id) {
          bStop = false;
        }
      });
      if (bStop) {
        this.tempData.push({
          'id': item.id,
          'num': 1,
          'is_selected': 1
        });
        localStorage.setItem('tempData', JSON.stringify(this.tempData));
      }
      this.$vux.toast.text('加入购物车成功', 'middle');
      let arr = JSON.parse(localStorage.getItem('tempData'));
      if (arr && arr.length > 0) {
        this.$store.commit('index/cartNum', arr.length + '');
      }
    } else {
      if (localStorage.getItem('token') === '') {
        this.$router.push('/login');
      } else {
        if (this.flag) {
          const params = {
            'shop_id': item.id
          };
          this.addReduce(params).then(msg => {
            if (msg) {
              this.$vux.toast.text(msg, 'middle');
            } else {
              this.$vux.toast.text('加入购物车成功', 'middle');
              this.$bus.emit('addToCart', 'ok');
            }
          });
          this.flag = false;
          let timer = setTimeout(() => {
            this.flag = true;
            clearTimeout(timer);
          }, 500);
        } else {
          this.$vux.toast.text('您的操作过于频繁', 'middle');
        }
      }
    }
  }
  handleSearch () {
    this.isShowBox = false;
    this.currentPage = 1;
    this.isLoading = true;
    this.onFetching = false;
    this.idList = [];
    if (this.isActive !== 3) {
      this.categoryData[this.isActive].children.forEach(item => {
        if (item.checked === 1) {
          this.idList.push(item.id);
        }
      });
    }
    this.dataList = [];
    this.initial();
  }
  handleReset () {
    if (this.isActive !== 3) {
      this.categoryData[this.isActive].children.forEach(item => {
        item.checked = 0;
      });
    } else {
      this.isActive1 = 0;
    }
    this.idList = [];
  }
  handleSelectCon (n, item) {
    item.checked === 0 ? item.checked = 1 : item.checked = 0;
    this.isActive1 = n;
    if (this.isActive === 3) {
      n === 3 ? this.orderByType = 3 : this.orderByType = n + 1;
      this.orderBy = item.orderType;
    }
  }
  handleClickTabs (n) {
    this.isActive = n;
    this.isShowBox = !this.isShowBox;
  }
  created () {
    this.initial();
    const params = {
      'store_id': localStorage.getItem('store_id') || ''
    };
    this.initCategoryData(params).then(msg => {
      if (msg) {
        this.$vux.toast.text(msg, 'middle');
      }
    });
  }
  initial () {
    const params = {
      'store_id': localStorage.getItem('store_id') || '',
      'page': this.currentPage,
      'page_size': 8,
      'category_id': this.idList.join(','),
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
<style lang="less">
.classification-index {
  width: 100%;
  .title-bold {
    font-weight: bold;
    color: #a6a6a6;
  }
  .my-scorller {
    padding-bottom: 0.55rem;
    padding-top: 0.46rem;
  }
  .xs-container {
    float: left;
  }
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
    position: relative;
  }
  .order-by:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #F6F6F6;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .vux-tab {
    z-index: 993;
  }
  .weui-btn_mini {
    padding: 0 !important;
    font-size: 0.12rem !important;
  }
  .weui-btn {
    font-weight: bold;
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
    position: relative;
  }
  .con-box:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #F6F6F6;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .drop-t {
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
    top: 0.4rem;
    left: 0;
    box-sizing: border-box;
    z-index: 992;
  }
  .vux-tab-selected .title-bold {
    color: #B79E74 !important;
  }
  .vux-tab-selected .app-icon {
    color: #B79E74 !important;
  }
  .active {
    color: #B79E74 !important;
    transform: rotate(180deg) !important;
    -ms-transform:rotate(180deg) !important;
    -webkit-transform:rotate(180deg) !important;
    -o-transform:rotate(180deg) !important;
    -moz-transform:rotate(180deg) !important;
  }
  .active1 {
    position: relative;
    color: #B79E74;
  }
  .app-icon {
    display: inline-block;
    font-size: 0.15rem;
    color: #a6a6a6;
    margin-left: 0.05rem;
    transition: transform 0.5s;
    transform: rotate(0deg);
    -ms-transform:rotate(0deg);
    -webkit-transform:rotate(0deg);
    -o-transform:rotate(0deg);
    -moz-transform:rotate(0deg);
  }
  .tab{
    position: fixed;
    width: 100%;
  }
  button.weui-btn, input.weui-btn {
    width: 1.1rem !important;
  }
  .card-list-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-left: 0.07rem;
    padding-right: 0.07rem;
  }
  .card-list {
    margin-top: 0.07rem;
    width: 49%;
    background: #ffffff;
    box-shadow: 0 0 0.1rem 0 rgba(0,0,0,0.05);
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
    padding: 0 0.05rem;
    line-height: 0.18rem;
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .card-list-price {
    height: 0.25rem;
    font-size: 0.14rem;
    font-weight: bold;
    color: #C61A2A;
  }
  .card-list-btn {
    height: 0.5rem;
  }
  .card-list-img img {
    width: 94%;
    border: none;
  }
}
</style>