<template>
  <div class="scroller">
    <a class="list-top">
        <label class="text bold">{{list.title}}</label>
        <span class="app-icon" @click="handleClickCardList(list)">&#xe61e;</span>
    </a>
    <div class="scroll-x">
      <flexbox align="center" class="container">
        <flexbox-item v-for="(item, index) in list.card_list" :key="index" span="154">
          <card :item="item" @click.native="$router.push(`/detail/${item.shop_id}`)"></card>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import { Scroller, Flexbox, FlexboxItem } from 'vux';
import Card from './card';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  components: { Scroller, Card, Flexbox, FlexboxItem }
})
export default class LScroller extends Vue {
  @Prop([Object])
  list;
  handleClickCardList (item) {
    localStorage.setItem('cardId', item.id);
    this.$router.push('/cardList');
  }
}
</script>
<style lang="less" scoped>
.scroller {
  height: 2.8rem;
  .vux-flexbox-item {
    flex: 0 0 1.5rem !important;
  }
  .app-icon {
    color: #ffffff;
    margin: 0 !important;
    font-size: 0.14rem;
  }
  .scroll-x {
    width: 100%;
    overflow-x: scroll;
    .container {
      padding: 0 0.08rem;
    }
  }
  .list-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.44rem;
    color: #fff;
    padding: 0 0.08rem;
  }
}
</style>
