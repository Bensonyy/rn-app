import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wxPay, aliPay } from '../../api';
import { wxAppID } from '../../config';
import { Card, Divider, Input, Text, CheckBox } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import * as WeChat from 'react-native-wechat';
import Alipay from '@uiw/react-native-alipay';
import { Content, AvatarCom, TitleCom, BtnCom, Toast } from '../../components';
const WIDTH = Dimensions.get('screen').width;

const items = [
  {
    name: '微信支付',
  },
  { name: '支付宝支付' },
];

const Payment = () => {
  const route = useRoute();
  //0:微信支付  1:支付宝支付
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const projectPrice = route?.params?.projectPrice ?? 0;
  const orderId = route?.params?.orderId;

  const onPay = () => {
    switch (checkedIndex) {
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

  return (
    <Content>
      <Card containerStyle={styles.cardWrap}>
        <TitleCom
          title="张医生"
          titleStyle={{ fontSize: 20 }}
          left={() => (
            <AvatarCom
              source={{
                uri:
                  'https://himg.bdimg.com/sys/portrait/item/3b6a3536333630383633318715.jpg',
              }}
            />
          )}
        />
        <View style={styles.item}>
          <Text style={styles.itemTextLeft}>打针</Text>
          <Text style={styles.itemText}>￥ {projectPrice} 元/次</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemTextLeft}>购买数量</Text>
          <Text style={styles.itemText}>1</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemTextLeft}>优惠</Text>
          <Text style={styles.itemText}>0</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemTextLeft}>小计</Text>
          <Text style={styles.itemText}>￥ {projectPrice}</Text>
        </View>
      </Card>

      <Card containerStyle={styles.cardWrap}>
        <View style={styles.payWrap}>
          {items.map((item, index) => (
            <CheckBox
              key={index}
              title={item.name}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={index === checkedIndex}
              onPress={() => setCheckedIndex(index)}
            />
          ))}
        </View>
      </Card>
      <View style={styles.bottomBtnWrap}>
        <View style={styles.btnLeft}>
          <BtnCom
            title={`实付:￥${projectPrice}`}
            containerStyle={{ backgroundColor: '#fff' }}
            textStyle={{ color: '#000' }}
            isTouchable={false}
          />
        </View>
        <View style={styles.btnRight}>
          <BtnCom
            title="确认支付"
            onPress={isLoading ? null : onPay}
            containerStyle={{ opacity: isLoading ? 0.3 : 1 }}
          />
        </View>
      </View>
    </Content>
  );
};

export default Payment;
const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  itemTextLeft: {
    textAlign: 'right',
    fontSize: 18,
    width: 100,
  },
  itemText: {
    fontSize: 18,
    textAlign: 'left',
    width: 100,
  },
  payWrap: {},
  bottomBtnWrap: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  btnLeft: {
    width: 0.6 * WIDTH,
  },
  btnRight: {
    width: 0.4 * WIDTH,
  },
});
