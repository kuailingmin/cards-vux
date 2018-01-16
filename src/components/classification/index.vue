<template>
  <div class="classification">
    <tab bar-active-color="transparent" class="tab" ref="topBar" v-if="$route.path==='/main/classification'">
      <tab-item @on-item-click="">主题</tab-item>
      <tab-item @on-item-click="">对象</tab-item>
      <tab-item @on-item-click="">场合</tab-item>
      <tab-item @on-item-click="">排序</tab-item>
    </tab>
    <cell v-else>
      <flexbox slot="title">
        <flexbox-item>全部</flexbox-item>
        <flexbox-item>销量</flexbox-item>
        <flexbox-item>价格</flexbox-item>
      </flexbox>
      <span class="app-icon"></span>
    </cell>
    <grid :cols="2" v-show="showType==='card'" :style="{paddingTop}">
      <grid-item v-for="item of list" :key="item.id">
        <card :item="item"></card>
      </grid-item>
    </grid>
    <flexbox orient="vertical" v-show="showType==='list'" :style="{paddingTop}">
      <flexbox-item v-for="item of list" :key="item.id" class="card">
        <flexbox align="center">
          <flexbox-item :span="0.4" class="image">
            <x-img :src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,jpg`" :webp-src="`${item.pic_url.split('?')[0]}?x-oss-process=image/resize,w_${imgWidth}/format,webp`" container="#vux_view_box_body"/>
          </flexbox-item>
          <flexbox-item>
            <flexbox orient="vertical" >
              <flexbox-item>
                <p class="text">{{item.name}}</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox align="center">
                  <p class="text red">尊享价:￥{{item.price}}</p>
                  <x-button mini>加入购物车</x-button>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <load-more tip="正在加载" v-show="loading" ref="loadMore"></load-more>   
  </div>    
</template>
<script>
import {State, Action, Mutation, namespace} from 'vuex-class';
import {Tab, TabItem, Flexbox, FlexboxItem, Grid, GridItem, LoadMore, XButton, XImg, Cell} from 'vux';
import {isBottom} from '../../js';
import Card from '../index/card';
import {page} from '../../mixin/page';
import {Component, Vue, Watch} from 'vue-property-decorator';
const ProductsState = namespace('products', State);
const ProductsAction = namespace('products', Action);
const ProductsMutation = namespace('products', Mutation);
@Component({
  mixins: [page],
  components: {
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    GridItem,
    Grid,
    LoadMore,
    Card,
    XButton,
    XImg,
    Cell
  }
})
export default class Classification extends Vue {
  showType='list'
  order=''
  orderType=''
  category=''
  paddingTop=0
  imgWidth= parseInt(screen.width / 2)

  @Watch('orderType')
  onOrderTypeChanged () {
    this.resetList();
  }

  @ProductsState list
  @ProductsState inited

  @ProductsAction getProducts
  @ProductsMutation resetList
  @ProductsMutation setInit

  created () {
    if (!this.inited) {
      this.getProducts({page: this.page, pageSize: this.pageSize}).then(msg => {
        msg && this.$vux.toast.text(msg);
        this.page++;
        this.setInit(true);
      }).catch(error => console.log(error));
    }
  }
  mounted () {
    const rect = this.$refs.topBar.$el.getBoundingClientRect();
    this.paddingTop = rect.height + 16 + 'px';
    const element = document.querySelector('#vux_view_box_body');
    isBottom(element,
      () => {
        !this.isEnd && !this.loading && (() => {
          this.loading = true;
          this.getProducts({page: this.page, pageSize: this.pageSize}).then(({isEnd}) => {
            this.loading = false;
            this.isEnd = isEnd;
            this.page++;
            element.scrollTop -= (this.$refs.loadMore.$el.getBoundingClientRect().height + 10);
          }).catch(error => console.log(error));
        })();
      }
    );
  }
};
</script>
<style lang="less" scoped>
.classification{
    .top-bar{
        height:0.44rem;
        width:100%;
    }
    .image{
      display: flex;
      align-items: center;
    }
    .card{
      background: #ffffff;
    }
    .tab{
      position: fixed;
      width: 100%;
    }
}
</style>