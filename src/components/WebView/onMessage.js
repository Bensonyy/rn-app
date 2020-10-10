import React from 'react';
import { getLoginInfo } from '../../utils';

export default async ({ nativeEvent, navigation, webviewRef }) => {
  const data = JSON.parse(nativeEvent.data);
  if (!data) {
    return;
  }
  const { type, params, callbackId } = data;
  switch (type) {
    case 'getLoginInfo':
      const data = (await getLoginInfo()) || {};
      const cbData = {
        callbackId,
        params: {
          ...data,
        },
      };
      webviewRef?.injectJavaScript(
        `AppJSBridge.appCallback(${JSON.stringify(cbData)});true;`
      );
      break;

    // 导航到 app 指定 pages/page
    case 'navigate':
      const { pageName } = params;
      navigation.navigate(pageName);
      break;
  }
};
