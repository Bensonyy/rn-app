//待问诊订单列表
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { getWaitInquiryList } from '../../../../api';
import {
  Button,
  Card,
  RootContext,
  Toast,
  EmptyView,
} from '../../../../components';
import {
  borderLineColor,
  primary,
  projectColor,
  smallfontSize,
  subfontSize,
  orderBackground,
} from '../../../../theme';
import ItemTop from './ItemTop';

const WaitInquiry = () => {
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [listData, setListData] = useState();
  const [isRefreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
      },
    });
  }, [navigation]);

  /**
   * 一进来便获取用户信息
   */
  useEffect(() => {
    const getLogin = async () => {
      const loginInfo = await getLoginInfo();
      if (loginInfo) {
        setUserId(loginInfo.userId);
      }
    };
    getLogin();
    return () => {};
  }, []);

  /**
   * 根据userId的变动请求数据
   */
  useEffect(() => {
    fetchData();
    return () => {};
  }, [userId]);

  /**
   * 根据用户ID 请求订单数据
   * @param {*} param0
   */
  const fetchData = async () => {
    if (typeof userId === 'undefined' || userId === null || userId === '') {
      return;
    }
    setRefreshing(true);
    const { result, data } = await getWaitInquiryList.fetch({
      userId: userId,
    });
    if (result === 'success') {
      setListData(data);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId}
        ListEmptyComponent={EmptyView({
          source: require('../../img/ic_inquiry_order_empty.png'),
        })}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            colors={[primary]}
            onRefresh={() => {
              fetchData();
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

export default WaitInquiry;

const Item = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('WaitInquiryDetail', {
          visitCode: item.visitCode,
        });
      }}
    >
      <Card containerStyle={styles.cardView}>
        <ItemTop itemData={item} />
        {/* <View style={styles.line} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 14,
            marginBottom: 6,
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Icon
              type={'antdesign'}
              name="clockcircleo"
              size={15}
              color={projectColor}
            />
            <Text
              style={{
                color: projectColor,
                fontSize: subfontSize,
                marginLeft: 5,
              }}
            >
              00:00/30:00
            </Text>
          </View>
          <Button
            title={'联系医生'}
            titleStyle={{ fontSize: smallfontSize, color: '#3385FF' }}
            type="outline"
            buttonStyle={styles.editOptions}
            onPress={() => {
              Toast({
                message: '此功能正在开发中',
              });
            }}
          />
        </View> */}
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: orderBackground,
  },
  cardView: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    elevation: 0,
  },
  line: {
    marginTop: 10,
    height: 1,
    backgroundColor: borderLineColor,
  },
  editOptions: {
    height: 30,
    width: 88,
    backgroundColor: '#fff',
    borderColor: '#3385FF',
  },
});
