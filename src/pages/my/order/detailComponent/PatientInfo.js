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
import { hideIdCard } from '../../../../utils';

const PatientInfo = ({ detailData }) => {
  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <View style={styles.container}>
        <Text style={styles.tittle}>就诊人信息</Text>

        <View style={styles.line} />

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>就诊人:</Text>
          <Text style={styles.value}>{detailData?.userName}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>性别:</Text>
          <SexView id={detailData?.userSex} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>身份证号码:</Text>
          <Text style={styles.value}>
            {hideIdCard(detailData?.credentialsNum)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default PatientInfo;

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
  return <Text style={styles.value}>{sexName} </Text>;
};

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
