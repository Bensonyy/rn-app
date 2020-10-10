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
  red,
} from '../../../../theme';
import { hidePhoneNumber, centToYuan } from '../../../../utils';

const DoctorTeamInfo = ({ detailData }) => {
  return (
    <Card
      containerStyle={{
        marginBottom: 16,
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <View style={styles.container}>
        <Text style={styles.tittle}>医护团队信息</Text>

        <View style={styles.line} />

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>医护团队:</Text>
          <Text style={styles.value}>{detailData?.groupInfo?.groupName}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>服务项目:</Text>
          <Text style={styles.value}>{detailData?.projectName}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>上门时间:</Text>
          <Text style={styles.value}>{detailData?.orderTime}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>联系方式:</Text>
          <Text style={styles.value}>
            {`${detailData.linkName}  ${detailData.linkTel}`}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>上门地址:</Text>
          <Text style={styles.value}>{detailData?.userAddr}</Text>
        </View>
        <View style={styles.line} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            marginBottom: 6,
            justifyContent: 'flex-end',
          }}
        >
          <Text style={{ fontSize: fontSize, color: fontColor }}>
            订单金额:
          </Text>
          <Text style={{ fontSize: fontSize, color: red, marginLeft: 10 }}>
            {centToYuan(detailData?.orderCost)}元
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default DoctorTeamInfo;

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
    marginRight: 60,
    color: projectColor,
    fontSize: subfontSize,
  },
});
