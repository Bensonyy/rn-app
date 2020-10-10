import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GroupInfoComponent, ItemDivide, EmptyView } from '../../components';
import { getCollectGroupInfoList } from '../../api';
import { primary, defaultBackground, backgroundColor } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const FocusOnList = () => {
  const route = useRoute();
  const [data, setData] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const userId = route?.params?.userId;

  useEffect(() => {
    fetchData();
    return () => {};
  }, [userId]);

  const fetchData = async () => {
    if (typeof userId === 'undefined' || userId === null || userId === '') {
      return;
    }
    setRefreshing(true);
    const { result, data } = await getCollectGroupInfoList.fetch(userId);
    if (result === 'success') {
      setData(data);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const headDoctorInfo = {
      doctorAvater: item?.groupHead,
      doctorName: item?.groupDoctorName,
      deptName: item?.headDoctorInfo?.deptName,
      hospitalName: item?.headDoctorInfo?.hospitalName,
      professionalTitle: item?.headDoctorInfo?.professionalTitle,
    };
    return (
      <GroupInfoComponent
        groupId={item?.groupId}
        headDoctorInfo={headDoctorInfo}
        isCollect={true}
        styleObj={styles.itemStyle}
        onClickAvatarCom={() => {
          navigation.navigate('Profile', {
            groupId: item.groupId,
          });
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: defaultBackground }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemDivide}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={EmptyView({
          source: require('./img/ic_focus_empty.png'),
        })}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            colors={[primary]}
            onRefresh={() => {
              fetchData();
            }}
          />
        }
      />
    </View>
  );
};

export default FocusOnList;

const styles = StyleSheet.create({
  itemStyle: {
    padding: 10,
    backgroundColor: backgroundColor,
  },
});
