import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  subColor,
  subfontSize,
  fontColor,
  smallfontSize,
  borderLineColor,
  projectColor,
  red,
} from '../../../../theme';

const ItemTop = ({ itemData }) => {
  return (
    <View style={{ padding: 6 }}>
      <View style={styles.spaceBetween}>
        <ConsulType status={itemData.ConsulType} />
        <StatusView status={itemData?.visitState} />
      </View>
      <Text style={[styles.fontSize14, styles.color9]}>
        订单号: {itemData?.orderNum}
      </Text>

      <View style={styles.line} />

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={[styles.fontSize14, styles.color6]}>问诊医生</Text>
        <View style={{ marginLeft: 14 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[styles.fontSize14, styles.color3, { fontWeight: 'bold' }]}
            >
              {itemData?.doctorInfo?.doctorName}
            </Text>
            <Text> {itemData?.doctorInfo?.deptName}</Text>
          </View>
          <Text style={[styles.fontSize14, styles.color6, { marginTop: 4 }]}>
            {itemData?.doctorInfo?.hospitalName}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={[styles.fontSize14, styles.color6]}>就诊人员</Text>
        <Text
          style={[
            {
              marginLeft: 16,
              fontWeight: 'bold',
            },
            styles.fontSize14,
            styles.color3,
          ]}
        >
          {itemData?.medicalRecord?.memberName}
        </Text>
        <SexView id={itemData?.medicalRecord?.memberSex} />
        <Text style={[{ marginLeft: 4 }, styles.fontSize14, styles.color6]}>
          {itemData?.medicalRecord?.memberAge}
        </Text>
      </View>
    </View>
  );
};

export default ItemTop;

/**
 * 状态View
 * @param {*} param0
 */
const StatusView = ({ status }) => {
  switch (status) {
    case 'unstart':
      return (
        <Text style={[styles.statusText, { color: '#80C400' }]}>待接诊</Text>
      );

    case 'inquirying;':
      return (
        <Text style={[styles.statusText, { color: '#3385FF' }]}>接诊中</Text>
      );

    case 'end ':
      return (
        <Text style={[styles.statusText, { color: subColor }]}>已完成</Text>
      );

    case 'cance':
      return <Text style={[styles.statusText, { color: red }]}>已取消</Text>;

    default:
      break;
  }
  return <Text style={[styles.statusText, { color: subColor }]}>已完成</Text>;
};

/**
 * 问诊类别
 * @param {*} param0
 */
const ConsulType = ({ status }) => {
  let consulType = '图文问诊';
  switch (status) {
    case 'tuwen':
      consulType = '图文问诊';
      break;
    case 'call':
      consulType = '电话问诊';
      break;
    case 'video':
      consulType = '视频问诊';
      break;
  }
  return <Text style={[styles.fontSize16, styles.color3]}>{consulType}</Text>;
};

/**
 * 性别View
 * @param {*} param0
 */
const SexView = ({ id }) => {
  let sexName = '男';
  switch (id) {
    case '0':
      sexName = '其他';
      break;

    case '1':
      sexName = '男';
      break;

    case '2':
      sexName = '女';
      break;
  }
  return (
    <Text style={[{ marginLeft: 4 }, styles.fontSize14, styles.color6]}>
      {sexName}
    </Text>
  );
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    marginTop: 10,
    backgroundColor: borderLineColor,
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  projectTextStyle: {
    fontSize: smallfontSize,
    color: projectColor,
  },

  statusText: {
    fontSize: subfontSize,
    marginTop: 10,
  },

  fontSize16: {
    fontSize: subfontSize,
  },

  fontSize14: {
    fontSize: smallfontSize,
  },

  color3: {
    color: fontColor,
  },

  color6: {
    color: projectColor,
  },

  color9: {
    color: subColor,
  },
});
