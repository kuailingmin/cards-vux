import Vue from 'vue';
import Router from 'vue-router';
import store from '../vuex/store';
const Member = () => import('@/components/member/index');
const Index = () => import('@/components/index/index');
const Classification = () => import('@/components/classification/index');
const Cart = () => import('@/components/cart/index');
const IntentionList = () => import('@/components/intention/intentionList');
const Detail = () => import('@/components/detail/index');
const Container = () => import('@/container');
const ConfirmOrder = () => import('@/components/confirmOrder/index');
const OrderPaySuccess = () => import('@/components/pay/orderPaySuccess');
const SubmitSuccess = () => import('@/components/pay/submitSuccess');
const RechargeResults = () => import('@/components/pay/rechargeResults');
const Recharge = () => import('@/components/pay/recharge');
const RechargeDetailed = () => import('@/components/pay/rechargeDetailed');
const RechargeDetails = () => import('@/components/pay/rechargeDetails');
const AvailableBalance = () => import('@/components/pay/availableBalance');
const Help = () => import('@/components/help/index');
const Order = () => import('@/components/order/index');
const OrderDetail = () => import('@/components/order/detail');
const Delivery = () => import('@/components/order/delivery');
const Money = () => import('@/components/member/money');
const Login = () => import('@/components/member/login');
const Register = () => import('@/components/member/register');
const Intention = () => import('@/components/intention/index');
const IntentionDetail = () => import('@/components/intention/detail');
const IntentionSubmit = () => import('@/components/intention/submit');
const Address = () => import('@/components/address/index');
const AddAddress = () => import('@/components/address/add');
const Cardlist = () => import('@/components/cardlist/index');
const EditInfo = () => import('@/components/index/editInfo');
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/main',
      component: Container,
      children: [
        {path: '', name: '首页', component: Index},
        {path: 'member', name: '会员', component: Member},
        {path: 'classification', name: '分类', component: Classification},
        {path: 'cart', name: '购物车', component: Cart}
      ]
    },
    {
      path: '/mine',
      component: Container,
      children: [
        {path: '', name: '飞象卡券', component: Index},
        {path: 'classification', name: '分类', component: Classification},
        {path: 'intentionList', name: '意向单', component: IntentionList}
      ]
    },
    {path: '/', redirect: '/main', hidden: true},
    {path: '/cardlist', name: '卡券列表', component: Cardlist},
    {path: '/detail/:id', name: '实体卡', component: Detail},
    {path: '/confirmOrder', name: '确认订单', component: ConfirmOrder},
    {path: '/orderPaySuccess', name: '订单支付成功', component: OrderPaySuccess},
    {path: '/submitSuccess', name: '提交成功', component: SubmitSuccess},
    {path: '/rechargeResults', name: '充值结果', component: RechargeResults},
    {path: '/recharge', name: '充值', component: Recharge},
    {path: '/rechargeDetailed', name: '充值明细', component: RechargeDetailed},
    {path: '/rechargeDetails', name: '充值详情', component: RechargeDetails},
    {path: '/availableBalance', name: '可用余额', component: AvailableBalance},
    {path: '/help', name: '帮助中心', component: Help},
    {path: '/order', name: '我的订单', component: Order},
    {path: '/member/money', name: '现金账户', component: Money},
    {path: '/order/detail/:id', name: '订单详情', component: OrderDetail},
    {path: '/order/delivery/:id', name: '物流信息', component: Delivery},
    {path: '/intention', name: '意向单', component: Intention},
    {path: '/intention/detail/:id', name: '意向单详情', component: IntentionDetail},
    {path: '/intention/submit', name: '提交意向单', component: IntentionSubmit},
    {path: '/address', name: '地址管理', component: Address},
    {path: '/address/add', name: '添加新地址', component: AddAddress},
    {path: '/address/edit', name: '编辑地址', component: AddAddress},
    {path: '/login', name: '登录', component: Login},
    {path: '/register', name: '注册', component: Register},
    {path: '/editInfo', name: '信息修改', component: EditInfo}
  ],
  mode: 'hash',
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});
router.beforeEach((to, from, next) => {
  store.commit('global/setTitle', to.name);
  next();
});
export default router;
