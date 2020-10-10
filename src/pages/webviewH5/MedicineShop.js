import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content } from '../../components';
import WebView from '../../components/WebView';

const MedicineShop = () => {
  const webviewConfig = {
    isTab: true,
    source: {
      uri: 'https://lecshops.hsyuntai.com/mobile/#/storeindex?storeId=1',
    },
  };
  return <WebView {...webviewConfig} />;
};

export default MedicineShop;

const styles = StyleSheet.create({});
