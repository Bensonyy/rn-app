import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  Fragment,
} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image as Nimage,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  Image,
  CheckBox,
  Input,
  Avatar,
  Text,
  Icon,
  Card as CardEle,
  Button as ButtonEle,
} from 'react-native-elements';
import {
  fontColor,
  subColor,
  primary,
  fontColorHome,
  borderLineColor,
  backgroundColor,
  largeSize,
  smallfontSize,
  subfontSize,
  fontColorWhite,
  placeholderColor,
  widgetSpace,
  defaultBackground,
  fontSize,
} from '../../theme';
import Toast from '../Toast';

import { followGroup, canceCollectGroup } from '../../api';
import { EE, statusBarHeight } from '../../utils';
import { RootContext } from '../Context';

const screenH = Dimensions.get('screen').height;

export const TouchableItem =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

export const FormInput = (props) => {
  const {
    leftIcon = null,
    rightIcon = null,
    refInput = null,
    inputStyle,
    placeholder,
    containerStyle,
    ...otherProps
  } = props;
  const _leftIcon = {
    paddingRight: 15,
    fontSize: 15,
    color: fontColor,
    ...leftIcon,
  };
  return (
    <Input
      {...otherProps}
      multiline={otherProps.secureTextEntry ? false : true}
      ref={refInput}
      leftIcon={
        typeof leftIcon === 'function' ? leftIcon(styles.leftLabel) : _leftIcon
      }
      rightIcon={
        typeof rightIcon === 'function'
          ? rightIcon(styles.rightLabel)
          : rightIcon
      }
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      placeholderFontSize={subfontSize}
      containerStyle={[styles.containerStyle, containerStyle]}
      autoCorrect={false}
      blurOnSubmit={false}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      inputContainerStyle={{ borderBottomColor: borderLineColor }}
      inputStyle={[styles.input, inputStyle]}
    />
  );
};

export const getTabHeaderConfig = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  let title = null;

  switch (routeName) {
    case 'Home':
      title = '首页';
      break;
    case 'MyHome':
      title = '我的';
      break;
    case 'HomeCare':
      title = '医护到家';
      break;
    case 'OnlineConsultation':
      title = '在线问诊';
      break;
    case 'MedicineShop':
      title = '健康商城';
      break;
  }

  return {
    title,
    headerShown: [''].includes(routeName),
  };
};

export const AvatarCom = ({ source, onPress = null, ...rest }) => {
  return (
    <Avatar
      rounded
      size="medium"
      // source={{
      //   uri:
      //     'https://himg.bdimg.com/sys/portrait/item/3b6a3536333630383633318715.jpg',
      // }}
      source={source}
      containerStyle={{
        backgroundColor: fontColorHome,
        padding: 1,
      }}
      activeOpacity={0.7}
      onPress={onPress}
      {...rest}
    />
  );
};

export const TitleCom = ({
  left = null,
  title,
  titleStyle = {},
  right = null,
}) => {
  return (
    <View style={styles.titleRoot}>
      {left ? left() : null}
      <View style={styles.titleBox}>
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
      </View>
      {right ? <right /> : null}
    </View>
  );
};

export const BtnCom = ({
  title,
  containerStyle = {},
  textStyle = {},
  isTouchable = true,
  onPress = null,
}) => {
  const WithTouchable = isTouchable
    ? TouchableOpacity
    : TouchableWithoutFeedback;
  return (
    <WithTouchable onPress={onPress}>
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: primary,
            height: 45,
          },
          containerStyle,
        ]}
      >
        <Text style={[{ color: '#fff', fontSize: 16 }, textStyle]}>
          {title}
        </Text>
      </View>
    </WithTouchable>
  );
};

export const Button = ({
  title = '',
  titleStyle = null,
  type = null,
  isTouchable = true,
  onPress = () => {},
  icon = null,
  buttonStyle = null,
  ...rest
}) => {
  return (
    <ButtonEle
      onPress={onPress}
      icon={icon}
      title={title}
      type={type}
      titleStyle={{
        ...titleStyle,
      }}
      buttonStyle={{
        // borderRadius: 50,
        // backgroundColor: primary,
        ...buttonStyle,
      }}
      {...rest}
    />
  );
};

export const ButtonWithIsLogin = ({ title, callback }) => {
  console.log('ButtonWithIsLogin');
  return (
    <IsLoginWrap callback={callback}>
      <View
        style={{
          borderRadius: 50,
          height: 44,
          backgroundColor: primary,
          ...flexStyle.center,
        }}
      >
        <Text style={{ color: fontColorWhite, fontSize }}>{title}</Text>
      </View>
    </IsLoginWrap>
  );
};

export const BottomComponents = ({
  title = '',
  isTouchable = true,
  source = {},
  buttonStyle = { borderRadius: 50, marginLeft: 12, backgroundColor: primary },
  onPress = () => {},
  icon = null,
  ...rest
}) => {
  return (
    <View style={styles.bottomBox}>
      <TouchableWithoutFeedback
        onPress={() => {
          Toast({
            message: '此功能正在开发中',
          });
        }}
      >
        <Image source={source} style={{ width: 40, height: 42 }} />
      </TouchableWithoutFeedback>
      <ButtonEle
        title={title}
        buttonStyle={buttonStyle}
        containerStyle={{ flex: 1 }}
        onPress={onPress}
      />
    </View>
  );
};
export const CustomMapMarker = ({ style }) => {
  return (
    <Icon
      type={'entypo'}
      containerStyle={style}
      name="location-pin"
      size={40}
      color={primary}
    />
  );
};

export const Card = ({
  isRadius = true,
  containerStyle = {},
  children,
  ...rest
}) => {
  return (
    <CardEle
      containerStyle={[
        isRadius ? styles.cardWrap : null,
        containerStyle,
        { margin: 0 },
      ]}
      wrapperStyle={{
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'red',
        shadowOffset: { height: 0, width: 0 },
      }}
      {...rest}
    >
      {children}
    </CardEle>
  );
};

/**
 * 单选组件
 * @param {*} props
 */
export const Radio = ({ initData = 0, radioData, callback = (idx) => {} }) => {
  const { radioGroup } = radioData;
  const [selectIndex, setSelectedIndex] = useState(initData);
  useEffect(() => {
    setSelectedIndex(initData);
  }, [initData]);
  useEffect(() => {
    callback({ selectIndex });
  }, [selectIndex]);

  return (
    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
      {radioGroup.map((item, index) => {
        return (
          <CheckBox
            key={index}
            center
            title={item.name}
            textStyle={{
              fontSize: 16,
              color: subColor,
              fontWeight: 'normal',
              marginLeft: 0,
            }}
            containerStyle={{
              backgroundColor: backgroundColor,
              borderColor: 'transparent',
              padding: 0,
              marginLeft: 0,
            }}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            size={22}
            checkedColor={primary}
            checked={selectIndex === item.index ? true : false}
            onPress={() => {
              setSelectedIndex(index);
            }}
          />
        );
      })}
    </View>
  );
};

export const IsLoginWrap = ({ children, callback = () => {} }) => {
  const navigation = useNavigation();
  const { getLoginInfo } = useContext(RootContext);
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchLoginInfo = async () => {
      const loginInfo = await getLoginInfo();
      const token = loginInfo?.token ?? false;
      const userId = loginInfo?.userId;
      setIsLogin(!!token);
      setUserId(userId);
      callback({ isLogin: !!token, userId, token });
    };
    fetchLoginInfo();
    return () => {};
  }, [callback, getLoginInfo]);

  if (isLogin) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Login', { action: 'back' });
        setTimeout(() => callback({ isLogin, userId }), 500);
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
export const GroupCard = ({
  headDoctorInfo = {},
  groupName,
  groupHead,
  callback = () => {},
  groupIntroduce,
  doctorList = [],
}) => {
  return (
    <TouchableWithoutFeedback onPress={callback}>
      <Card containerStyle={styles.cardView}>
        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
          <AvatarCom
            source={{
              uri: groupHead,
            }}
            size="medium"
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: 5,
            }}
          >
            <Text style={styles.groupName} numberOfLines={1}>
              {groupName}{' '}
              <Text style={styles.subFontStyle}>
                {headDoctorInfo?.professionalTitle}
              </Text>
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.subFontStyle, { paddingVertical: 5 }]}
            >
              {headDoctorInfo?.hospitalName}{' '}
              <Text>{headDoctorInfo?.deptName}</Text>
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {doctorList.map((item, index) => {
                return (
                  <AvatarCom
                    source={{
                      uri: item.doctorAvater || item.nusersAvater,
                    }}
                    size="small"
                    key={index}
                  />
                );
              })}
            </View>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 5,
            paddingBottom: 5,
          }}
        >
          <Text style={styles.groupLabel}>擅长：</Text>
          <Text numberOfLines={1} style={[styles.goodText, { flex: 1 }]}>
            {groupIntroduce}
          </Text>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};
export const GroupInfoComponent = ({
  headDoctorInfo = {},
  isCollect = false,
  groupId,
  isCanCancel = true,
  styleObj = {},
  size = 'large',
  onClickAvatarCom = () => {},
}) => {
  const [focusOn, setFocus] = useState(isCollect);
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState(null);

  const {
    doctorAvater,
    doctorName,
    deptName,
    hospitalName,
    professionalTitle,
  } = headDoctorInfo || {};

  useEffect(() => {
    setFocus(isCollect);
    return () => {};
  }, [isCollect]);

  const onFollow = useCallback(async () => {
    const { result, data, message } = await followGroup.fetch({
      groupId: groupId,
      userId: userId,
    });
    if (result === 'success') {
      Toast({ message: '关注成功' });
      setFocus(true);

      EE.emit('setIsCollect', { isCollect: true, groupId });
    }
  }, [groupId, userId]);

  const onUnFollow = useCallback(async () => {
    const { result, data, message } = await canceCollectGroup.fetch({
      groupId: groupId,
      userId: userId,
    });
    if (result === 'success') {
      Toast({ message: '取消关注成功' });
      setFocus(false);
      EE.emit('setIsCollect', { isCollect: false, groupId });
    }
  }, [groupId, userId]);

  const onLoginCallback = useCallback(({ isLogin, userId }) => {
    setIsLogin(isLogin);
    setUserId(userId);
  }, []);

  let _onPress = () => {};

  if (isLogin && isCanCancel) {
    _onPress = focusOn ? onUnFollow : onFollow;
  }

  return (
    <View>
      <View style={[flexStyle.row, styleObj]}>
        <TouchableWithoutFeedback onPress={onClickAvatarCom}>
          <AvatarCom
            source={{
              uri: doctorAvater,
            }}
            size={size}
            avatarStyle={{ borderWidth: 1, borderColor: '#f6f6f6' }}
          />
        </TouchableWithoutFeedback>

        <View
          style={{
            paddingLeft: widgetSpace,
            flex: 3,
            justifyContent: 'space-around',
          }}
        >
          <View>
            <Text style={styles.doctorName}>{doctorName}</Text>
          </View>
          <Text>
            {deptName} {professionalTitle}
          </Text>
          <Text>{hospitalName}</Text>
        </View>
        <View>
          {isLogin ? (
            <Button
              onPress={_onPress}
              title={focusOn ? '已关注' : '关注'}
              buttonStyle={{
                height: 28,
                width: 75,
                backgroundColor: focusOn ? primary : 'transparent',
              }}
              titleStyle={{
                fontSize: smallfontSize,
                color: focusOn ? fontColorWhite : primary,
              }}
              type={focusOn ? 'solid' : 'outline'}
              icon={
                focusOn ? null : (
                  <Icon
                    type={'antdesign'}
                    name="plus"
                    size={15}
                    color={focusOn ? fontColorHome : primary}
                  />
                )
              }
            />
          ) : (
            <IsLoginWrap callback={onLoginCallback}>
              <View
                style={{
                  height: 28,
                  width: 75,
                  borderRadius: 50,
                  borderStyle: 'solid',
                  borderColor: primary,
                  borderWidth: 1,
                }}
              >
                <View style={{ ...flexStyle.row, ...flexStyle.center }}>
                  <Icon
                    type={'antdesign'}
                    name="plus"
                    size={15}
                    color={primary}
                  />
                  <Text style={{ fontSize: smallfontSize, color: primary }}>
                    关注
                  </Text>
                </View>
              </View>
            </IsLoginWrap>
          )}
        </View>
      </View>
    </View>
  );
};

export const LeftBackBtn = ({ navigation, ...rest }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Icon
          type={'entypo'}
          name="chevron-thin-left"
          size={24}
          color={fontColorHome}
        />
      </View>
    </TouchableOpacity>
  );
};

/**
 * FlatList 分割线
 */
export const ItemDivide = () => {
  return <View style={{ height: 1, backgroundColor: borderLineColor }} />;
};

/**
 * FlatList EmptyView
 */
export const EmptyView = ({ source = {} }) => {
  return (
    <View
      style={{
        height: screenH - statusBarHeight - 56,
        paddingTop: 100,
        backgroundColor: defaultBackground,
        alignItems: 'center',
      }}
    >
      <Nimage source={source} style={{ height: 300, width: 300 }} />
    </View>
  );
};

export const flexStyle = {
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
  },
  titleRoot: { flexDirection: 'row', alignItems: 'center' },
  titleBox: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    color: fontColor,
  },
  leftLabel: {
    paddingRight: 15,
    fontSize: 15,
    color: fontColor,
  },
  rightLabel: {
    paddingLeft: 10,
    fontSize: 15,
    color: fontColor,
  },
  cardWrap: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 2,
    color: 'red',
    borderColor: 'transparent',
  },
  bottomBox: {
    paddingHorizontal: 20,
    marginVertical: 50,
    display: 'flex',
    flexDirection: 'row',
  },
  doctorName: {
    color: fontColor,
    fontSize: largeSize,
  },
  cardView: {
    display: 'flex',
    marginBottom: 8,
  },
  groupName: { color: fontColor, fontSize: subfontSize },
  subFontStyle: { color: subColor, fontSize: smallfontSize },
  groupLabel: {
    paddingBottom: 10,
    color: fontColor,
    fontSize: smallfontSize,
  },
  goodText: {
    color: subColor,
    fontSize: smallfontSize,
  },
});
