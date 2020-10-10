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
import { memberList, editDefaultMember } from '../../api';
import { Button, Content, RootContext, Toast } from '../../components';
import {
  fontColor,
  fontSize,
  primary,
  projectColor,
  smallfontSize,
  subColor,
  defaultBackground,
  borderLineColor,
} from '../../theme';

const PatientList = () => {
  const navigation = useNavigation();
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [listData, setListData] = useState();
  const isFocused = useIsFocused();
  const [isRefreshing, setRefreshing] = useState(false);
  const route = useRoute();

  /**
   * 设置默认地址
   * @param {*} param0
   */
  const setDefaultPatient = async (memberId, userId) => {
    const { result } = await editDefaultMember.fetch({
      userId: userId,
      memberId: memberId,
    });
    if (result === 'success') {
      listData.map((item) => {
        if (item.memberId === memberId) {
          item.isDefault = 1;
        } else {
          item.isDefault = 0;
        }
      });
      setListData([...listData]);
    }
  };

  /**
   * 设置默认就诊人组件
   * @param {*} param0
   */
  const defaultPatient = (isDefault, memberId, userId) => {
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
                setDefaultPatient(memberId, userId);
              }}
            />
            <Text style={styles.optPatient}>设置为默认就诊人</Text>
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
            <Text style={styles.optPatient}>默认就诊人</Text>
          </View>
        );

      default:
        break;
    }
  };

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
    const { result, data } = await memberList.fetch(userId);
    if (result === 'success') {
      setListData(data);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          route?.params?.navigateTo &&
            navigation.navigate(route?.params?.navigateTo, {
              itemInfo: item,
            });
        }}
      >
        <View style={styles.item}>
          <View style={styles.userView}>
            <Text style={styles.userInfo}>{item.memberName}</Text>
            <Text style={styles.userInfo}>
              {item.memberSex === '1' ? '男性' : '女性'}
            </Text>
            <Text style={styles.userInfo}>{item.credentialsNum}</Text>
          </View>

          <View style={[styles.directionRow]}>
            {defaultPatient(item.isDefault, item.memberId, item.userId)}
            <Button
              title={'编辑'}
              titleStyle={{ fontSize: smallfontSize, color: projectColor }}
              type="outline"
              buttonStyle={styles.editOptions}
              onPress={() => {
                navigation.navigate('EditPatient', {
                  name: item.memberName,
                  idCard: item.credentialsNum,
                  sex: item.memberSex,
                  isDefault: item.isDefault,
                  memberId: item.memberId,
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
          navigation.navigate('AddPatient');
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
            <Text style={styles.topText}>新增就诊人</Text>
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
    marginTop: 20,
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
    marginRight: 8,
  },

  optPatient: {
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

export default PatientList;
