import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Content,
  CustomMapMarker,
  WSocket,
  Loading,
  Toast,
} from '../../components';
import { MapView } from 'react-native-amap3d';
import { getPathTrack } from '../../api/externalApi';
import { isOnlineByUserId } from '../../api';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Map = () => {
  const route = useRoute();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [polylines, setPolylines] = useState([]);
  //医生位置作为起点
  // const [origin, setOrigin] = useState('109.714990,18.308152'); // 经度, 纬度
  const [origin, setOrigin] = useState(''); // 经度, 纬度

  //用户位置作为终点
  // const [dest, setDest] = useState('109.715401,18.288828');

  const { dest = '', fromUserId, toUserId } = route?.params || {};

  console.log(origin, 'origin 起点 D 端实时发送');
  console.log(dest, 'dest 目的地用户位置');

  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await isOnlineByUserId.fetch(toUserId);
      console.log(data, 'data isOnlineByUserId');
      if (result === 'success' && data === '0') {
        Toast({ message: message || '对方不在线, 无法发送实时位置' });
      }
    };
    fetchData();
  }, [toUserId]);

  useEffect(() => {
    origin && fetchData();
  }, [origin, dest]);

  const fetchData = useCallback(async ({ longitude, latitude } = {}) => {
    setIsLoading(true);
    const data = await getPathTrack.fetch({
      // origin: `${longitude},${latitude}`,
      origin: origin,
      destination: dest,
    });
    const steps = data?.route?.paths[0]?.steps;
    if (steps?.length) {
      setPolylines(getPolyline(steps));
    }
    setIsLoading(false);
  });

  const getPolyline = useCallback((steps) => {
    const polylines = steps.reduce((memo, item) => {
      const { polyline } = item;
      const polylineArr = polyline.split(';').reduce((subMemo, subitem) => {
        const _subitem = subitem.split(',');
        return [
          ...subMemo,
          {
            longitude: Number(_subitem[0]),
            latitude: Number(_subitem[1]),
          },
        ];
      }, []);
      return [...memo, ...polylineArr];
    }, []);
    return polylines;
  }, []);

  const onMessage = useCallback(({ data }) => {
    const {
      content,
      fromUserName,
      fromUserId,
      msgType,
      fromAvatar,
    } = JSON.parse(data);
    if (msgType === 'map') {
      setOrigin(content);
      console.log(data, 'D 端 message');
      console.log(msgType, 'msgType');
    } else if (msgType === 'error') {
      // Toast({ message: '服务异常或者对象未上线' });
    }
  }, []);

  const mapProps = dest
    ? {
        center: {
          longitude: Number(dest.split(',')[0]),
          latitude: Number(dest.split(',')[1]),
        },
      }
    : null;

  const msg = { fromUserId, toUserId };
  return (
    <Fragment>
      <WSocket msg={msg} onMessage={onMessage} />
      <Content
        type="full"
        isScroll={false}
        loading={!polylines[0]}
        loadingType="absolute"
        loadingContainerStyle={{
          marginTop: 50,
        }}
      >
        {dest ? (
          <View style={styles.container}>
            {/* {!isShowKeyboard ? (
            <CustomMapMarker style={[styles.customMapMarker]} />
          ) : null} */}
            <MapView
              style={styles.container}
              scrollEnabled={true}
              distanceFilter={100}
              zoomLevel={14}
              {...mapProps}
            >
              {polylines[0] ? (
                <MapView.Marker
                  title="起点"
                  icon={() => (
                    <Image
                      source={require('../../assets/start.png')}
                      style={{ width: 32, height: 32 }}
                    />
                  )}
                  coordinate={polylines[0]}
                />
              ) : null}

              {polylines[0] ? (
                <MapView.Marker
                  title="终点"
                  icon={() => (
                    <Image
                      source={require('../../assets/end.png')}
                      style={{ width: 32, height: 32 }}
                    />
                  )}
                  coordinate={polylines[polylines.length - 1]}
                />
              ) : null}

              {polylines?.length ? (
                <MapView.Polyline
                  coordinates={polylines}
                  color={'#2bbe76'} //线段颜色
                  dashed={false} //是否绘制虚线
                  width={10}
                />
              ) : null}
            </MapView>
          </View>
        ) : (
          <Loading />
        )}
      </Content>
    </Fragment>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customMapMarker: {
    top: HEIGHT * 0.35 - 90,
    left: WIDTH * 0.5 - 34,
    position: 'absolute',
    zIndex: 1,
  },
});
