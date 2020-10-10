import React, { useEffect, useState } from 'react';
import { Content, Card, BottomComponents, Toast } from '../../components';
import { View, Text, StyleSheet, Platform } from 'react-native';
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
  contentSpace,
} from '../../theme';
import {
  orderInfo,
  wxPay,
  aliPay,
  getMedicalRecordByVisitCode,
  isOnlineByUserId,
} from '../../api';
import { timeConvert } from '../../utils';
import requestCameraAndAudioPermission from './Permission';

const OrderPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [orderResult, setOrderResult] = useState({});
  const [selectIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { orderId, medicalId, consulType, token, routeParams } =
    route.params || {};
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getMedicalRecordByVisitCode.fetch(
        medicalId
      );
      if (result === 'success') {
        setOrderResult(data || {});
      }
    };
    fetchData();
  }, [medicalId]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });

      // const fetchPermissions = async () => {
      //   await request(PERMISSIONS.ANDROID.CAMERA);
      //   await request(PERMISSIONS.RECORD_AUDIO);
      // };

      // fetchPermissions();
    }

    return () => {};
  }, []);

  const onChat = async () => {
    const { userId, doctorInfo = {} } = orderResult;
    const { doctorId, doctorName, doctorAvater } = doctorInfo || {};

    const { result, data, message } = await isOnlineByUserId.fetch(
      doctorId,
      '1111'
    );
    console.log(data, 'data isOnlineByUserId');
    if (result === 'success' && data === '1') {
      // consulType 问诊类型：tuwen 图文 call 电话 video 视频
      // console.log(orderResult, 'orderResult');
      if (consulType === 'tuwen') {
        navigation.navigate('Im', {
          userId,
          doctorInfo,
          token,
          medicalId,
          consulType,
          routeParams,
        });
      } else if (consulType === 'video') {
        navigation.navigate('OnLineVideo', {
          userId,
          doctorInfo,
          token,
          medicalId,
          consulType,
          routeParams,
        });
      }
    } else {
      Toast({ message: message || '对方不在线，无法发起在线对话' });
    }
  };

  return (
    <Content type="full">
      <Card containerStyle={{ paddingHorizontal: contentSpace }}>
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
              <Text style={styles.groupName}>{orderResult.medicalId}</Text>
            </Text>
            <Text style={styles.groupLabel}>
              下单时间：
              <Text style={styles.groupName}>
                {timeConvert(orderResult.createDate, 1)}
              </Text>
            </Text>
          </View>
        </View>
      </Card>
      <Card containerStyle={{ marginTop: 15, paddingHorizontal: contentSpace }}>
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>
              {consulType === 'tuwen' ? '图文问诊' : '视频问诊'}
            </Text>
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
            <View style={[{ flexDirection: 'row', marginBottom: 10 }]}>
              <Text style={styles.groupLabel}>问诊医生：</Text>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.groupName}>
                  {orderResult?.doctorInfo?.doctorName}
                  {'  '}
                  <Text style={styles.groupName}>
                    {orderResult?.doctorInfo?.deptName}
                  </Text>
                </Text>
                <Text style={styles.groupName}>
                  {orderResult?.doctorInfo?.deptName}
                </Text>
              </View>
            </View>
            <Text style={styles.groupLabel}>
              就诊人员：
              <Text style={styles.groupName}>
                {orderResult.memberName} {orderResult.memberAge}
              </Text>
            </Text>
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
                <Text style={{ fontSize, color: 'red' }}>0 元</Text>
              </Text>
            </View>
          </View>
        </View>
      </Card>
      <Card containerStyle={{ marginTop: 15, paddingHorizontal: contentSpace }}>
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>病情描述</Text>
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
            <Text style={{ fontSize: 16 }}>{orderResult.chiefComplaint}</Text>
          </View>
        </View>
      </Card>
      <View style={styles.btnWrap}>
        <Button
          title="点击对话"
          buttonStyle={[styles.buttonStyle]}
          titleStyle={[styles.buttonText]}
          onPress={onChat}
        />
      </View>
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
    fontWeight: 'bold',
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
  buttonText: {
    fontSize,
  },
  buttonStyle: {
    borderRadius: 50,
    height: 45,
    marginTop: 60,
    backgroundColor: primary,
  },
  btnWrap: {
    paddingHorizontal: contentSpace,
    paddingVertical: 20,
  },
});
export default OrderPage;
