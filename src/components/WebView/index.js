import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import Loading from '../Loading';
import onMessage from './onMessage';
import onLoad from './onLoad';
import { statusBarHeight } from '../../utils';
import { tabHeight } from '../../config';

import injectJavaScript from '../../utils/jsbridge.min';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

const jsString = String(injectJavaScript);
const INJECTED_JAVASCRIPT = `;(${jsString})(window);true;`;

const WebViewCom = ({
  source,
  style = {},
  isTab,
  showsHorizontalScrollIndicator = false,
  ...rest
}) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const navigation = useNavigation();
  let webviewRef = useRef();

  const _onMessage = useCallback(
    ({ nativeEvent }) => {
      onMessage({ nativeEvent, navigation, webviewRef });
    },
    [navigation]
  );
  const _onLoad = useCallback(({ nativeEvent }) => {
    onLoad({ nativeEvent });
  }, []);

  const onNavigationStateChange = useCallback((navState) => {
    const { canGoBack } = navState;
    setCanGoBack(canGoBack);
  }, []);

  const _style = isTab
    ? {
        paddingTop: statusBarHeight,
      }
    : {};

  return (
    <View style={[{ flex: 1 }, _style]}>
      <WebView
        ref={(r) => (webviewRef = r)}
        source={source}
        useWebKit={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={_onMessage}
        onLoad={_onLoad}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={true}
        javaScriptEnabled={true}
        renderLoading={() => <Loading type="absolute" />}
        renderError={() => (
          <View style={{ flex: 1, color: 'red' }}>
            <Text>加载 webview 出错了</Text>
          </View>
        )}
        originWhitelist={['*']}
        {...rest}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        style={{
          width: WIDTH,
          height: isTab ? HEIGHT - tabHeight : HEIGHT,
        }}
      />
    </View>
  );
};

export default WebViewCom;
