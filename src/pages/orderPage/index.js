import React, { useEffect, useState } from 'react';
import { Content, Card, BottomComponents, Toast } from '../../components';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, Divider, Button, CheckBox, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  fontSize,
  fontColor,
  borderLineColor,
  subColor,
  subfontSize,
  projectColor,
  backgroundColor,
  primary,
  tagSize,
  placeholderColor,
} from '../../theme';
import { orderInfo, wxPay, aliPay } from '../../api';
import * as WeChat from 'react-native-wechat';
import Alipay from '@uiw/react-native-alipay';
import { wxAppID } from '../../config';
const OrderPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = route?.params?.orderId;
  const [orderResult, setOrderResult] = useState({});
  const [selectIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const radioData = {
    radioGroup: [
      { index: 0, name: '微信支付', icon: require('./img/WeChat.png') },
      { index: 1, name: '支付宝支付', icon: require('./img/alipay.png') },
    ],
  };
  const onPay = () => {
    switch (selectIndex) {
      case 0:
        _wxPay();
        break;

      case 1:
        _aliPay();
        break;

      default:
        //其他支付
        break;
    }
  };
  /**
   * 微信支付
   */
  const _wxPay = async () => {
    const wxInstallState = await WeChat.isWXAppInstalled();
    if (!wxInstallState) {
      Toast({
        message: '请安装微信客户端',
      });
      return;
    }
    setIsLoading(true);
    const { result, data, message } = await wxPay.fetch({
      orderid: orderId,
      appid: wxAppID,
      pay_name: '支付测试',
      actual_amount: 1,
    });
    if (result === 'success') {
      try {
        const { errCode, errStr } = await WeChat.pay({
          partnerId: data.partnerid, // 商家向财付通申请的商家id
          prepayId: data.prepayid, // 预支付订单
          nonceStr: data.noncestr, // 随机串，防重发
          timeStamp: data.timestamp, // 时间戳，防重发
          package: data.package, // 商家根据财付通文档填写的数据和签名
          sign: data.sign, // 商家根据微信开放平台文档对数据做的签名
        });
        if (errCode === 0) {
          navigation.navigate('MyHome');
        } else {
          Toast({
            message: errStr,
          });
          console.log(errStr);
        }
      } catch (e) {
        Toast({
          message: '微信支付失败',
        });
        console.log('微信支付失败');
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Toast({
        message: message || `接口失败:${wxPay.url}`,
      });
    }
  };
  /**
   * 支付宝支付
   */
  const _aliPay = async () => {
    setIsLoading(true);
    const { result, data, message } = await aliPay.fetch({
      orderid: orderId,
      pay_name: '支付测试',
      actual_amount: 1,
    });
    if (result === 'success') {
      const res = await Alipay.alipay(data.body);
      const { memo, result, resultStatus } = res;
      if (resultStatus === '9000') {
        navigation.navigate('MyHome');
      } else {
        Toast({
          message: memo,
        });
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Toast({
        message: message || `接口失败:${wxPay.url}`,
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await orderInfo.fetch(orderId);
      console.log(result, '啥几把玩意');
      if (result === 'success') {
        console.log(data, '???????????????????');
        setOrderResult(data);
      }
    };
    fetchData();
  }, [orderId]);
  return (
    <Content type="full" showBg={true}>
      <Card
        containerStyle={{
          marginTop: -40,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>订单信息</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                type={'antdesign'}
                name="questioncircle"
                size={14}
                color={'#c8e07f'}
              />
              <Text style={{ paddingHorizontal: 10 }}>医护上门须知</Text>
            </View>
          </View>
          <Divider style={[styles.line]} />
          <View>
            <Text style={styles.groupLabel}>
              订单编号：
              <Text style={styles.groupName}>{orderResult?.orderNum}</Text>
            </Text>
            <Text style={styles.groupLabel}>
              下单时间：
              <Text style={styles.groupName}>{orderResult?.createDate}</Text>
            </Text>
          </View>
        </View>
      </Card>
      <Card
        containerStyle={{
          marginTop: 15,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>医护团队信息</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            ></View>
          </View>
          <Divider style={[styles.line]} />
          <View>
            <Text style={styles.groupLabel}>
              医护团队：
              <Text style={styles.groupName}>
                {orderResult?.groupInfo?.groupName}
              </Text>
            </Text>
            <Text style={styles.groupLabel}>
              服务项目：
              <Text style={styles.groupName}>{orderResult?.projectName}</Text>
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text style={styles.groupLabel}>上门时间：</Text>
              <Text
                style={[styles.groupName, { flex: 1 }]}
              >{`${orderResult?.orderDate?.slice(0, 10)}  ${
                orderResult?.orderTime
              }`}</Text>
            </View>
            <Text style={styles.groupLabel}>
              联系方式：
              <Text
                style={styles.groupName}
              >{`${orderResult?.linkName} ${orderResult?.linkTel}`}</Text>
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text style={styles.groupLabel}>上门地址：</Text>
              <Text style={[styles.groupName, { flex: 1 }]}>
                {`${orderResult?.provinceName}${orderResult?.cityName}${orderResult?.countyName} ${orderResult?.userAddr}`}
              </Text>
            </View>
          </View>
          <Divider style={[styles.line]} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Text style={styles.fontStyle}>
              订单金额：
              <Text style={{ fontSize, color: 'red' }}>
                {orderResult?.orderCost / 100} 元
              </Text>
            </Text>
          </View>
        </View>
      </Card>
      <Card
        containerStyle={{
          marginTop: 15,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>就诊人信息</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            ></View>
          </View>
          <Divider style={[styles.line]} />
          <View>
            <Text style={styles.groupLabel}>
              就诊人：
              <Text style={styles.groupName}>{orderResult?.userName}</Text>
            </Text>
            <Text style={styles.groupLabel}>
              性别：
              <Text style={styles.groupName}>
                {orderResult?.userSex == '1' ? '男' : '女'}
              </Text>
            </Text>
            <Text style={styles.groupLabel}>
              身份证号码：
              <Text style={styles.groupName}>
                {orderResult?.credentialsNum}
              </Text>
            </Text>
          </View>
        </View>
      </Card>
      <Card
        containerStyle={{
          marginTop: 15,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>支付方式</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            ></View>
          </View>
          <Divider style={[styles.line]} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {radioData?.radioGroup?.map((item, index) => {
              return (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={item.icon}
                    style={{ width: 44, height: 44, flex: 1, marginRight: 8 }}
                  />
                  <View style={{ flex: 3 }}>
                    <Text>{item.name}</Text>
                    <Text>银行卡/信用卡都可使用</Text>
                  </View>
                  <CheckBox
                    center
                    title=""
                    iconRight
                    textStyle={{
                      fontSize: 16,
                      color: subColor,
                      fontWeight: 'normal',
                      marginLeft: 0,
                    }}
                    containerStyle={{
                      backgroundColor: backgroundColor,
                      borderColor: 'transparent',
                      padding: 0,
                      marginLeft: 0,
                      flex: 1,
                    }}
                    size={24}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor="#4DD756"
                    checked={selectIndex === item.index ? true : false}
                    onPress={() => {
                      setSelectedIndex(index);
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </Card>
      <BottomComponents
        title="确定支付"
        source={require('./img/kefu.png')}
        // onPress={() => {
        //   navigation.navigate('Payment', {
        //     projectPrice: orderResult?.orderCost,
        //     orderId: orderResult?.orderId,
        //   });
        // }}
        onPress={isLoading ? null : onPay}
      />
    </Content>
  );
};
const styles = StyleSheet.create({
  topBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  fontStyle: {
    // fontWeight: 'bold',
    fontSize,
    color: fontColor,
  },
  line: {
    marginVertical: 15,
    backgroundColor: borderLineColor,
  },
  groupLabel: {
    paddingBottom: 10,
    color: subColor,
    fontSize: subfontSize,
  },
  groupName: {
    color: projectColor,
    fontSize: subfontSize,
  },
});
export default OrderPage;
