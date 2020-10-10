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
  orange,
} from '../../../../theme';
import { centToYuan } from '../../../../utils';

const ItemTop = ({ itemData }) => {
  return (
    <View style={{ padding: 6 }}>
      <View style={[styles.spaceBetween, { height: 30 }]}>
        <Text style={{ fontSize: subfontSize, color: fontColor }}>
          {itemData?.userName} <SexView id={itemData?.userSex} />
          {itemData?.userAge}
        </Text>
        <StatusView status={itemData?.orderPeriod} />
      </View>
      <Text style={{ fontSize: smallfontSize, color: subColor }}>
        订单号:{itemData?.orderNum}
      </Text>

      <View style={styles.line} />

      <ProjectItem items={itemData.orderNurseItemList} />
      <Text
        style={[styles.projectTextStyle, { textAlign: 'right', marginTop: 10 }]}
      >
        共计{itemData.orderNurseItemList.length}项服务,合计:
        <Text style={{ color: red }}>￥{centToYuan(itemData?.orderCost)}</Text>
      </Text>
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
    case 'unPay':
      return <Text style={[styles.statusText, { color: red }]}>待付款</Text>;

    case 'unConfirm':
      return (
        <Text style={[styles.statusText, { color: '#80C400' }]}>待接单</Text>
      );

    //已经分配，护士确认
    case 'working':
      return (
        <Text style={{ color: orange, fontSize: smallfontSize, marginTop: 1 }}>
          医护准备中
        </Text>
      );

    //医生已经出发
    case 'startOuting':
      return (
        <Text
          style={{ color: '#80C400', fontSize: smallfontSize, marginTop: 1 }}
        >
          医护已出发
        </Text>
      );

    case 'finish':
      return (
        <Text style={[styles.statusText, { color: subColor }]}>已完成</Text>
      );

    default:
      break;
  }
  return <Text style={[styles.statusText, { color: subColor }]}>已完成</Text>;
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
  return <Text>{sexName} </Text>;
};

/**
 * 服务项目
 * @param {*} param0
 */
const ProjectItem = ({ items }) => {
  return (
    <View>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.spaceBetween,
            {
              marginTop: 8,
            },
          ]}
        >
          <Text style={styles.projectTextStyle}>{item?.projectName}</Text>
          <Text style={styles.projectTextStyle}>
            ¥{centToYuan(item?.projectPrice)}
          </Text>
        </View>
      ))}
    </View>
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
  },
});
