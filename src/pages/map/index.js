import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Content, CustomMapMarker, ItemDivide } from '../../components';
import { MapView } from 'react-native-amap3d';
import { Loading } from '../../components';
import { SearchBar } from 'react-native-elements';
import { useLocation } from '../../hooks';
import { fontColor, subfontSize, projectColor, fontSize } from '../../theme';

import { getAmapAround, getAmapText } from '../../api/externalApi';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Map = () => {
  const { curLocation, setCurrentLocation } = useLocation({
    isOnlocation: true,
  });
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [pois, setPois] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { longitude, latitude } = curLocation;

  useEffect(() => {
    (longitude || latitude) && fetchData({ longitude, latitude });
  }, [longitude, latitude, fetchData]);

  /**
   * 监听键盘状态
   */
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  const keyboardDidShow = useCallback(() => {
    setIsShowKeyboard(true);
  }, []);

  const keyboardDidHide = useCallback(() => {
    setIsShowKeyboard(false);
  }, []);

  const fetchData = useCallback(async ({ longitude, latitude }) => {
    setIsLoading(true);
    const data = await getAmapAround.fetch({
      location: `${longitude},${latitude}`,
    });
    setPois(data.pois);
    setIsLoading(false);
  }, []);

  const updateSearch = async (keywords) => {
    setKeywords(keywords);
    if (keywords) {
      setIsLoading(true);
      const data = await getAmapText.fetch({
        keywords: `${keywords}`,
      });
      setPois(data.pois);
      setIsLoading(false);
    } else {
      fetchData({ longitude, latitude });
    }
  };

  /**
   * 搜索框
   */
  const renderSearchBar = () => {
    return (
      <SearchBar
        placeholder="搜索"
        onChangeText={updateSearch}
        onCancel={() => {
          fetchData({ longitude, latitude });
        }}
        platform="ios"
        cancelButtonTitle="取消"
        inputContainerStyle={styles.searchBar}
        value={keywords}
      />
    );
  };

  /**
   * 地址列表
   */
  const renderListView = () => {
    const renderItem = ({ item }) => <Item item={item} />;
    return (
      <View style={styles.listView}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={pois}
            ItemSeparatorComponent={ItemDivide}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    );
  };

  /**
   * 地址列表item
   */
  const Item = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          route?.params?.callback(item);
          navigation.goBack();
        }}
      >
        {item?.pname && item?.cityname && item?.address ? (
          <View style={styles.itemStyle}>
            <Text style={styles.addressName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.rowDirection}>
              {item?.distance?.length ? (
                <Text style={styles.distance}>{item.distance}m内 | </Text>
              ) : null}
              <Text style={styles.addressDes} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const mapProps = longitude
    ? {
        center: {
          longitude: longitude,
          latitude: latitude,
        },
      }
    : null;

  return (
    <Content type="full" isScroll={false}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          {longitude ? (
            <View style={styles.container}>
              {!isShowKeyboard ? (
                <CustomMapMarker style={[styles.customMapMarker]} />
              ) : null}
              <MapView
                style={styles.container}
                scrollEnabled={true}
                distanceFilter={100}
                zoomLevel={16}
                onStatusChangeComplete={(status) => {
                  setCurrentLocation({
                    longitude: status.center.longitude,
                    latitude: status.center.latitude,
                  });
                }}
                {...mapProps}
              ></MapView>
            </View>
          ) : (
            <Loading />
          )}
          {renderSearchBar()}
          {renderListView()}
        </View>
      </KeyboardAvoidingView>
    </Content>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBar: {
    height: 30,
    backgroundColor: '#E5E5E5',
  },

  listView: {
    height: HEIGHT * 0.3,
    backgroundColor: '#FAFAFA',
  },

  rowDirection: {
    flexDirection: 'row',
  },

  itemStyle: {
    height: 68,
    justifyContent: 'center',
    paddingLeft: 10,
  },

  backgroundColor: {
    backgroundColor: 'black',
  },

  addressName: {
    fontWeight: 'bold',
    color: fontColor,
    fontSize: fontSize,
  },

  distance: {
    color: projectColor,
    fontSize: subfontSize,
  },

  addressDes: {
    color: projectColor,
    fontSize: subfontSize,
  },

  customMapMarker: {
    top: HEIGHT * 0.35 - 90,
    left: WIDTH * 0.5 - 34,
    position: 'absolute',
    zIndex: 1,
  },
});
