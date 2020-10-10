import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Icon } from 'react-native-elements';
import { RootContext } from '../Context';
import { AvatarCom, Button, flexStyle, TouchableItem } from '../Shared';
import {
  fontSize,
  smallfontSize,
  fontColorHome,
  contentSpace,
  widgetSpace,
} from '../../theme';

const WIDTH = Dimensions.get('screen').width;

const RightWidget = ({
  groupInfo,
  recommendCount,
  isLike,
  isCollect,
  loveCount,
  onLike,
  onFollow,
  readCount,
}) => {
  const navigation = useNavigation();
  const { getLoginInfo } = useContext(RootContext);
  const toLogin = (navigateName, title) => {
    navigation.navigate('Login', {
      navigateTo: navigateName,
      titleTo: title,
      groupInfo,
    });
  };

  const onNavigate = useCallback(
    async ({ navigateName, title }) => {
      const loginInfo = await getLoginInfo();
      const isLogin = loginInfo && loginInfo.token;
      switch (navigateName) {
        //关注团队
        case 'Follow':
          if (isLogin) {
            onFollow(loginInfo.userId);
          } else {
            navigation.navigate('Login', {
              options: 'back',
            });
          }
          break;

        //点赞
        case 'Like':
          if (isLogin) {
            onLike(isLike, loginInfo.userId);
          } else {
            navigation.navigate('Login', {
              options: 'back',
            });
          }
          break;

        //医护
        case 'HomeCare':
          navigation.navigate(navigateName, { title, groupInfo });
          // if (isLogin) {
          //   navigation.navigate(navigateName, { title, groupInfo });
          // } else {
          //   toLogin(navigateName, title);
          // }
          break;
        //在线问诊
        case 'OnlineConsultation':
          navigation.navigate(navigateName, { title, groupInfo });
          break;
        default:
          console('无法跳转,请检查参数...');
          break;
      }
    },
    [getLoginInfo, isLike, loveCount]
  );

  return (
    <View style={styles.container}>
      <View style={styles.btnContainerStyle}>
        <TouchableWithoutFeedback
          onPress={() =>
            onNavigate({
              navigateName: 'HomeCare',
              title: groupInfo.groupDoctorName,
            })
          }
        >
          <Image
            source={require('./img/doorhouse.png')}
            style={styles.btnImg}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            onNavigate({
              navigateName: 'OnlineConsultation',
              title: groupInfo.groupDoctorName,
            })
          }
        >
          <Image
            source={require('./img/consultation.png')}
            style={styles.btnImg}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default React.memo(RightWidget);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 0,
  },
  btnContainerStyle: {
    ...flexStyle.col,
    ...flexStyle.spaceBetween,
    height: 150,
  },
  btnImg: {
    width: 110,
    height: 60,
  },
  displayNone: {
    display: 'none',
  },
});
