import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  FlatList,
  Dimensions,
  View,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import { ShortVideoItem } from '../../components';
import { tabHeight } from '../../config';
import { videoBackgroundColor } from '../../theme';
import { homeVideoList } from '../../api';
import { RootContext } from '../../components/Context.js';
import { useIsFocused } from '@react-navigation/native';
const HEIGHT = Dimensions.get('screen').height;

const Home = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState();
  const { getLoginInfo } = useContext(RootContext);
  const isFocused = useIsFocused();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    // 只有 100% 呈现在页面上的 item, 只会有一个
    if (viewableItems.length === 1) {
      setCurrentItem(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    const fetchLoginInfo = async () => {
      const loginInfo = await getLoginInfo();
      const id = loginInfo?.userId;
      setUserId(id);
    };
    fetchLoginInfo();
  }, [isFocused]);

  useEffect(() => {
    // setData(mockData);
    const fetchData = async () => {
      const loginInfo = await getLoginInfo();
      const userId = loginInfo?.userId;
      // const { result, data, message } = await homeVideoList.fetch({
      //   userId: userId ? userId : '',
      // });
      const { recommendList } = require('../../../mock/db.json');
      const { result, data, message } = recommendList;
      // console.log(data, '视频列表');
      if (result === 'success') {
        setData(data);
      }
    };
    fetchData();
  }, [userId]);

  const renderItem = ({ item, index, separators }) => {
    return (
      <View
        style={styles.videoItem}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
      >
        <ShortVideoItem
          {...item}
          paused={index !== currentItem}
          currentItem={currentItem}
          index={index}
        />
      </View>
    );
  };

  const ItemSeparatorComponent = () => {
    return (
      Platform.OS !== 'android' &&
      (({ highlighted }) => {
        return (
          <View style={[styles.separator]}>
            <Text>11111</Text>
          </View>
        );
      })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        pagingEnabled={true}
        getItemLayout={(item, index) => {
          return {
            length: HEIGHT - tabHeight,
            offset: (HEIGHT - tabHeight) * index,
            index,
          };
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 80, // item 滑动 80 部分才会到下一个
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  separator: {
    height: tabHeight,
    backgroundColor: videoBackgroundColor,
    color: '#fff',
  },
  videoItem: {
    flex: 1,
  },
});
