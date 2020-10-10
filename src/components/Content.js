import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import PropTypes from 'prop-types';
import SafeAreaView from 'react-native-safe-area-view';
import Constants from 'expo-constants';
import { LeftBackBtn } from './Shared';
import Loading from './Loading';
import { backgroundColor, contentSpace } from '../theme';
import { statusBarHeight } from '../utils';
const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
const Content = ({
  children,
  loading = false,
  type,
  title = '',
  isScroll = true,
  style = {},
  bgImgStyle = {},
  showBg = false,
  isShowLeftBtn = true,
  loadingType = 'float',
  loadingContainerStyle = {},
  ...rest
}) => {
  const navigation = useNavigation();
  if (loading) {
    return (
      <SafeAreaView>
        <Loading
          type={loadingType}
          loadingContainerStyle={loadingContainerStyle}
        />
      </SafeAreaView>
    );
  }

  if (isScroll) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={[styles.container, { paddingTop: 0 }]}
        >
          <View style={[styles[type], style]} {...rest}>
            {showBg ? (
              <ImageBackground
                source={require('../assets/bgimg/top.png')}
                style={styles.bgImage}
              >
                <View style={[{ height: 117 }, bgImgStyle]}>
                  {isShowLeftBtn ? (
                    <View style={styles.headerBox}>
                      <LeftBackBtn navigation={navigation} />
                      <Text style={styles.headerTitle}>{title}</Text>
                      <Text></Text>
                    </View>
                  ) : null}
                </View>
              </ImageBackground>
            ) : null}
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles[type], style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};

Content.defaultProps = {
  type: 'root',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    flex: 1,
  },
  root: {
    backgroundColor: backgroundColor,
    flex: 1,
    paddingVertical: contentSpace,
    paddingHorizontal: contentSpace,
    paddingTop: statusBarHeight ? statusBarHeight - contentSpace : contentSpace,
    position: 'relative',
    minHeight: HEIGHT - statusBarHeight - 56,
  },
  full: {
    backgroundColor: backgroundColor,
    flex: 1,
    position: 'relative',
    minHeight: HEIGHT - statusBarHeight - 56,
  },
  bgImage: {
    resizeMode: 'cover',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 20,
    width: WIDTH - 32,
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 17, marginTop: 30, marginLeft: -23 },
});

export default React.memo((props) => <Content {...props} />);
