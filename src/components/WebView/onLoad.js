import React from 'react';
import { Platform } from 'react-native';

export default async ({ nativeEvent, navigation, webviewRef }) => {
  const onLoadParams = {
    type: 'appInfo',
    params: {
      version: 1,
      platform: Platform.OS,
    },
  };
  webviewRef?.injectJavaScript('window.AppJSBridgeOnReady();true;');
  webviewRef?.injectJavaScript(
    `AppJSBridge.appCallback(${JSON.stringify(onLoadParams)});true;`
  );
};
