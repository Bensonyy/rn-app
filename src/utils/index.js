import { Platform } from 'react-native';
import Constants from 'expo-constants';
import jsbridge from './jsbridge.min';
import EE from './eventEmit';
import request from './request';
import Store from './store';

const OS = Platform.OS;

const statusBarHeight = Constants.statusBarHeight;

const getLoginInfo = async () => {
  return await Store.get('loginInfo');
};

const removeLoginInfo = async () => {
  return await Store.remove('loginInfo');
};

const isMobile = (v) => {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(v);
};

/**
 * num:0 YYYY-MM-DD
 * num:1 YYYY-MM-DD hh:mm:ss
 * timestamp:时间戳
 */
const timeConvert = (timestamp, num) => {
  if (
    typeof timestamp === 'undefined' ||
    timestamp === null ||
    timestamp === ''
  ) {
    return;
  }
  timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
  let date = new Date(timestamp);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  if (num == 0) {
    return y + '-' + m + '-' + d;
  } else {
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
};

/**
 * 设置手机号码后面8位为x
 */
const hidePhoneNumber = (phoneNumber) => {
  if (phoneNumber?.length > 3) {
    return `${phoneNumber.substr(0, 3)}xxxxxxxx`;
  } else {
    return phoneNumber;
  }
};

/**
 * 设置身份证号码中间号码为*
 * @param {*} idCardNumber
 */
const hideIdCard = (idCardNumber) => {
  if (idCardNumber?.length === 18) {
    return idCardNumber.replace(/^(\d{4})\d{10}(\d+)/, '$1**********$2');
  } else {
    return idCardNumber;
  }
};

/**
 * 分转化为元
 */
const centToYuan = (cent) => {
  return cent * 0.01;
};

export {
  jsbridge,
  EE,
  request,
  Store,
  OS,
  statusBarHeight,
  getLoginInfo,
  removeLoginInfo,
  isMobile,
  timeConvert,
  hidePhoneNumber,
  hideIdCard,
  centToYuan,
};
