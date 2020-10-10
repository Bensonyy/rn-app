import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, Button, Icon } from 'react-native-elements';
import { SWRConfig } from 'swr';
import Constants from 'expo-constants';
import { swrOptions, tabHeight } from './config';
import { Store, OS, statusBarHeight } from './utils';
import { useRoot } from './hooks';
import { RootContext, getTabHeaderConfig, Loading, Tab } from './components';
import rootNavs, { tabBottomNavs } from './Navigation';
import {
  tabBackgroundColor,
  fontColor,
  primary,
  statusBarStyle,
  projectColor,
} from './theme';

const setScreenOptions = ({ rootContext, route, navigation }) => {
  const {
    theme: { colors },
  } = rootContext;
  return {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitleAlign: 'center',
    headerTitleStyle: { fontSize: 17, color: colors.headerTitleStyle },
    headerBackImage: () => (
      <Icon
        type={'entypo'}
        name="chevron-thin-left"
        size={24}
        color={projectColor}
      />
    ),
    headerStyle: {
      // borderBottomWidth: 0,
      elevation: 1,
      shadowOpacity: 0,
      backgroundColor: tabBackgroundColor,
      height: OS === 'web' ? 44 : 56 + statusBarHeight, // 默认 56
    },
    headerStatusBarHeight: statusBarHeight,
  };
};

const TabNav = createBottomTabNavigator();
const RootStack = createStackNavigator();

// 首页 tab
const TabScreen = ({ navigation, route }) => {
  return (
    <TabNav.Navigator
      initialRouteName="Home"
      tabBar={(props) => <Tab {...props} />}
      tabBarOptions={{
        activeTintColor: primary,
        style: {
          elevation: 3,
          backgroundColor: tabBackgroundColor,
          borderTopWidth: 0,
          marginBottom: 0,
          height: tabHeight,
        },
        labelStyle: {
          marginTop: -4,
          paddingBottom: 5,
          color: fontColor,
          // fontSize: 13,
        },
      }}
    >
      {tabBottomNavs.map((item) => (
        <TabNav.Screen
          key={item.name}
          name={item.name}
          options={item.options}
          component={item.component}
        />
      ))}
    </TabNav.Navigator>
  );
};

const Main = () => {
  const { rootContext, loginState, dispatch } = useRoot();

  useEffect(() => {
    setTimeout(async () => {
      const loginInfo = await Store.get('loginInfo');
      dispatch({
        type: 'updateState',
        payload: { ...loginInfo, isLoading: false, token: 111 },
      });
    }, 500);
  }, [dispatch]);
  const { isLoading, token } = loginState;
  if (isLoading) {
    return <Loading />;
  }

  return (
    <RootContext.Provider value={{ ...rootContext }}>
      <StatusBar style={statusBarStyle} translucent={true} />
      <SafeAreaProvider>
        <NavigationContainer theme={rootContext.theme}>
          <SWRConfig value={swrOptions}>
            <ThemeProvider theme={rootContext.elementsTheme}>
              <RootStack.Navigator
                screenOptions={({ route, navigation }) =>
                  setScreenOptions({ rootContext, route, navigation })
                }
              >
                {token ? (
                  <RootStack.Screen
                    name="Tab"
                    component={TabScreen}
                    options={({ route }) => getTabHeaderConfig(route)}
                  />
                ) : null}
                {rootNavs.map(({ name, component, options }) => {
                  return (
                    <RootStack.Screen
                      key={name}
                      name={name}
                      component={component}
                      options={({ route }) => ({
                        // headerShown: false,
                        ...options,
                        title: route.params?.title || options.title,
                      })}
                    />
                  );
                })}
              </RootStack.Navigator>
            </ThemeProvider>
          </SWRConfig>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootContext.Provider>
  );
};

export default React.memo((props) => <Main {...props} />);
