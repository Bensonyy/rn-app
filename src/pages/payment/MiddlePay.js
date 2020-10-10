import React, { useEffect, useState, useCallback } from 'react';
import { Card, Toast, Button } from '../../components';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { CheckBox, Image } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  fontSize,
  fontColor,
  borderLineColor,
  subColor,
  subfontSize,
  projectColor,
  backgroundColor,
  tagSize,
} from '../../theme';
import { orderInfo, wxPay, aliPay } from '../../api';
import * as WeChat from 'react-native-wechat';
import Alipay from '@uiw/react-native-alipay';
import { wxAppID } from '../../config';

import { OnLineVideo } from '../../components';

const PaymentInfo = () => {
  const route = useRoute();
  const [orderResult, setOrderResult] = useState({});
  const [selectIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('1112222');
  const [enableVideo, setEnableVideo] = useState(false);
  const navigation = useNavigation();

  const type = route.params?.type;

  const radioData = {
    radioGroup: [
      {
        index: 0,
        name: '微信支付',
        icon: require('../orderPage/img/WeChat.png'),
      },
      {
        index: 1,
        name: '支付宝支付',
        icon: require('../orderPage/img/alipay.png'),
      },
    ],
  };
  const _onPay = () => {
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
          Toast({
            message: '微信支付成功',
          });
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
        Toast({
          message: '支付宝支付成功',
        });
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
      if (result === 'success') {
        setOrderResult(data);
      }
    };
    fetchData();
  }, [orderId]);

  const onNext = () => {
    if (type === 'onLineVideo') {
      setEnableVideo(true);
    } else if (type === 'Im') {
      navigation.replace('Im');
    }
  };

  const onCallback = useCallback(({ enableVideo }) => {
    setEnableVideo(enableVideo);
  }, []);

  if (enableVideo) {
    return <OnLineVideo onCallback={onCallback} />;
  }

  return (
    <View>
      <Card
        containerStyle={{
          marginLeft: 16,
          marginRight: 16,
          marginTop: 16,
        }}
      >
        <Text style={styles.tittle}>支付方式</Text>

        <View style={styles.line} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {radioData?.radioGroup?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                <Image
                  source={item.icon}
                  style={{ width: 44, height: 44, flex: 1, marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: subfontSize, color: projectColor }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{ fontSize: tagSize, color: subColor, marginTop: 4 }}
                  >
                    银行卡/信用卡都可使用
                  </Text>
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
      </Card>

      <View style={styles.container}>
        <Button
          disabled={isLoading}
          title={'确定支付'}
          buttonStyle={styles.buttonStyle}
          onPress={onNext}
        />
      </View>
    </View>
  );
};

export default PaymentInfo;

const styles = StyleSheet.create({
  tittle: {
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize,
    color: fontColor,
  },

  line: {
    height: 1,
    backgroundColor: borderLineColor,
    marginBottom: 16,
    marginTop: 10,
  },

  container: {
    marginTop: 100,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonStyle: {
    height: 44,
    width: 320,
    backgroundColor: '#3385FF',
  },
});
