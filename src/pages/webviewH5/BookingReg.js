import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content } from '../../components';
import WebView from '../../components/WebView';

const BookingReg = () => {
  const webviewConfig = {
    isTab: true,
    source: {
      uri: 'https://m.hsyuntai.com/cloud/310000/reg',
    },
  };
  return <WebView {...webviewConfig} />;
};

export default BookingReg;

const styles = StyleSheet.create({});
