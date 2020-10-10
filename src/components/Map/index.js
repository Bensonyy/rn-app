import React from 'react';
import { Linking, Platform } from 'react-native';
import { stringify } from 'qs';
import Toast from '../Toast';

const OS = Platform.OS;

export const isInstallMap = ({ type = 'amap' }) => {
  let mapUri = 'amapuri://route/plan/';
  if (type === 'amap') {
    // 高德地图
    if (OS === 'ios') {
      mapUri = 'iosamap://path';
    }
  } else if (type === 'qqmap') {
    // 腾讯地图
    mapUri = 'qqmap://map/routeplan';
  } else if (type === 'baidumap') {
    mapUri = 'baidumap://map/direction';
  }

  return new Promise((resolve, reject) => {
    Linking.canOpenURL(mapUri)
      .then((supported) => {
        resolve(supported);
      })
      .catch(resolve(false));
  });
};

export const openMap = ({
  type = 'amap',
  slat,
  slon,
  dlat,
  dlon,
  sname = '',
  dname = '',
  mode,
}) => {
  let baseUri = OS === 'android' ? 'amapuri://route/plan/?' : 'iosamap://path?';
  return new Promise((resolve, reject) => {
    //起点经纬度不传，则自动将用户当前位置设为起点
    if (!dlat || !dlon) {
      Toast({ message: '终点经纬度不存在' });
      resolve('终点经纬度不存在');
    } else {
      if (type === 'amap') {
        // sourceApplication=test&slat=39.92848272&slon=116.39560823&sname=A&dlat=39.98848272&dlon=116.47560823&dname=B&dev=0&t=0
        const query = {
          sourceApplication: type,
          slat,
          slon,
          sname,
          dlat,
          dlon,
          dname,
          t: mode ?? 0,
        };
        baseUri = `${baseUri}${stringify(query)}`;
      } else if (type === 'qqmap') {
        // qqmap://map/routeplan?type=drive&from=清华&fromcoord=39.994745,116.247282&to=怡和世家&tocoord=39.867192,116.493187&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
        const query = {
          type: 'drive',
          from: sname,
          to: dname,
          fromcoord: `${slat},${slon}`,
          tocoord: `${dlat},${dlon}`,
          referer: '', // 申请的腾讯地图的开发 key
        };
        baseUri = `qqmap://map/routeplan?${stringify(query)}`;
      } else if (type === 'baidumap') {
        // baidumap://map/direction?origin=latlng:34.264642646862,108.95108518068|name:我家&destination=大雁塔&mode=driving&region=西安&output=html&src=webapp.baidu.openAPIdemo
        const query = {
          mode: 'drive',
          origin: `latlng:${slat},${slon}|name:${sname}`,
          destination: `latlng:${dlat},${dlon}|name:${dname}`,
          src: 'rnapp.baidu.openMapApi',
        };
        baseUri = `baidumap://map/direction?${stringify(query)}`;
      }
      Linking.openURL(baseUri)
        .then((res) => {
          console.log(res, 'res openMap');
        })
        .catch((err) => {
          Toast({ message: '未安装该地图' });
          reject('未安装该地图');
        });
    }
  });
};
