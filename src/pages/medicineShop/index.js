// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import WebView from '../../components/WebView';
//
// const OnlineConsultation = () => {
//   const webviewConfig = {
//     source: {
//       uri: 'https://www.baidu.com/',
//     },
//   };
//   return <WebView {...webviewConfig} />;
// };
//
// export default OnlineConsultation;
//
// const styles = StyleSheet.create({});

import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { Content } from '../../components';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const imgUrl = require('../../assets/static/shop.png');

export default (params) => {
  return (
    <Content type="full">
      <Image resizeMode="contain" style={styles.img} source={imgUrl} />
    </Content>
  );
};

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
  },
  img: {
    top: 0,
    width: screenWidth,
  },
});
