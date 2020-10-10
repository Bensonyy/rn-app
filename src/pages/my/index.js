import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Content, RootContext, Toast, Card, Button } from '../../components';
import {
  primary,
  largeSize,
  fontSize,
  subColor,
  subfontSize,
  fontColor,
  smallfontSize,
  smallColor,
  projectColor,
  borderLineColor,
} from '../../theme';
import { Image, Icon } from 'react-native-elements';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { orderStatus, funItem } from './localData';
import { getCollectCount, userLogout } from '../../api';

const login = ({ navigation }) => {
  navigation.navigate('Login', {
    action: 'back',
  });
};

/**
 * 未登陆时的头部组件
 */
const LoginOutHeader = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={() => login({ navigation })}>
      <View style={styles.headView}>
        <Image
          source={require('./img/avatar/ic_avatar.png')}
          style={styles.avatar}
        />

        <View style={styles.headInfo}>
          <Text style={styles.loginInfo}>登陆/注册</Text>
          <Text style={[styles.loginDes, { marginTop: 10 }]}>
            点击登陆 享受更多优质服务
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

/**
 * 已登陆时的头部组件
 */
const LoginInHeader = ({
  userName,
  navigation,
  collectCount,
  userAvater,
  userId,
}) => {
  return (
    <View style={styles.headView}>
      <Image
        source={require('./img/avatar/ic_avatar.png')}
        style={styles.avatar}
      />

      <View style={styles.headInfo}>
        <Text style={styles.loginInfo}>{userName}</Text>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('FocusOnList', { userId });
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={styles.loginDes}>我的关注</Text>

            <Text style={{ fontSize: fontSize, color: smallColor }}>
              {collectCount}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

/**
 *FunItem
 * @param {*} param0
 */
const FunItem = ({ item }) => {
  return (
    <View style={styles.itemView}>
      <Image source={item.img} style={{ height: 28, width: 28 }} />
      <Text
        style={{
          fontSize: subfontSize,
          color: projectColor,
          flex: 1,
          marginLeft: 10,
        }}
      >
        {item.name}
      </Text>
      <Icon
        type={'simple-line-icon'}
        name="arrow-right"
        size={14}
        color={subColor}
      />
    </View>
  );
};

/**
 * 订单item
 * @param {*} param0
 */
const OrderItem = ({ item }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image style={{ width: 32, height: 32 }} source={item.img} />
      <Text
        style={{
          marginTop: 10,
          fontSize: smallfontSize,
          color: projectColor,
        }}
      >
        {item.name}
      </Text>
    </View>
  );
};

const MyPage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getLoginInfo } = useContext(RootContext);
  const { signOut } = useContext(RootContext);
  const [isLogin, setLogin] = useState(false);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userAvater, setUserAvater] = useState();
  const [collectCount, setCollectCount] = useState(0);
  const [token, setToken] = useState('');

  /**
   * 一进来便判断是否登录
   */
  useEffect(() => {
    const getLogin = async () => {
      const loginInfo = await getLoginInfo();
      if (loginInfo) {
        setLogin(true);
        setUserName(loginInfo.userPrimary?.userNickname);
        setUserId(loginInfo.userId);
        setUserAvater(loginInfo.userAvater);
        setToken(loginInfo.token);
      } else {
        setLogin(false);
      }
    };
    getLogin();
    return () => {};
  }, [isFocused]);

  /**
   * 获取关注数量
   */
  useEffect(() => {
    const fetchData = async () => {
      if (typeof userId === 'undefined' || userId === null || userId === '') {
        return;
      }
      const { result, data } = await getCollectCount.fetch(userId);
      if (result === 'success') {
        setCollectCount(data);
      }
    };
    fetchData();
    return () => {};
  }, [userId, isFocused]);

  const _toFunItem = (id) => {
    switch (id) {
      case 0:
        if (isLogin) {
          navigation.navigate('InquiryAllOrder');
          break;
        } else {
          Toast({
            message: '请先登录',
          });
        }
        break;

      case 1:
      case 4:
        Toast({
          message: '此功能正在开发中',
        });
        break;

      case 2:
        if (isLogin) {
          navigation.navigate('AddressList');
          break;
        } else {
          Toast({
            message: '请先登录',
          });
        }
        break;

      case 3:
        if (isLogin) {
          navigation.navigate('PatientList');
          break;
        } else {
          Toast({
            message: '请先登录',
          });
        }
        break;
    }
  };

  /**
   * 退出登录
   */
  const _logout = async () => {
    const { result } = await userLogout.fetch({
      token,
    });
    if (result === 'success') {
      signOut();
      Toast({
        message: '退出成功',
      });
      setLogin(false);
    }
  };

  const _toOrderList = (id) => {
    if (!isLogin) {
      Toast({
        message: '请先登录',
      });
      return;
    }

    switch (id) {
      case 0:
        navigation.navigate('WaitPay');
        break;

      case 1:
        navigation.navigate('WaitOrderTake');
        break;

      case 2:
        navigation.navigate('Service');
        break;

      case 3:
        navigation.navigate('Finish');
        break;
      default:
        break;
    }
  };

  return (
    <Content
      type="full"
      isScroll={true}
      showBg={true}
      isShowLeftBtn={false}
      bgImgStyle={styles.bgImgStyle}
    >
      <Text style={styles.tittle}>我的</Text>
      {isLogin ? (
        <LoginInHeader
          userName={userName}
          navigation={navigation}
          collectCount={collectCount}
          userAvater={userAvater}
          userId={userId}
        />
      ) : (
        <LoginOutHeader navigation={navigation} />
      )}
      <Card containerStyle={{ borderWidth: 0 }}>
        <View style={styles.cardTop}>
          <View style={styles.dot}></View>
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: fontSize,
              color: fontColor,
            }}
          >
            医护上门订单
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              if (isLogin) {
                navigation.navigate('AllOrders');
              } else {
                Toast({
                  message: '请先登录',
                });
              }
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                marginRight: -10,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: smallfontSize,
                  color: projectColor,
                  marginRight: 5,
                }}
              >
                所有订单
              </Text>
              <Icon
                type={'simple-line-icon'}
                name="arrow-right"
                size={14}
                color={projectColor}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {orderStatus.map((item, index) => (
            <TouchableWithoutFeedback
              key={index.toString()}
              onPress={() => {
                _toOrderList(item.id);
              }}
            >
              <View>
                <OrderItem item={item} />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        {isLogin ? (
          <View style={styles.noticeView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                type={'font-awesome'}
                name="volume-down"
                size={22}
                color={'#FCC100'}
              />
              <Text
                style={{
                  fontSize: smallfontSize,
                  color: fontColor,
                  marginLeft: 4,
                }}
              >
                最新医护订单动态
              </Text>
            </View>

            <Text
              style={{ fontSize: smallfontSize, color: subColor, marginTop: 8 }}
            >
              正在为您调度上门工作人员，请保持手机通畅…
            </Text>
          </View>
        ) : null}
      </Card>

      <View style={{ marginTop: 20 }}>
        {funItem.map((item, index) => (
          <TouchableWithoutFeedback
            key={index.toString()}
            onPress={() => _toFunItem(item.id)}
          >
            <View>
              <FunItem item={item} />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>

      {isLogin ? (
        <Button
          title={'退出登录'}
          buttonStyle={styles.buttonStyle}
          onPress={_logout}
        />
      ) : null}
    </Content>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  tittle: {
    fontSize: fontSize,
    textAlign: 'center',
    color: smallColor,
    marginTop: -150,
  },

  headView: {
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 12,
    flexDirection: 'row',
  },

  avatar: {
    width: 74,
    height: 74,
  },

  headInfo: {
    marginLeft: 10,
    height: 60,
    justifyContent: 'center',
  },

  loginInfo: {
    fontSize: largeSize,
    color: smallColor,
  },

  loginDes: {
    fontSize: smallfontSize,
    color: smallColor,
    marginRight: 8,
  },
  cardTop: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemView: {
    flexDirection: 'row',
    height: 58,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: borderLineColor,
  },

  dot: {
    backgroundColor: primary,
    borderRadius: 50,
    height: 8,
    width: 8,
  },

  bgImgStyle: {
    height: 184,
  },

  noticeView: {
    marginTop: 14,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderStyle: 'solid',
    borderColor: borderLineColor,
    borderTopWidth: 1,
  },

  buttonStyle: {
    height: 44,
    marginTop: 60,
    marginBottom: 32,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: primary,
  },
});
