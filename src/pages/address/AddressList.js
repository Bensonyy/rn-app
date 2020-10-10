import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { addressList, editDefaultAddress } from '../../api';
import { Button, Content, RootContext, Toast } from '../../components';
import {
  fontColor,
  fontSize,
  primary,
  projectColor,
  smallfontSize,
  subColor,
  borderLineColor,
  defaultBackground,
} from '../../theme';

/**
 * 就诊人类别组件
 * @param {} param
 */
const Classify = ({ classify }) => {
  switch (classify) {
    case '01':
      return <Text style={styles.classify0}>本人</Text>;

    case '02':
      return <Text style={styles.classify1}>家属</Text>;

    case '03':
      return <Text style={styles.classify2}>其他</Text>;

    default:
      return <Text>其他</Text>;
  }
};

const AddressList = () => {
  const navigation = useNavigation();
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [listData, setListData] = useState();
  const isFocused = useIsFocused();
  const [isRefreshing, setRefreshing] = useState(false);
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
      },
    });
  }, [navigation]);

  /**
   * 一进来便获取用户id
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
   * 根据依赖变动请求数据
   */
  useEffect(() => {
    fetchData();
    return () => {};
  }, [userId, isFocused]);

  /**
   * 根据用户ID 查询就诊人列表
   * @param {*} param0
   */
  const fetchData = async () => {
    if (typeof userId === 'undefined' || userId === null || userId === '') {
      return;
    }
    setRefreshing(true);
    const { result, data } = await addressList.fetch(userId);
    if (result === 'success') {
      setListData(data);
    }
    setRefreshing(false);
  };

  /**
   * 设置默认地址
   * @param {*} param0
   */
  const setDefaultAddress = async (addressId, userId) => {
    const { result } = await editDefaultAddress.fetch({
      userId: userId,
      addressId: addressId,
    });
    if (result === 'success') {
      listData.map((item) => {
        if (item.addressId === addressId) {
          item.isDefault = 1;
        } else {
          item.isDefault = 0;
        }
      });
      setListData([...listData]);
    }
  };

  /**
   * 设置默认地址组件
   * @param {*} param0
   */
  const defaultAddress = (isDefault, addressId, userId) => {
    switch (isDefault) {
      case 0:
        return (
          <View style={styles.editView}>
            <Icon
              type={'feather'}
              name="circle"
              size={22}
              color={subColor}
              onPress={() => {
                setDefaultAddress(addressId, userId);
              }}
            />
            <Text style={styles.optAddress}>设置为默认地址</Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.editView}>
            <Icon
              type={'antDesign'}
              name="check-circle"
              size={24}
              color={primary}
            />
            <Text style={styles.optAddress}>默认地址</Text>
          </View>
        );

      default:
        break;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          route?.params?.navigateTo === 'SelectTime' &&
            navigation.navigate('SelectTime', {
              addressInfo: item,
            });
        }}
      >
        <View style={styles.item}>
          <View style={styles.userView}>
            <Classify classify={item.relation} />
            <Text style={styles.userInfo}>{item.linkName}</Text>
            <Text style={styles.userInfo}>{item.linkTel}</Text>
          </View>

          <Text
            style={styles.addressText}
          >{`${item.provinceName} ${item.cityName} ${item.countyName} ${item.streetAddress}`}</Text>

          <View style={[styles.directionRow]}>
            {defaultAddress(item.isDefault, item.addressId, item.userId)}
            <Button
              title={'编辑'}
              titleStyle={{ fontSize: smallfontSize, color: projectColor }}
              type="outline"
              buttonStyle={styles.editOptions}
              onPress={() => {
                navigation.navigate('EditAddress', {
                  linkName: item.linkName,
                  linkTel: item.linkTel,
                  streetAddress: item.streetAddress,
                  isDefault: item.isDefault,
                  provinceName: item.provinceName,
                  cityName: item.cityName,
                  countyName: item.countyName,
                  addressId: item.addressId,
                });
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Content type="full" isScroll={false} style={styles.container}>
      <View style={{ height: 10, backgroundColor: borderLineColor }} />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('AddAddress');
        }}
      >
        <View style={styles.top}>
          <View style={styles.addView}>
            <Icon
              type={'ionicons'}
              name="add-circle-outline"
              size={24}
              color={primary}
            />
            <Text style={styles.topText}>新增地址</Text>
          </View>
          <Icon
            type={'simple-line-icon'}
            name="arrow-right"
            size={18}
            color={subColor}
          />
        </View>
      </TouchableWithoutFeedback>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultBackground,
    flex: 1,
  },

  directionRow: {
    flexDirection: 'row',
  },

  top: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 58,
    marginBottom: 1,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },

  addView: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 1,
  },

  topText: {
    fontSize: fontSize,
    color: fontColor,
    marginLeft: 5,
  },

  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 1,
  },

  userView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userInfo: {
    fontSize: fontSize,
    color: fontColor,
    marginLeft: 10,
  },

  classify0: {
    height: 20,
    width: 36,
    fontSize: 14,
    textAlign: 'center',
    color: '#44A1EE',
    backgroundColor: '#EAF4FD',
    borderRadius: 4,
  },

  classify1: {
    height: 20,
    width: 36,
    fontSize: 14,
    textAlign: 'center',
    color: '#B2D34C',
    backgroundColor: '#F4F8E5',
    borderRadius: 4,
  },

  classify2: {
    height: 20,
    width: 36,
    fontSize: 14,
    textAlign: 'center',
    color: '#FAB02E',
    backgroundColor: '#FEF4E3',
    borderRadius: 4,
  },

  addressText: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: fontSize,
    color: subColor,
  },

  optAddress: {
    fontSize: fontSize,
    color: projectColor,
    marginLeft: 8,
  },

  editView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  editOptions: {
    height: 28,
    width: 60,
    backgroundColor: '#fff',
    borderColor: projectColor,
  },
});

export default AddressList;
