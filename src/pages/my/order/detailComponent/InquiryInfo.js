//问诊信息
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../../components';
import {
  subColor,
  subfontSize,
  fontColor,
  smallfontSize,
  borderLineColor,
  projectColor,
  fontSize,
  red,
} from '../../../../theme';

export default function InquiryInfo({ detailData }) {
  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <ConsulType status={detailData.ConsulType} />
      <View style={styles.line} />
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={[styles.fontSize16, styles.color9]}>问诊医生</Text>
        <View style={{ marginLeft: 14 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.fontSize16, styles.color6]}>
              {detailData?.doctorInfo?.doctorName}
            </Text>
            <Text style={[styles.fontSize16, styles.color6]}>
              {detailData?.office}
            </Text>
          </View>
          <Text style={[styles.fontSize16, styles.color6]}>
            {detailData?.doctorInfo?.hospitalName}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={[styles.fontSize16, styles.color9]}>就诊人员</Text>
        <Text
          style={[
            {
              marginLeft: 16,
            },
            styles.fontSize16,
            styles.color6,
          ]}
        >
          {detailData?.medicalRecord?.memberName}
        </Text>
        <SexView id={detailData?.medicalRecord?.memberSex} />
        <Text style={[{ marginLeft: 4 }, styles.fontSize16, styles.color6]}>
          {detailData?.medicalRecord?.memberAge}
        </Text>
      </View>
      <View style={styles.line} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingTop: 12,
          paddingBottom: 6,
          marginRight: 4,
        }}
      >
        <Text style={{ fontSize: 18, color: fontColor }}>会诊费用:</Text>
        <Text style={{ fontSize: 18, color: red, marginLeft: 10 }}>
          3810元/次
        </Text>
      </View>
    </Card>
  );
}

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
    <Text style={[{ marginLeft: 4 }, styles.fontSize16, styles.color6]}>
      {sexName}
    </Text>
  );
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
  return <Text style={styles.title}>{consulType}</Text>;
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize: fontSize,
    color: fontColor,
  },

  line: {
    height: 1,
    marginTop: 8,
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
