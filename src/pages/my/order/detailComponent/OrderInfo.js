import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../../components';
import {
  fontColor,
  subfontSize,
  fontSize,
  borderLineColor,
  subColor,
  projectColor,
} from '../../../../theme';
import { Icon } from 'react-native-elements';

const OrderInfo = ({ detailData }) => {
  {
    console.log('detailData', detailData);
  }
  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.tittle}>订单信息</Text>
          {/* <View
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
          </View> */}
        </View>

        <View style={styles.line} />

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>订单编号:</Text>
          <Text style={styles.value}>{detailData?.orderNum}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>下单时间:</Text>
          <Text style={styles.value}>{detailData?.createDate}</Text>
        </View>
      </View>
    </Card>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  topView: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  label: {
    paddingBottom: 10,
    color: subColor,
    fontSize: subfontSize,
  },
  value: {
    marginLeft: 10,
    color: projectColor,
    fontSize: subfontSize,
  },
});
