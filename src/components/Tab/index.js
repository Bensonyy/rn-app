import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableHighlight,
} from 'react-native';
import { flexStyle } from '../Shared';
import { tabHeight } from '../../config';
import { primary, subColor, tabBackgroundColor } from '../../theme';

const tabIcons = {
  VideoChat: {
    iconName: 'tab_guide',
    icon: require('./img/tab_guide.png'),
    iconActive: require('./img/tab_guide_active.png'),
  },
  BookingReg: {
    iconName: 'bookreg',
    icon: require('./img/bookreg.png'),
    iconActive: require('./img/bookreg_active.png'),
  },
  Home: {
    iconName: 'tab_home',
    icon: require('./img/tab_home1.png'),
    iconActive: require('./img/tab_home1_active.png'),
  },
  MedicineShop: {
    iconName: 'tab_stores',
    icon: require('./img/tab_stores.png'),
    iconActive: require('./img/tab_stores_active.png'),
  },
  MyHome: {
    iconName: 'tab_my',
    icon: require('./img/tab_my.png'),
    iconActive: require('./img/tab_my_active.png'),
  },
};

const Tab = ({ state, descriptors, navigation }) => {
  const { routes } = state;
  return (
    <View style={styles.container}>
      {routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
            key={index}
          >
            <View
              style={
                index === 2 ? [styles.item, styles.itemCenter] : styles.item
              }
            >
              <Image
                source={
                  isFocused
                    ? tabIcons[route.name].iconActive
                    : tabIcons[route.name].icon
                }
                style={
                  index === 2 //中间凸起的图标
                    ? {
                        height: 42,
                        width: 42,
                      }
                    : {
                        backgroundColor: tabBackgroundColor,
                        width: 24,
                        height: 24,
                      }
                }
              />
              <Text
                style={{
                  color: isFocused ? primary : subColor,
                  fontSize: 13,
                  marginTop: index === 2 ? -3 : 0,
                }}
              >
                {label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: tabHeight,
  },
  item: {
    ...flexStyle.center,
  },
  itemCenter: {
    marginTop: -13,
  },

  centerImg: {
    backgroundColor: tabBackgroundColor,
    borderRadius: 22,
  },
});
