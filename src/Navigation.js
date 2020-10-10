import * as React from 'react';
import { Icon } from 'react-native-elements';
import { HeaderBackButton } from '@react-navigation/stack';
import { primary, fontColorHome } from './theme';

import Home from './pages/home/Home';
//import MyHome from './pages/my/Home';
import MyHome from './pages/my';
import HomeCare from './pages/homeCare';
import SelectTime from './pages/selectTime';
import OrderPage from './pages/orderPage';
import OnlineConsultation from './pages/onlineConsultation';

// h5
import WebviewDemo from './pages/webviewH5';
import H5demo from './pages/webviewH5/H5demo.js';
import MedicineShop from './pages/webviewH5/MedicineShop.js';
import BookingReg from './pages/webviewH5/BookingReg.js';

// stack
import Profile from './pages/profile';
import ImgConsult from './pages/onlineConsultation/imgConsult';
import PayMedicalRecord from './pages/onlineConsultation/PayMedicalRecord.js';
import Im from './pages/onlineConsultation/Im';
import VideoChat from './pages/videoChat';
import VideoList from './pages/videoList';
import SearchPage from './pages/search';
import Payment from './pages/payment';
import Map from './pages/map';
import VideoItem from './pages/videoList/VideoItem';

import AddressList from './pages/address/AddressList';
import AddAddress from './pages/address/AddAddress';
import EditAddress from './pages/address/EditAddress';
import PatientList from './pages/patient/PatientList';
import AddPatient from './pages/patient/AddPatient';
import EditPatient from './pages/patient/EditPatient';
import AllOrders from './pages/my/order/homeOrder/AllOrders';
import WaitPay from './pages/my/order/homeOrder/WaitPay';
import WaitPayDetail from './pages/my/order/homeOrder/WaitPayDetail';
import WaitOrderTake from './pages/my/order/homeOrder/WaitOrderTake';
import Service from './pages/my/order/homeOrder/Service';
import ServiceDetail from './pages/my/order/homeOrder/ServiceDetail';
import Finish from './pages/my/order/homeOrder/Finish';
import FinishDetail from './pages/my/order/homeOrder/FinishDetail';
import WaitOrderTakeDetail from './pages/my/order/homeOrder/WaitOrderTakeDetail';
import FocusOnList from './pages/my/FocusOnList';
import PathTrack from './pages/map/PathTrack';
import RecommendGroup from './pages/recommendGroup';
import MiddlePay from './pages/payment/MiddlePay';
import OnLineVideo from './pages/onlineConsultation/OnLineVideo';
import InquiryAllOrder from './pages/my/order/inquiryOrder/AllOrder';
import WaitInquiryDetail from './pages/my/order/inquiryOrder/WaitInquiryDetail';
import FinishInquiryDetail from './pages/my/order/inquiryOrder/FinishInquiryDetail';

export const tabBottomNavs = [
  {
    name: 'VideoChat',
    component: VideoChat,
    options: {
      tabBarLabel: '导诊',
      tabBarIcon: ({ size, color }) => (
        <Icon
          type={'material-community'}
          name="book-plus-multiple"
          size={size + 4}
          color={color}
        />
      ),
    },
  },
  {
    name: 'BookingReg',
    component: BookingReg,
    options: {
      tabBarLabel: '预约挂号',
      tabBarIcon: ({ size, color }) => (
        <Icon
          type={'material-community'}
          name="book-plus-multiple"
          size={size + 4}
          color={color}
        />
      ),
    },
  },
  {
    name: 'Home',
    component: Home,
    options: {
      tabBarLabel: '推荐',
      tabBarIcon: ({ size, color }) => (
        <Icon
          type={'material-community'}
          name="home"
          size={size}
          color={color}
        />
      ),
    },
  },
  {
    name: 'MedicineShop',
    component: MedicineShop,
    options: {
      tabBarLabel: '健康商城',
      tabBarIcon: ({ size, color }) => (
        <Icon
          type={'font-awesome-5'}
          name="briefcase-medical"
          size={size}
          color={color}
        />
      ),
    },
  },
  {
    name: 'MyHome',
    component: MyHome,
    options: {
      tabBarLabel: '我的',
      tabBarIcon: ({ size, color }) => (
        <Icon
          type={'material-community'}
          name="account"
          size={size}
          color={color}
        />
      ),
    },
  },
];

// auth 登录注册
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
export const authNavs = [
  {
    name: 'Login',
    component: Login,
    options: {
      title: '登录',
    },
  },
  {
    name: 'Register',
    component: Register,
    options: {
      title: '注册',
    },
  },
];

// 我的
export const myNavs = [
  {
    name: 'H5',
    component: H5demo,
    options: {
      title: '问卷调查',
    },
  },

  {
    name: 'AddressList',
    component: AddressList,
    options: {
      title: '地址管理',
    },
  },

  {
    name: 'PatientList',
    component: PatientList,
    options: {
      title: '就诊人档案管理',
    },
  },

  {
    name: 'FocusOnList',
    component: FocusOnList,
    options: {
      title: '我关注的医护团队',
    },
  },
];

export const stackNavs = [
  {
    name: 'HomeCare',
    component: HomeCare,
    options: {
      title: '医护到家',
      headerShown: false,
      headerBackImage: () => (
        <Icon type={'antdesign'} name="left" size={24} color={fontColorHome} />
      ),
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: fontColorHome,
      },
    },
  },
  {
    name: 'OnlineConsultation',
    component: OnlineConsultation,
    options: {
      title: '在线问诊',
      headerShown: false,
      headerBackImage: () => (
        <Icon type={'antdesign'} name="left" size={24} color={fontColorHome} />
      ),
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: fontColorHome,
      },
    },
  },
  {
    name: 'RecommendGroup',
    component: RecommendGroup,
    options: {
      title: '医护团队',
    },
  },
  {
    name: 'ImgConsult',
    component: ImgConsult,
    options: {
      title: '填写问诊信息',
    },
  },
  {
    name: 'PayMedicalRecord',
    component: PayMedicalRecord,
    options: {
      title: '问诊订单',
    },
  },
  {
    name: 'Im',
    component: Im,
    options: {
      title: '在线咨询',
    },
  },
  {
    name: 'Profile',
    component: Profile,
    options: {
      title: '医护团队详情页',
    },
  },
  {
    name: 'VideoList',
    component: VideoList,
    options: {
      title: '三亚',
    },
  },
  {
    name: 'SearchPage',
    component: SearchPage,
    options: {
      title: '搜索',
    },
  },
  {
    name: 'SelectTime',
    component: SelectTime,
    options: {
      title: '选择时间',
      headerShown: false,
      headerBackImage: () => (
        <Icon type={'antdesign'} name="left" size={24} color={fontColorHome} />
      ),
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: fontColorHome,
      },
    },
  },
  {
    name: 'OrderPage',
    component: OrderPage,
    options: {
      title: '订单信息',
      headerShown: false,
      headerBackImage: () => (
        <Icon type={'antdesign'} name="left" size={24} color={fontColorHome} />
      ),
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: fontColorHome,
      },
    },
  },
  {
    name: 'Payment',
    component: Payment,
    options: {
      title: '支付',
    },
  },
  {
    name: 'Map',
    component: Map,
    options: {
      title: '位置',
    },
  },
  {
    name: 'VideoItem',
    component: VideoItem,
    options: {
      title: '单个视频播放',
    },
  },
  {
    name: 'AddAddress',
    component: AddAddress,
    options: {
      title: '新增地址',
    },
  },

  {
    name: 'EditAddress',
    component: EditAddress,
    options: {
      title: '编辑地址',
    },
  },

  {
    name: 'AddPatient',
    component: AddPatient,
    options: {
      title: '新增就诊人',
    },
  },

  {
    name: 'EditPatient',
    component: EditPatient,
    options: {
      title: '编辑就诊人',
    },
  },

  {
    name: 'AllOrders',
    component: AllOrders,
    options: {
      title: '我的订单',
    },
  },

  {
    name: 'WaitPay',
    component: WaitPay,
    options: {
      title: '待付款订单',
    },
  },

  {
    name: 'WaitPayDetail',
    component: WaitPayDetail,
    options: {
      title: '待付款订单详情',
    },
  },

  {
    name: 'WaitOrderTake',
    component: WaitOrderTake,
    options: {
      title: '待接单订单',
    },
  },

  {
    name: 'WaitOrderTakeDetail',
    component: WaitOrderTakeDetail,
    options: {
      title: '待接单订单详情',
    },
  },

  {
    name: 'Service',
    component: Service,
    options: {
      title: '待服务订单',
    },
  },

  {
    name: 'ServiceDetail',
    component: ServiceDetail,
    options: {
      title: '待服务订单详情',
    },
  },

  {
    name: 'Finish',
    component: Finish,
    options: {
      title: '已完成订单',
    },
  },

  {
    name: 'FinishDetail',
    component: FinishDetail,
    options: {
      title: '已完成订单详情',
    },
  },

  {
    name: 'PathTrack',
    component: PathTrack,
    options: {
      title: '医护实时路线',
    },
  },
  {
    name: 'MiddlePay',
    component: MiddlePay,
    options: {
      title: '支付',
    },
  },
  {
    name: 'OnLineVideo',
    component: OnLineVideo,
    options: {
      title: '在线视频',
    },
  },

  {
    name: 'InquiryAllOrder',
    component: InquiryAllOrder,
    options: {
      title: '问诊订单',
    },
  },

  {
    name: 'WaitInquiryDetail',
    component: WaitInquiryDetail,
    options: {
      title: '待问诊订单详情',
    },
  },

  {
    name: 'FinishInquiryDetail',
    component: FinishInquiryDetail,
    options: {
      title: '已完成订单详情',
    },
  },
];

export default [...myNavs, ...authNavs, ...stackNavs];
