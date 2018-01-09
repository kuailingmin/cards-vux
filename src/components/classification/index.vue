<template>
  <div class="classification">
    <tab bar-active-color="transparent" class="tab" ref="topBar">
      <tab-item @on-item-click="">主题</tab-item>
      <tab-item @on-item-click="">对象</tab-item>
      <tab-item @on-item-click="">场合</tab-item>
      <tab-item @on-item-click="">排序</tab-item>
    </tab>
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
                <p class="title">{{item.name}}</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox align="center">
                  <p class="price">尊享价:￥{{item.price}}</p>
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
import {mapState, mapMutations, mapActions} from 'vuex'
import {Tab, TabItem, Flexbox, FlexboxItem, Grid, GridItem, LoadMore, XButton, XImg} from 'vux'
import {isBottom} from '../../js'
import Card from '../index/card'
import {page} from '../../mixin/page'
export default {
  name: 'Classification',
  mixins: [page],
  data () {
    return {
      showType: 'list',
      order: '',
      orderType: '',
      category: '',
      paddingTop: 0,
      imgWidth: screen.width / 2
    }
  },
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
    XImg
  },
  watch: {
    orderType () {
      this.resetList()
    }
  },
  computed: {
    ...mapState('products', {
      list: 'list',
      inited: 'inited'
    })
  },
  methods: {
    ...mapActions('products', {getProducts: 'getProducts'}),
    ...mapMutations('products', {resetList: 'resetList', setInit: 'setInit'})
  },
  created () {
    if (!this.inited) {
      this.getProducts({page: this.page, pageSize: this.pageSize}).then(() => {
        this.page++
        this.setInit(true)
      }).catch(error => console.log(error))
    }
  },
  mounted () {
    const rect = this.$refs.topBar.$el.getBoundingClientRect()
    this.paddingTop = rect.height + 16 + 'px'
    const element = document.querySelector('#vux_view_box_body')
    isBottom(element,
    () => {
      !this.isEnd && !this.loading && (() => {
        this.loading = true
        this.getProducts({page: this.page, pageSize: this.pageSize}).then(({isEnd}) => {
          this.loading = false
          this.isEnd = isEnd
          this.page++
          element.scrollTop -= (this.$refs.loadMore.$el.getBoundingClientRect().height + 10)
        }).catch(error => console.log(error))
      })()
    }
    )
  }
}
</script>
<style lang="less" scoped>
.classification{
    .top-bar{
        height:0.44rem;
        width:100%;
    }
    .title{
      font-size: 0.14rem;
      color: #3C3C3C;
      letter-spacing: -0.0034rem;
    }
    .image{
      display: flex;
      align-items: center;
    }
    .price{
      font-size: 0.14rem;
      color: #DF1C2E;
      letter-spacing: -0.0034rem;
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
