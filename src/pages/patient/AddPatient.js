import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import {
  Content,
  FormInput,
  Toast,
  Button,
  RootContext,
} from '../../components';
import { useForm, Controller } from 'react-hook-form';
import { createMember } from '../../api';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
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
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const AddPatient = () => {
  const { control, handleSubmit, errors } = useForm();
  const { getLoginInfo } = useContext(RootContext);
  const [isDefault, setDefault] = useState(1);
  const navigation = useNavigation();
  //用户性别 "0":未知的性别 "1":男性 "2":女性 "9"未说明的性别
  const [sex, setSex] = useState('1');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
      },
    });
  }, [navigation]);

  /**
   * 一进来便获取用户id
   */
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
    if (errors.memberName) {
      msg = '姓名不能为空';
    } else if (errors.credentialsNum) {
      msg = '身份证号码不能为空';
    }
    msg && Toast({ message: msg });
  }, [errors]);

  /**
   * 单选框选中值
   * @param {*} index
   * @param {*} value
   */
  const _onSelect = (index, value) => {
    setSex(value);
  };

  const _handleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  /**
   * 提交到服务器
   * @param {*} formData
   */
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const sendData = {
      userId: userId,
      isDefault: isDefault,
      memberSex: sex,
      credentialsType: '01',
      ...formData,
    };

    const { result } = await createMember.fetch(sendData);
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
      <View style={styles.container}>
        <View style={styles.space} />
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
          name="memberName"
          rules={{ required: true }}
        />

        {/* 就诊人性别 */}
        <View style={[styles.sex, styles.otherMargin]}>
          <View style={[styles.inputLeft, styles.disance]}>
            <Text style={styles.inputLeftText}>您的性别</Text>
            <Text style={styles.requireFlag}>*</Text>
          </View>
          <RadioGroup
            style={styles.radioGroupView}
            selectedIndex={0}
            size={18}
            color={primary}
            onSelect={(index, value) => _onSelect(index, value)}
          >
            <RadioButton value={'1'}>
              <Text style={styles.radioButtonText}>男性</Text>
            </RadioButton>

            <RadioButton value={'2'}>
              <Text style={styles.radioButtonText}>女性</Text>
            </RadioButton>
          </RadioGroup>
        </View>

        <View style={styles.line} />

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
          rules={{ required: true }}
        />
        {/* 设置默认地址 */}
        <TouchableWithoutFeedback
          onPress={() => {
            setDefault(!isDefault);
          }}
        >
          <View style={styles.setPatientView}>
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
            <Text style={styles.optPatient}>设置为默认就诊人</Text>
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

export default AddPatient;

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

  otherMargin: { marginTop: -24 },

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

  sex: {
    height: 58,
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },

  disance: {
    marginRight: 10,
  },

  line: {
    marginLeft: 10,
    marginRight: 10,
    height: 1,
    backgroundColor: borderLineColor,
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

  setPatientView: {
    marginLeft: 10,
    marginTop: -8,
    alignItems: 'center',
    flexDirection: 'row',
  },

  optPatient: {
    fontSize: fontSize,
    color: projectColor,
    marginLeft: 8,
  },

  buttonStyle: {
    marginBottom: 32,
    height: 44,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: primary,
  },
});
