import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import {
  Content,
  FormInput,
  Toast,
  Card,
  TouchableItem,
  ProjectList,
  RootContext,
  Radio,
  BottomComponents,
} from '../../components';
import { useForm, Controller } from 'react-hook-form';
import Picker from 'react-native-picker';
import area from '../../config/area.json';
import {
  fontSize,
  fontColor,
  borderLineColor,
  subColor,
  subfontSize,
  projectColor,
  primary,
  tagSize,
  placeholderColor,
  smallfontSize,
} from '../../theme';
import dayjs from 'dayjs';
import {
  getSystemCurTime,
  createOrder,
  getDefaultAddress,
  getDefaultMember,
} from '../../api';
import { useNavigation, useRoute } from '@react-navigation/native';
const SelectTime = () => {
  // const selected = ['海南', '三亚', '海棠区'];
  const radioData = {
    radioGroup: [
      { index: 0, name: '本人' },
      { index: 1, name: '亲属' },
      { index: 2, name: '其他' },
    ],
  };
  const radioData2 = {
    radioGroup: [
      { index: 0, name: '男性' },
      { index: 1, name: '女性' },
    ],
  };
  const mapSex = {
    0: '1',
    1: '2',
  };
  const mapRelation = {
    0: '01',
    1: '02',
    2: '03',
  };
  const mapErrorText = {
    credentialsNum: '身份证号码不能为空',
    detailsAddress: '请填写详细地址',
    linkName: '请填写您的名字',
    linkTel: '请填写联系方式',
    userName: '请输入就诊人名字',
  };
  const { getLoginInfo } = useContext(RootContext);
  const [serviceTime, setServiceTime] = useState(null);
  const [selectDateIndex, setselectDateIndex] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [areaArray, setAreaArray] = useState([]);
  const [isDefault, setDefault] = useState(1);
  const [isAddressDefault, setIsAddressDefault] = useState(1);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [radioIndex, setradioIndex] = useState(0);
  const [relationIndex, setRelationIndex] = useState(0);
  const [linkName, setLinkName] = useState(null);
  const [selected, setSelected] = useState(['海南', '三亚', '海棠区']);
  const [userId, setUserId] = useState(null);
  const userIdRef = useRef(userId);
  const navigation = useNavigation();
  const route = useRoute();
  const itemInfo = route?.params?.itemInfo;
  const addressInfo = route?.params?.addressInfo;
  const { control, handleSubmit, errors, setValue, getValues } = useForm({
    defaultValues: {},
  });
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getSystemCurTime.fetch();
      if (result === 'success') {
        setServiceTime(data);
      }
    };
    const fetchUserId = async () => {
      const loginInfo = await getLoginInfo();
      const userId = loginInfo?.userId;
      userIdRef.current = userId;
      setUserId(userId);
    };
    fetchData();
    fetchUserId();
  }, []);
  useEffect(() => {
    const fetchAddressInfo = async () => {
      const { result, data, message } = await getDefaultAddress.fetch(
        userIdRef.current
      );
      const initData = addressInfo ? addressInfo : data;
      const rela =
        initData?.relation == undefined ? 0 : Number(initData?.relation) - 1;
      setValue('linkName', initData?.linkName);
      setValue('linkTel', initData?.linkTel);
      setRelationIndex(rela);
      setLocation(`${initData?.longitude},${initData?.latitude}`);
      setAreaName(
        `${initData?.provinceName}${initData?.cityName}${initData?.countyName}`
      );
      setAreaArray([
        initData?.provinceName,
        initData?.cityName,
        initData?.countyName,
      ]);
      setValue('detailsAddress', initData?.streetAddress);
    };
    fetchAddressInfo();
  }, [addressInfo, userIdRef.current]);
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getDefaultMember.fetch(
        userIdRef.current
      );
      const memberData = itemInfo ? itemInfo : data;
      const sexNum =
        memberData?.memberSex === '1' || memberData?.memberSex == undefined
          ? 0
          : 1;
      setValue('userName', memberData?.memberName);
      setValue('credentialsNum', memberData?.credentialsNum);
      setValue('userSex', sexNum);
      setradioIndex(sexNum);
    };
    fetchData();
  }, [itemInfo, userIdRef.current]);
  const getValidate = () => {
    const formInfo = getValues();
    // let flag = false;
    for (let item in formInfo) {
      if (!formInfo[item]) {
        Toast({ message: mapErrorText[item] });
      } else if (selectDateIndex === null) {
        Toast({ message: ' 请选择时间' });
      } else {
        return true;
      }
    }
  };
  const _handleSubmit = () => {
    getValidate() && handleSubmit(onSubmit)();
  };
  const onSubmit = async (fetchData) => {
    const [provinceName, cityName, countyName] = areaArray;
    const relation = mapRelation[fetchData.relation];
    const userSex = mapSex[fetchData.userSex];
    const detailsArray = location.split(',');
    const [longitude, latitude] = detailsArray;
    const { orderDate, orderTime } = getDays()[selectDateIndex];
    const hospitalId = route.params.hospitalId;
    const { projectId, projectName, groupId } = route?.params?.projectObj;
    const pramsData = {
      ...fetchData,
      userId,
      orderDate,
      orderTime,
      longitude,
      latitude,
      provinceName,
      cityName,
      countyName,
      hospitalId,
      projectId,
      projectName,
      provideId: groupId,
      isDefault: isDefault ? 1 : 0,
      relation,
      userSex,
      userAddr: fetchData.detailsAddress,
    };
    console.log(pramsData, '参数');
    const { result, data, message } = await createOrder.fetch(pramsData);
    if (result === 'success') {
      navigation.navigate('OrderPage', {
        orderId: data,
      });
    }
  };
  const getDays = useCallback(() => {
    let _newDayArr = [];
    const day = dayjs(serviceTime);
    const dayArr = new Array(4).fill(1).reduce((memo, _, index) => {
      const _day = day.add(index, 'day');
      return [...memo, _day];
    }, []);
    const weekObj = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
    };
    dayArr.map((item, index) => {
      const count = dayjs(item).day();
      _newDayArr.push({
        orderDate: dayjs(item).format('YYYY-MM-DD'),
        date: dayjs(item).format('MM月DD日'),
        week: weekObj[count],
        time: '上午',
        schedule: '8:00-12:00',
        orderTime: `${weekObj[count]} 上午 8:00-12:00`,
      });
      _newDayArr.push({
        orderDate: dayjs(item).format('YYYY-MM-DD'),
        date: dayjs(item).format('MM月DD日'),
        time: '下午',
        week: weekObj[count],
        schedule: '14:00-18:00',
        orderTime: `${weekObj[count]} 下午 14:00-18:00`,
      });
    });
    return _newDayArr;
  }, [serviceTime]);
  const createAreaData = () => {
    let data = [];
    let len = area.length;
    for (let i = 0; i < len; i++) {
      let city = [];
      for (let j = 0, cityLen = area[i].city.length; j < cityLen; j++) {
        let _city = {};
        _city[area[i].city[j].name] = area[i].city[j].area;
        city.push(_city);
      }

      let _data = {};
      _data[area[i].name] = city;
      data.push(_data);
    }
    return data;
  };
  const handleCallback = useCallback((index) => {
    setselectDateIndex(index);
  }, []);
  //就诊人信息
  const patient = () => {
    return (
      <View style={{ marginTop: 16 }}>
        <View style={styles.choiceBox}>
          <View style={styles.blueCircle}></View>
          <Text style={styles.choiceTitle}>请输入就诊人信息</Text>
          <TouchableItem
            onPress={() => {
              navigation.navigate('PatientList', {
                navigateTo: 'SelectTime',
              });
            }}
          >
            <View style={styles.queryAll}>
              <Text>就诊人管理</Text>
              <Icon
                type={'antdesign'}
                name="right"
                size={14}
                color={'#666666'}
              />
            </View>
          </TouchableItem>
        </View>
        <View style={styles.container}>
          {/* <View style={styles.space} /> */}
          {/* 姓名 */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <FormInput
                placeholder="请填写真实姓名"
                containerStyle={styles.formInputStyle}
                inputStyle={styles.input}
                onBlur={onBlur}
                leftIcon={() => (
                  <View style={styles.inputLeft}>
                    <Text style={styles.inputLeftText}>您的姓名</Text>
                    <Text style={styles.requireFlag}>*</Text>
                  </View>
                )}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="userName"
            // rules={{ required: true }}
          />
          {errors.userName?.type === 'required' && (
            <Text style={styles.errorText}>请填写就诊人姓名</Text>
          )}
          {/* 就诊人性别 */}
          <View style={[styles.sex, styles.otherMargin]}>
            <View style={[styles.inputLeft, styles.disance]}>
              <Text style={styles.inputLeftText}>您的性别</Text>
              <Text style={styles.requireFlag}>*</Text>
            </View>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Radio
                  initData={radioIndex}
                  radioData={radioData2}
                  callback={({ selectIndex }) => onChange(selectIndex)}
                />
              )}
              name="userSex"
            />
          </View>

          <Divider style={[styles.otherLine, { marginHorizontal: 10 }]} />

          {/* 身份证号码 */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <FormInput
                placeholder="请填写身份证号码"
                containerStyle={styles.formInputStyle}
                inputStyle={styles.input}
                maxLength={18}
                keyboardType="numeric"
                onBlur={onBlur}
                leftIcon={() => (
                  <View style={styles.inputLeft}>
                    <Text style={styles.inputLeftText}>身份证号</Text>
                    <Text style={styles.requireFlag}>*</Text>
                  </View>
                )}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="credentialsNum"
            // rules={{
            //   required: true,
            //   pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/g,
            // }}
          />
          {/* 设置默认地址 */}
          <TouchableWithoutFeedback
            onPress={() => {
              setDefault(!isDefault);
            }}
          >
            <View style={styles.setPatientView}>
              <Image
                style={styles.optAddressImage}
                source={
                  isDefault
                    ? require('../../assets/ic_radio_select.png')
                    : require('../../assets/ic_radio_normal.png')
                }
              />
              <Text style={styles.optPatient}>设置为默认就诊人</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };
  // 表单
  const renderForm = () => {
    return (
      <View style={{ paddingLeft: 22, paddingRight: 20 }}>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              placeholder="请填写真实姓名"
              inputContainerStyle={{
                borderBottomColor: borderLineColor,
                marginTop: 10,
              }}
              containerStyle={styles.formInputStyle}
              inputStyle={styles.input}
              onBlur={onBlur}
              leftIcon={() => (
                <View style={styles.inputLeft}>
                  <Text style={styles.inputLeftText}>您的姓名</Text>
                  <Text style={styles.requireFlag}>*</Text>
                </View>
              )}
              onChangeText={(value) => {
                onChange(value);
                setLinkName(value);
              }}
              value={value}
            />
          )}
          name="linkName"
          // rules={{ required: true }}
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              placeholder="请填写手机号码"
              inputContainerStyle={{ borderBottomColor: borderLineColor }}
              containerStyle={[styles.formInputStyle, styles.inputBottom]}
              inputStyle={styles.input}
              maxLength={11}
              keyboardType="numeric"
              onBlur={onBlur}
              leftIcon={() => (
                <View style={styles.inputLeft}>
                  <Text style={styles.inputLeftText}>联系方式</Text>
                  <Text style={styles.requireFlag}>*</Text>
                </View>
              )}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="linkTel"
          // rules={{ required: true, pattern: /^1(3|4|5|6|7|8|9)\d{9}$/ }}
        />
        {errors.linkTel?.type === 'required' && (
          <Text style={styles.errorText}>请填写手机号</Text>
        )}
        {errors.linkTel?.type === 'pattern' && (
          <Text style={styles.errorText}>手机号格式不正确</Text>
        )}
        <View style={styles.relateView}>
          <View style={styles.relate}>
            <Text style={styles.inputLeftText}>就诊关系</Text>
            <Text style={styles.requireFlag}>*</Text>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Radio
                initData={relationIndex}
                radioData={radioData}
                callback={({ selectIndex }) => onChange(selectIndex)}
              />
            )}
            name="relation"
          />
          <Divider style={[styles.otherLine, { marginRight: 10 }]} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            Picker.init({
              pickerTitleText: '省市区',
              pickerConfirmBtnText: '确定',
              pickerCancelBtnText: '取消',
              pickerData: createAreaData(),
              selectedValue: selected,
              onPickerConfirm: (pickedValue) => {
                setSelected(pickedValue);
                setAreaName(
                  `${pickedValue[0]}${pickedValue[1]}${pickedValue[2]}`
                );
                setAreaArray(pickedValue);
              },
            });
            Picker.show();
          }}
        >
          <View style={styles.addressView}>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <View style={styles.addressLeft}>
                <Text style={styles.inputLeftText}>省市县区</Text>
                <Text style={styles.requireFlag}>*</Text>
              </View>
              {areaName == 'undefinedundefinedundefined' ? (
                <Text style={styles.placeholderStyle}>
                  请选择所在的省份市县及区
                </Text>
              ) : (
                <Text style={styles.textStyle}>{areaName}</Text>
              )}
            </View>
            <Icon type={'antdesign'} name="right" size={18} color={'#666666'} />
          </View>
        </TouchableWithoutFeedback>
        <Divider style={[styles.otherLine, { marginHorizontal: 10 }]} />
        <View style={styles.detailsAddress}>
          <View style={{ flex: 1 }}>
            <View style={styles.addressLeft}>
              <Text style={styles.inputLeftText}>详细地址</Text>
              <Text style={styles.requireFlag}>*</Text>
            </View>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormInput
                  placeholder="请输入街道/小区/楼栋/房号"
                  onBlur={onBlur}
                  inputStyle={{
                    fontSize: subfontSize,
                    marginLeft: -20,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: borderLineColor,
                  }}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  rightIcon={
                    <TouchableWithoutFeedback
                      onPress={() =>
                        navigation.navigate('Map', {
                          callback: ({
                            location,
                            pname,
                            cityname,
                            address,
                            name,
                          }) => {
                            onChange(location);
                            setAddress(`${address}${name}`);
                            setValue('detailsAddress', `${address}${name}`);
                            setLocation(location);
                          },
                        })
                      }
                    >
                      <View style={{ position: 'relative', bottom: 26 }}>
                        <Icon
                          type={'antdesign'}
                          name="enviromento"
                          size={24}
                          color={'#666666'}
                        />
                        <Text style={{ color: projectColor, fontSize: 12 }}>
                          定位
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  }
                />
              )}
              name="detailsAddress"
            />
            <TouchableWithoutFeedback
              onPress={() => {
                setIsAddressDefault(!isAddressDefault);
              }}
            >
              <View style={styles.setAddressView}>
                <Image
                  style={styles.optAddressImage}
                  source={
                    isAddressDefault
                      ? require('../../assets/ic_radio_select.png')
                      : require('../../assets/ic_radio_normal.png')
                  }
                />
                <Text style={styles.optAddress}>设置为默认地址</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };
  return (
    <Content type="full" showBg={true}>
      <Card
        containerStyle={{
          marginTop: -35,
          marginHorizontal: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={styles.topBox}>
          <View style={styles.dateContainer}>
            <Text style={styles.fontStyle}>已选服务项目</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                type={'antdesign'}
                name="questioncircle"
                size={14}
                color={'#c8e07f'}
              />
              <Text style={{ paddingHorizontal: 10 }}>医护上门须知</Text>
            </View>
          </View>
          <Divider style={[styles.line]} />
          <View>
            <Text style={styles.groupLabel}>
              医护团队：
              <Text style={styles.groupName}>{route?.params?.groupTitle}</Text>
            </Text>
            <Text style={styles.groupLabel}>
              服务项目：
              <Text style={styles.groupName}>
                {route?.params?.projectObj?.projectName}
              </Text>
            </Text>
          </View>
        </View>
      </Card>
      <ProjectList
        groupProject={getDays()}
        type="date"
        title="请选择上门时间"
        isTip={true}
        callback={({ selectIndex }) => handleCallback(selectIndex)}
      />
      <View style={styles.maxBorder}></View>
      <View style={{ marginTop: 20 }}>
        <View style={styles.choiceBox}>
          <View style={styles.blueCircle}></View>
          <Text style={styles.choiceTitle}>请选择联系人及地址</Text>
          <TouchableItem
            onPress={() => {
              navigation.navigate('AddressList', {
                navigateTo: 'SelectTime',
              });
            }}
          >
            <View style={styles.queryAll}>
              <Text>地址管理</Text>
              <Icon
                type={'antdesign'}
                name="right"
                size={14}
                color={'#666666'}
              />
            </View>
          </TouchableItem>
        </View>
        {renderForm()}
        <View style={styles.maxBorder}></View>
        {patient()}
      </View>
      <BottomComponents
        title="确定下单"
        source={require('./img/kefu.png')}
        onPress={() => _handleSubmit()}
      />
    </Content>
  );
};
const styles = StyleSheet.create({
  topBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 22,
  },

  // space: {
  //   height: 12,
  //   backgroundColor: '#E5E5E5',
  // },
  fontStyle: {
    fontWeight: 'bold',
    fontSize,
    color: fontColor,
  },
  line: {
    marginVertical: 15,
    backgroundColor: borderLineColor,
  },
  groupLabel: {
    paddingBottom: 10,
    color: subColor,
    fontSize: subfontSize,
  },
  groupName: {
    color: projectColor,
    fontSize: subfontSize,
  },
  circleBlue: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: primary,
  },
  choiceBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  blueCircle: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: primary,
  },
  choiceTitle: {
    fontSize,
    color: fontColor,
    fontWeight: 'bold',
    paddingLeft: 10,
    flex: 3,
  },
  queryAll: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formInputStyle: {
    paddingHorizontal: 10,
    // paddingVertical: 5,
    // height: 60,
  },
  inputBottom: {
    marginTop: -20,
  },
  input: {
    height: 50,
    color: fontColor,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
  },
  inputLeftText: {
    color: fontColor,
    fontSize: fontSize,
  },

  inputLeftImg: {
    height: 24,
    width: 24,
  },
  relateView: {
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: -20,
  },

  relate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    // marginBottom: 5,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    marginTop: -10,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#BEBEBE',
    fontSize: subfontSize,
  },
  textStyle: {
    color: 'black',
    fontSize: subfontSize,
  },
  otherLine: {
    height: 1.2,
    backgroundColor: borderLineColor,
    marginVertical: 10,
  },
  detailsAddress: {
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: -10,
  },
  optAddressImage: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  optAddress: {
    fontSize: smallfontSize,
    color: projectColor,
  },
  setAddressView: {
    marginTop: -10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    color: 'black',
    margin: 20,
    marginLeft: 0,
  },
  demoInput: {
    backgroundColor: 'white',
    // borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  otherMargin: { marginTop: -25 },
  sex: {
    height: 58,
    paddingTop: 10,
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  setPatientView: {
    marginLeft: 10,
    marginTop: -10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  errorText: {
    color: 'red',
    paddingHorizontal: 10,
  },
  requireFlag: {
    color: 'red',
    fontSize: 26,
    marginLeft: 5,
    textAlign: 'center',
    marginTop: 5,
  },
  maxBorder: { height: 10, backgroundColor: '#F2F2F2', marginTop: 16 },
});
export default SelectTime;
