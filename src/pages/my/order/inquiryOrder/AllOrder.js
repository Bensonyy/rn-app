//问诊订单
import React, { useLayoutEffect } from 'react';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

import {
  primary,
  subColor,
  subfontSize,
  backgroundColor,
} from '../../../../theme';

import WaitInquiry from './WaitInquiry';
import FinishInquiry from './FinishInquiry';

const AllOrders = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
      },
    });
  }, [navigation]);

  return (
    <ScrollableTabView
      tabBarUnderlineStyle={{
        backgroundColor: backgroundColor,
      }}
      locked={true}
      tabBarActiveTextColor={primary}
      tabBarInactiveTextColor={subColor}
      tabBarTextStyle={{ fontSize: subfontSize }}
      renderTabBar={() => <DefaultTabBar />}
    >
      <WaitInquiry tabLabel="待接诊" />
      <FinishInquiry tabLabel="已完成" />
    </ScrollableTabView>
  );
};

export default AllOrders;
