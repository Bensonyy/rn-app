export const orderStatus = [
  {
    id: 0,
    name: '待付款',
    img: require('./img/ic_wait_pay.png'),
  },
  {
    id: 1,
    name: '待接单',
    img: require('./img/ic_wait_order_take.png'),
  },
  {
    id: 2,
    name: '服务中',
    img: require('./img/ic_service.png'),
  },
  {
    id: 3,
    name: '已完成',
    img: require('./img/ic_order_finish.png'),
  },
];

export const funItem = [
  {
    id: 0,
    name: '问诊订单',
    img: require('./img/ic_inquiry_order.png'),
  },
  {
    id: 1,
    name: '商城订单',
    img: require('./img/ic_mall_order.png'),
  },
  {
    id: 2,
    name: '地址管理',
    img: require('./img/ic_address.png'),
  },
  {
    id: 3,
    name: '就诊人管理',
    img: require('./img/ic_patient.png'),
  },
  {
    id: 4,
    name: '帮助中心',
    img: require('./img/ic_help.png'),
  },
];

//问诊订单-待接诊
export const inquiryOrderStep = [
  { name: '已付款' },
  { name: '待接诊' },
  { name: '接诊中' },
  { name: '已完成' },
];

//到家订单-待付款
export const waitPayStep = [
  { name: '待付款' },
  { name: '待接单' },
  { name: '待服务' },
  { name: '已完成' },
];

//到家订单-待接单
export const waitTakeStep = [
  { name: '已付款' },
  { name: '待接单' },
  { name: '待服务' },
  { name: '已完成' },
];

//到家订单-待服务
export const waitServiceStep = [
  { name: '已付款' },
  { name: '已接单' },
  { name: '待服务' },
  { name: '已完成' },
];

//到家订单-已完成
export const finishStep = [
  { name: '已付款' },
  { name: '已接单' },
  { name: '已服务' },
  { name: '已完成' },
];
