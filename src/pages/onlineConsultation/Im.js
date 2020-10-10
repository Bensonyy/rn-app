import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ImChat } from '../../components';
import { useUserInfo } from '../../hooks';

const avatar =
  'http://39.100.100.138/group1/M00/00/01/rBrFpl9pu9aAFBNRAAAxNTHBoIg38..png';

const ImChatCom = () => {
  const route = useRoute();
  const { userId, doctorInfo, token, medicalId, consulType, routeParams } =
    route.params || {};
  const { doctorId, doctorName, doctorAvater } = doctorInfo || {};
  const userInfo = useUserInfo({ userId });

  const { userPrimary = {} } = userInfo;
  const { userNickname, userAvater } = userPrimary;

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
  return <ImChat {..._props} />;
};

export default ImChatCom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
