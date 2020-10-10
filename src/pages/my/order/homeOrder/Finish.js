//已完成的订单列表
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Modal,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {
  getUserFinishOrderList,
  getOnlyGroupInfoById,
  AddComment,
} from '../../../../api';
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
  smallfontSize,
  fontColor,
  subfontSize,
  subColor,
  smallColor,
  projectColor,
  orderBackground,
} from '../../../../theme';
import { Avatar, AirbnbRating } from 'react-native-elements';
import ItemTop from './ItemTop';

const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;

const Finish = () => {
  const navigation = useNavigation();
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [listData, setListData] = useState();
  const [isRefreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [groupInfo, setGroupInfo] = useState({});
  const [rating, setRating] = useState(1);
  //当前评价的订单id
  const [curOrderId, setCurOrderId] = useState();

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
    const { result, data } = await getUserFinishOrderList.fetch(userId);
    if (result === 'success') {
      setListData(data);
    }
    setRefreshing(false);
  };

  /**
   * 根据团队id查询对应的团队信息
   * @param {*} groupId
   */
  const getGroupInfo = async (groupId) => {
    if (typeof groupId === 'undefined' || groupId === null || groupId === '') {
      return;
    }
    const { result, data } = await getOnlyGroupInfoById.fetch(groupId);
    if (result === 'success') {
      setGroupInfo(data);
    }
  };

  /**
   * 提交评价
   */
  const addComment = async () => {
    const arr = [
      {
        content: inputValue,
        praseCount: 0,
        type: 'text',
      },
    ];

    const sendData = {
      bizId: groupInfo.groupId,
      extId: curOrderId, //订单id
      userId: userId,
      grade: rating,
      isOpen: 0,
      praseCount: 0,
      commentItemList: arr,
    };

    const { result } = await AddComment.fetch(sendData);
    if (result === 'success') {
      setModalVisible(false);
      Toast({
        message: '提交成功',
      });
      for (let item of listData) {
        if (item.orderId === curOrderId) {
          item.isComment = '1';
          break;
        }
      }
      setListData([...listData]);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('FinishDetail', {
            orderId: item.orderId,
          });
        }}
      >
        <Card containerStyle={styles.cardView}>
          <ItemTop itemData={item} />
          <View style={styles.line} />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 14,
              marginBottom: 6,
              justifyContent: 'flex-end',
            }}
          >
            {item.isComment === '1' ? (
              <View>
                <Text style={{ fontSize: subfontSize, color: subColor }}>
                  已评价
                </Text>
              </View>
            ) : (
              <Button
                title={'我要评价'}
                titleStyle={{ fontSize: smallfontSize, color: subColor }}
                type="outline"
                buttonStyle={styles.editOptions}
                onPress={() => {
                  setModalVisible(true);
                  getGroupInfo(item.provideId);
                  setCurOrderId(item.orderId);
                }}
              />
            )}
          </View>
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  /**
   * 弹窗
   */
  const modalView = () => {
    return (
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.title}>发表评价</Text>
              <Avatar
                rounded
                size={'medium'}
                source={{
                  uri: groupInfo.groupHead,
                }}
              />
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  color: subColor,
                  fontSize: smallfontSize,
                }}
              >
                {groupInfo.groupName}团队
              </Text>
              <AirbnbRating
                count={5}
                defaultRating={rating}
                showRating={false}
                size={26}
                onFinishRating={(index) => {
                  setRating(index);
                }}
              />
              <Experiencing ratingValue={rating} />
              <View style={styles.inputView}>
                <TextInput
                  style={[
                    { width: '100%', height: 140, textAlignVertical: 'top' },
                  ]}
                  placeholder={'填写其他意见和建议'}
                  placeholderTextColor={'#BEBEBE'}
                  value={inputValue}
                  maxLength={60}
                  multiline={true}
                  onChangeText={(intro) => setInputValue(intro)}
                />
                <Text style={{ color: '#BEBEBE', textAlign: 'right' }}>
                  请不要超过60个字
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      backgroundColor: '#D9D9D9',
                      borderBottomLeftRadius: 10,
                      color: projectColor,
                    },
                  ]}
                >
                  下次再评论
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  addComment();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      backgroundColor: '#FCC100',
                      borderBottomRightRadius: 10,
                      color: smallColor,
                    },
                  ]}
                >
                  提交评论
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        {modalView()}
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.orderId}
          ListEmptyComponent={EmptyView({
            source: require('../../img/ic_home_order_empty.png'),
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
      </View>
    </SafeAreaView>
  );
};

export default Finish;

const Experiencing = ({ ratingValue }) => {
  let text = '';
  switch (ratingValue) {
    case 1:
      text = '非常差的问诊体验';
      break;
    case 2:
      text = '很差的问诊体验';
      break;
    case 3:
      text = '一般的问诊体验';
      break;
    case 4:
      text = '很满意的问诊体验';
      break;
    case 5:
      text = '非常满意的问诊体验';
      break;
  }
  return (
    <Text
      style={{
        textAlign: 'center',
        marginTop: 10,
        fontSize: smallfontSize,
        color: '#FCC100',
      }}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
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
    borderColor: subColor,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    height: screenH - 260,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 16,
  },

  title: {
    fontSize: 20,
    color: fontColor,
    textAlign: 'center',
    width: screenW - 64,
    borderBottomColor: borderLineColor,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },

  inputView: {
    borderColor: borderLineColor,
    borderWidth: 1,
    width: screenW - 80,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },

  buttonText: {
    flex: 1,
    lineHeight: 44,
    height: 44,
    fontSize: subfontSize,
    textAlign: 'center',
  },
});
