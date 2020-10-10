import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import {
  Content,
  FormInput,
  Toast,
  Button,
  RootContext,
} from '../../components';
import { useForm, Controller } from 'react-hook-form';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { createAddress } from '../../api';
import {
  primary,
  fontSize,
  subfontSize,
  fontColor,
  subColor,
  projectColor,
  borderLineColor,
  red,
} from '../../theme';
import Picker from 'react-native-picker';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import area from '../../config/area.json';

/**
 * 创建省市区数据
 */
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

const AddAddress = () => {
  const { control, handleSubmit, errors, setValue } = useForm();
  const { getLoginInfo } = useContext(RootContext);
  const navigation = useNavigation();
  const [isDefault, setDefault] = useState(1);
  const [areaName, setAreaName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');

  //与用户关系
  const [relation, setRelation] = useState('01');

  //省
  const [provinceName, setProvinceName] = useState();

  //市
  const [cityName, setCityName] = useState();

  //区、县
  const [countyName, setCountyName] = useState();

  //经度
  const [longitude, setLongitude] = useState();

  //经纬度
  const [latitude, setLatitude] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
      },
    });
  }, [navigation]);

  // 一进来便获取用户id
  useEffect(() => {
    const getLogin = async () => {
      const loginInfo = await getLoginInfo();
      if (loginInfo) {
        setUserId(loginInfo.userId);
      }
    };
    getLogin();
    return () => {};
  }, []);

  /**
   * 校验表单
   */
  useEffect(() => {
    let msg = '';
    if (errors.linkName) {
      msg = '姓名不能为空';
    } else if (errors.linkTel) {
      msg = '联系方式不能为空';
    } else if (errors.streetAddress) {
      msg = '详细地址不能为空';
    }
    msg && Toast({ message: msg });
  }, [errors]);

  /**
   * 单选框选中值
   * @param {*} index
   * @param {*} value
   */
  const _onSelect = (index, value) => {
    setRelation(value);
  };

  /**
   * 校验非表单input
   */
  const getValidate = useCallback(() => {
    if (
      typeof areaName === 'undefined' ||
      areaName === null ||
      areaName === ''
    ) {
      Toast({ message: '省市县区不能为空' });
      return false;
    } else {
      return true;
    }
  }, [areaName]);

  const _handleSubmit = () => {
    if (getValidate()) {
      handleSubmit(onSubmit)();
    }
  };

  /**
   * 提交到服务器
   * @param {*} formData
   */
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const sendData = {
      userId: userId,
      longitude: longitude,
      latitude: latitude,
      provinceName: provinceName,
      cityName: cityName,
      countyName: countyName,
      isDefault: isDefault ? 1 : 0,
      relation: relation,
      ...formData,
    };

    const { result } = await createAddress.fetch(sendData);
    if (result === 'success') {
      Toast({
        message: '新增成功',
      });
      navigation.goBack();
    }
    setIsLoading(false);
  };

  return (
    <Content type="full" isScroll={true}>
      <View style={styles.space} />
      <View style={styles.container}>
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
          name="linkName"
          rules={{ required: true }}
        />

        {/* 联系方式 */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              placeholder="请填写手机号码"
              containerStyle={[styles.formInputStyle, styles.otherMargin]}
              inputStyle={styles.input}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={11}
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
          rules={{ required: true }}
        />

        {/* 省市区 */}
        <TouchableWithoutFeedback
          onPress={() => {
            Picker.init({
              pickerTitleText: '省市区',
              pickerConfirmBtnText: '确定',
              pickerCancelBtnText: '取消',
              pickerData: createAreaData(),
              selectedValue: ['海南', '三亚', '海棠区'],
              onPickerConfirm: (pickedValue) => {
                setAreaName(
                  `${pickedValue[0]}${pickedValue[1]}${pickedValue[2]}`
                );
                setProvinceName(pickedValue[0]);
                setCityName(pickedValue[1]);
                setCountyName(pickedValue[2]);
              },
            });
            Picker.show();
          }}
        >
          <View style={[styles.addressView, styles.otherMargin]}>
            <View style={{ flex: 1 }}>
              <View style={styles.addressLeft}>
                <Text style={styles.inputLeftText}>省市县区</Text>
                <Text style={styles.requireFlag}>*</Text>
              </View>
              {areaName.length == 0 ? (
                <Text style={styles.placeholderStyle}>
                  请选择所在的省份市县及区
                </Text>
              ) : (
                <Text style={styles.textStyle}>{areaName}</Text>
              )}
            </View>
            <Icon
              type={'simple-line-icon'}
              name="arrow-right"
              size={18}
              color={subColor}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={[styles.line, { marginTop: 10 }]} />

        {/* 详细地址*/}
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
                  containerStyle={styles.formInputStyle}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  inputStyle={{
                    marginLeft: -22,
                  }}
                  rightIcon={
                    <TouchableWithoutFeedback
                      onPress={() =>
                        navigation.navigate('Map', {
                          callback: ({ address, name, location }) => {
                            setValue('streetAddress', `${address}${name}`);
                            let ll = location.split(',');
                            setLongitude(ll[0]);
                            setLatitude(ll[1]);
                          },
                        })
                      }
                    >
                      <View style={{ marginTop: -30, marginLeft: 20 }}>
                        <Icon type={'antdesign'} name="enviromento" />
                        <Text style={{ color: projectColor, fontSize: 12 }}>
                          定位
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  }
                />
              )}
              name="streetAddress"
              rules={{ required: true }}
            />
          </View>
        </View>

        {/* 与就诊人关系 */}
        <View style={[styles.relateView]}>
          <View style={styles.relate}>
            <Text style={styles.inputLeftText}>就诊关系</Text>
            <Text style={styles.requireFlag}>*</Text>
          </View>
          <RadioGroup
            style={styles.radioGroupView}
            selectedIndex={0}
            size={18}
            onSelect={(index, value) => _onSelect(index, value)}
          >
            <RadioButton value={'01'}>
              <Text style={styles.radioButtonText}>本人</Text>
            </RadioButton>

            <RadioButton value={'02'}>
              <Text style={styles.radioButtonText}>家属</Text>
            </RadioButton>

            <RadioButton value={'03'}>
              <Text style={styles.radioButtonText}>其他</Text>
            </RadioButton>
          </RadioGroup>
        </View>
        <View style={styles.line} />

        {/* 设置默认地址 */}
        <TouchableWithoutFeedback
          onPress={() => {
            setDefault(!isDefault);
          }}
        >
          <View style={styles.setAddressView}>
            {isDefault ? (
              <Icon
                type={'antDesign'}
                name="check-circle"
                size={22}
                color={primary}
              />
            ) : (
              <Icon type={'feather'} name="circle" size={22} color={subColor} />
            )}
            <Text style={styles.optAddress}>设置为默认地址</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Button
        disabled={isLoading}
        title={'确定新增'}
        buttonStyle={styles.buttonStyle}
        onPress={_handleSubmit}
      />
    </Content>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  space: {
    height: 10,
    backgroundColor: borderLineColor,
  },

  formInputStyle: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  input: {
    height: 58,
    color: fontColor,
    fontSize: fontSize,
    backgroundColor: '#fff',
  },

  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    backgroundColor: '#fff',
  },

  inputLeftText: {
    color: projectColor,
    fontSize: fontSize,
  },

  requireFlag: {
    color: red,
    fontSize: 26,
    marginLeft: 5,
    textAlign: 'center',
    marginTop: 5,
  },

  otherMargin: { marginTop: -24 },

  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 90,
    paddingRight: 10,
  },

  placeholderStyle: {
    color: '#BEBEBE',
    fontSize: fontSize,
    marginTop: 10,
    marginLeft: 10,
  },

  textStyle: {
    color: fontColor,
    fontSize: fontSize,
    marginTop: 10,
    marginLeft: 10,
  },

  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },

  line: {
    marginLeft: 10,
    marginRight: 10,
    height: 1,
    backgroundColor: borderLineColor,
  },

  detailsAddress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 90,
  },

  relateView: {
    justifyContent: 'center',
    paddingLeft: 10,
    height: 90,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: -24,
  },

  relate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 5,
  },

  radioGroupView: {
    marginLeft: -10,
    flexDirection: 'row',
  },

  radioButtonText: {
    fontSize: subfontSize,
    color: fontColor,
    marginTop: -2,
  },

  setAddressView: {
    marginTop: 15,
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  optAddress: {
    fontSize: fontSize,
    color: projectColor,
    marginLeft: 8,
  },

  buttonStyle: {
    marginBottom: 32,
    height: 44,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#3385FF',
  },
});
