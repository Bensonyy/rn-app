import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { RootContext } from '../Context';
import { AvatarCom, Button, flexStyle } from '../Shared';
import {
  fontSize,
  smallfontSize,
  fontColorHome,
  contentSpace,
  widgetSpace,
  primary,
} from '../../theme';
import Toast from '../Toast';

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
  seekableDuration,
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
              action: 'back',
            });
          }
          break;

        //点赞
        case 'Like':
          if (isLogin) {
            onLike(isLike, loginInfo.userId);
          } else {
            navigation.navigate('Login', {
              action: 'back',
            });
          }
          break;

        //医护
        case 'HomeCare':
          if (isLogin) {
            navigation.navigate(navigateName, { title, groupInfo });
          } else {
            toLogin(navigateName, title);
          }
          break;

        default:
          console('无法跳转,请检查参数...');
          break;
      }
    },
    [getLoginInfo, isLike, loveCount]
  );

  return (
    <View style={styles.root}>
      <View style={styles.rowContainer}>
        <View style={[styles.avatarBox]}>
          <View style={{ width: 48 }}>
            <AvatarCom
              source={{ uri: groupInfo?.groupHead }}
              onPress={() =>
                navigation.navigate('Profile', {
                  groupId: groupInfo.groupId,
                })
              }
            />
          </View>
          <View style={{ paddingLeft: widgetSpace, flex: 1, minWidth: 205 }}>
            <Text style={[styles.text, { fontSize }]}>
              {groupInfo?.groupDoctorName}
            </Text>
            <Text
              style={[styles.text, { fontSize: smallfontSize }]}
              numberOfLines={1}
            >
              {`${groupInfo?.headDoctorInfo?.deptName}\n\n`}
              {groupInfo?.headDoctorInfo?.professionalTitle}
            </Text>
          </View>
        </View>
        <View style={[flexStyle.center, { width: 60, alignItems: 'flex-end' }]}>
          <Button
            onPress={() => {
              isCollect
                ? null
                : onNavigate({
                    navigateName: 'Follow',
                  });
            }}
            title={isCollect ? '已关注' : '关注'}
            buttonStyle={{
              height: 28,
              width: 75,
              borderColor: isCollect ? primary : fontColorHome,
              backgroundColor: isCollect ? primary : 'transparent',
            }}
            titleStyle={{ fontSize: smallfontSize, color: fontColorHome }}
            type={isCollect ? 'solid' : 'outline'}
            icon={
              isCollect ? null : (
                <Icon
                  type={'antdesign'}
                  name="plus"
                  size={15}
                  color={fontColorHome}
                />
              )
            }
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={[styles.rowContainer, { marginTop: 16 }]}>
          {/* 观看次数 */}
          <WidgetItem
            imgUrl={require('./img/icon_home_watch.png')}
            text={readCount}
            containerStyle={{ marginRight: 40 }}
          />

          {/* 视频时长 */}
          <WidgetItem
            imgUrl={require('./img/icon_home_duration.png')}
            text={`${seekableDuration && seekableDuration.toFixed(0)}s`}
          />
        </View>

        <View
          style={[
            styles.rowContainer,
            { justifyContent: 'flex-end', marginTop: 16 },
          ]}
        >
          {/* 点赞 */}
          <WidgetItem
            imgUrl={
              isLike
                ? require('./img/ic_like_select.png')
                : require('./img/ic_like_normal.png')
            }
            text={loveCount}
            containerStyle={{ marginRight: 40 }}
            onPress={() => {
              onNavigate({
                navigateName: 'Like',
              });
            }}
          />
          {/* 分享 */}
          <WidgetItem
            imgUrl={require('./img/ic_home_share.png')}
            text={recommendCount}
            onPress={() => {
              Toast({ message: '此功能正在开发中' });
            }}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * 视频顶部小图标控件
 * @param {*} props
 */
const WidgetItem = (props) => {
  const { imgUrl, text, containerStyle, onPress = null } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ alignItems: 'center' }, containerStyle]}>
        <Image
          source={imgUrl}
          style={{
            height: 20,
            width: 20,
          }}
        />
        <Text style={[styles.countNumber, { marginTop: 2 }]}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(RightWidget);

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: contentSpace + 22,
    width: WIDTH,
  },
  rowContainer: {
    paddingHorizontal: contentSpace,
    ...flexStyle.row,
  },
  profile: {
    position: 'absolute',
    bottom: 15,
    paddingHorizontal: 15,
  },
  item: {
    marginTop: -10,
    marginLeft: 20,
  },
  itemText: {
    marginTop: 10,
    marginRight: 20,
  },
  countNumber: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    marginTop: 15,
  },
  avatarBox: {
    flex: 1,
    flexDirection: 'row',
  },
  addBox: {
    position: 'absolute',
    right: 14,
    bottom: 3,
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 10,
    paddingBottom: 2,
    zIndex: 2,
    backgroundColor: 'red',
  },
  text: {
    color: fontColorHome,
  },
  displayNone: {
    display: 'none',
  },
});
