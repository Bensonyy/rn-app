import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Card } from '../../../../components';
import {
  fontColor,
  fontSize,
  borderLineColor,
  subColor,
  smallfontSize,
} from '../../../../theme';

const screenW = Dimensions.get('window').width;
// 一些常量设置
const cols = 2; // 列数
const left = 10; // 左右边距
const top = 20; // 上下边距

const itemWidth = (screenW - (cols + 1) * left) / cols;

const Item = ({ item }) => {
  return (
    <View style={styles.itemView}>
      <Avatar
        rounded
        size={'medium'}
        source={{
          uri: item.avater,
        }}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: 10,
        }}
      >
        <Text style={{ fontSize: smallfontSize, color: fontColor }}>
          {item.staffName}
        </Text>
        <Text
          style={{ fontSize: smallfontSize, color: subColor, marginTop: 4 }}
        >
          {item.professionalTitle}
        </Text>
      </View>
    </View>
  );
};

const ServiceDoctor = ({ detailData }) => {
  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <Text style={styles.tittle}>医护人员信息</Text>
      <View style={styles.line} />
      <FlatList
        renderItem={renderItem}
        data={detailData.staffList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={cols}
        horizontal={false}
      />
    </Card>
  );
};

export default ServiceDoctor;

const styles = StyleSheet.create({
  tittle: {
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize,
    color: fontColor,
  },

  itemView: {
    width: itemWidth,
    height: 50,
    marginLeft: left,
    marginTop: top,
    alignItems: 'center',
    flexDirection: 'row',
  },

  line: {
    height: 1,
    backgroundColor: borderLineColor,
    marginTop: 10,
  },
});
