//到家订单
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Dimensions } from 'react-native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import {
  primary,
  subColor,
  subfontSize,
  backgroundColor,
} from '../../../../theme';
import Finish from './Finish';
import Service from './Service';
import WaitOrderTake from './WaitOrderTake';
import Waitpay from './WaitPay';

const AllOrders = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0, //取消导航underLine
      },
    });
  }, [navigation]);

  return (
    <ScrollableTabView
      tabBarUnderlineStyle={{
        backgroundColor: backgroundColor,
      }}
      locked={true} //左右不能滑动切换
      tabBarActiveTextColor={primary}
      tabBarInactiveTextColor={subColor}
      tabBarTextStyle={{ fontSize: subfontSize }}
      renderTabBar={() => <DefaultTabBar />}
    >
      <Waitpay tabLabel="待付款" />
      <WaitOrderTake tabLabel="待接单" />
      <Service tabLabel="服务中" />
      <Finish tabLabel="已完成" />
    </ScrollableTabView>
  );
};

export default AllOrders;
