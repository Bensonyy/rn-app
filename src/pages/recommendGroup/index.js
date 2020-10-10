import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  fontColor,
  fontSize,
  fontColorWhite,
  subfontSize,
  primary,
  subColor,
  smallfontSize,
  projectColor,
} from '../../theme';
import {
  Card,
  RootContext,
  AvatarCom,
  flexStyle,
  GroupCard,
} from '../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getGuidanceList } from '../../api';
const RecommendGroup = () => {
  const [fetchData, setFetchData] = useState([]);
  const route = useRoute();
  const diseaseId = route?.params?.diseaseId;
  // console.log(diseaseId, 'diseaseId');
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getGuidanceList.fetch({
        diseaseId,
      });
      if (result === 'success') {
        setFetchData(data);
        console.log(JSON.stringify(data), 'ffff');
      } else {
        console.log('失败');
      }
    };
    fetchData();
  }, [diseaseId]);
  const renderItem = ({ item }) => <Item item={item} />;
  const Item = ({ item }) => {
    const navigation = useNavigation();
    const {
      headDoctorInfo,
      groupHead,
      groupName,
      groupIntroduce,
      groupId,
    } = item;
    const doctorList = [
      ...(item.doctorInfoList ? item.doctorInfoList : []),
      ...(item.nurseInfoList ? item.nurseInfoList : []),
    ];
    return (
      <GroupCard
        callback={() => {
          navigation.navigate('Profile', {
            groupId,
            // groupInfo: { groupId },
          });
        }}
        groupHead={groupHead}
        headDoctorInfo={headDoctorInfo}
        groupName={groupName}
        groupIntroduce={groupIntroduce}
        doctorList={doctorList}
      />
    );
  };
  return (
    <View style={styles.container}>
      {fetchData ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
            <View style={styles.titleCircle}></View>
            <Text style={styles.titleText}>根据您的选择 推荐以下医护团队</Text>
          </View>
          <FlatList
            data={fetchData}
            renderItem={renderItem}
            keyExtractor={(item) => item.groupId}
          />
        </>
      ) : (
        <View style={flexStyle.center}>
          <Text>暂无数据</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  titleCircle: {
    width: 8,
    height: 8,
    backgroundColor: primary,
    borderRadius: 100,
  },
  titleText: {
    color: fontColor,
    fontSize: fontSize,
    paddingLeft: 5,
  },
  cardView: {
    display: 'flex',
    marginBottom: 8,
  },
  groupName: { color: fontColor, fontSize: subfontSize },
  subFontStyle: { color: subColor, fontSize: smallfontSize },
  groupLabel: {
    paddingBottom: 10,
    color: fontColor,
    fontSize: smallfontSize,
  },
  goodText: {
    color: subColor,
    fontSize: smallfontSize,
  },
});
export default RecommendGroup;
