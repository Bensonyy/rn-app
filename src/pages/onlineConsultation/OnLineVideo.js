import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { OnLineVideo } from '../../components';
import { useUserInfo } from '../../hooks';

const avatar = require('../my/img/avatar/ic_avatar.png');

const OnLineV = () => {
  const route = useRoute();
  const { userId, doctorInfo, token, medicalId, consulType, routeParams } =
    route.params || {};
  const { doctorId, doctorName, doctorAvater } = doctorInfo || {};
  const userInfo = useUserInfo({ userId });

  const { userPrimary = {} } = userInfo;
  const { userNickname, userAvater } = userPrimary || {};

  const _props = {
    fromUserId: userId,
    fromUserName: userNickname,
    fromAvatar: userAvater === null ? avatar : null,
    toUserId: doctorId,
    toUserName: doctorName,
    toAvatar: doctorAvater,
    token,
    medicalId,
    consulType,
    routeParams,
  };

  if (!userId || !doctorId) {
    return null;
  }

  return <OnLineVideo {..._props} />;
};

export default OnLineV;
