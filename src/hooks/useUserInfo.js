import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import { getUserInfo } from '../api';

const useUserInfo = ({ userId = '' } = {}) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getUserInfo.fetch(userId);
      if (result === 'success') {
        setUserInfo(data);
      }
    };
    fetchData();
    return () => {};
  }, [userId]);

  return userInfo;
};

export default useUserInfo;
