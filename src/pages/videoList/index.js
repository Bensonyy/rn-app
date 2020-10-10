import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import { Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Content, Loading } from '../../components';
import { fontColor } from '../../theme';
import { useLocation } from '../../hooks';
import { getSameCityList } from '../../api';
import { RootContext } from '../../components/Context.js';

const screenWidth = Dimensions.get('window').width;

const VideoList = () => {
  const { curLocation } = useLocation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [pageNum, setPageNum] = useState(0);
  const { longitude, latitude } = curLocation;
  const { getLoginInfo } = useContext(RootContext);

  const fetchData = useCallback(
    ({ pageSize = 10, pageNum, isLoadingMore = false }) => {
      const fetchData = async () => {
        setIsLoading(true);
        const loginInfo = await getLoginInfo();
        const userId = loginInfo?.userId;
        const { result, data: resData, message } = await getSameCityList.fetch({
          longitude,
          latitude,
          pageNum,
          pageSize,
          userId: userId ? userId : '',
        });
        if (result === 'success') {
          isLoadingMore
            ? setData((data) => [...data, ...resData])
            : setData(resData);
        }
        setIsLoading(false);
      };
      fetchData();
    },
    [longitude, latitude]
  );

  useEffect(() => {
    longitude && fetchData({ pageNum: pageNum === 0 ? pageNum + 1 : pageNum });
  }, [longitude, latitude, fetchData, pageNum]);

  const onItemPress = (item) => {
    navigation.navigate('VideoItem', { item, title: item.title });
  };

  const renderItem = ({ item, index, separators }) => {
    return (
      <TouchableWithoutFeedback onPress={() => onItemPress(item)}>
        <View
          style={styles.itemContainer}
          onShowUnderlay={separators.highlight}
          onHideUnderlay={separators.unhighlight}
        >
          <Image
            source={{ uri: item.cover }}
            resizeMode="cover"
            style={{ height: 235 }}
          />
          <Text style={styles.describe} numberOfLines={3}>
            {item.describe}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderLoadMoreView = () => {
    return (
      <View style={styles.loadMore}>
        <Loading />
        <Text>正在加载更多</Text>
      </View>
    );
  };

  return (
    <Content type="full" isScroll={false} style={{ paddingTop: 0 }}>
      <FlatList
        numColumns={2}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            title={'Loading…'} //android 中设置无效
            refreshing={isLoading}
            onRefresh={() => {
              setPageNum(1);
            }}
          />
        }
        // ListFooterComponent={() => renderLoadMoreView()}
        // onEndReached={() => setPageNum((num) => (num += 1))}
      ></FlatList>
    </Content>
  );
};

export default VideoList;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 2,
    width: screenWidth / 2,
  },
  describe: {
    color: fontColor,
  },
  loadMore: {
    color: fontColor,
    alignItems: 'center',
  },
});
