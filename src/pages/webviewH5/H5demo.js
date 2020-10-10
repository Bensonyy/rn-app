import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content } from '../../components';
import WebView from '../../components/WebView';

const H5demo = () => {
  const webviewConfig = {
    source: {
      uri: 'http://192.168.1.55:9901/campaign/#/question/',
    },
  };
  return <WebView {...webviewConfig} />;
};

export default H5demo;

const styles = StyleSheet.create({});
