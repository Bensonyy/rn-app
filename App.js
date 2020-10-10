import 'react-native-gesture-handler';
import './src/utils/errorHandler';
import React from 'react';
import Main from './src/index.js';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as WeChat from 'react-native-wechat';
import { wxAppID } from './src/config';

WeChat.registerApp(wxAppID);

const App = () => {
  return (
    <RootSiblingParent>
      <Main />
    </RootSiblingParent>
  );
};

export default App;
