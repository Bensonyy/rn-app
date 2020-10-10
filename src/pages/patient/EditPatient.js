import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { editMember } from '../../api';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import {
  primary,
  fontSize,
  subfontSize,
  fontColor,
  subColor,
  projectColor,
  borderLineColor,
} from '../../theme';
import {
  Content,
  FormInput,
  Toast,
  Button,
  RootContext,
} from '../../components';
import { useForm, Controller } from 'react-hook-form';

const EditPatient = () => {
  const route = useRoute();
  const { control, handleSubmit, errors, setValue } = useForm();
  const { getLoginInfo } = useContext(RootContext);
  const navigation = useNavigation();
  //用户性别 "0":未知的性别 "1":男性 "2":女性 "9"未说明的性别
  const [sex, setSex] = useState('1');
  const [userId, setUserId] = useState();
  const [memberId, setMemberId] = useState();
  const [isDefault, setDefault] = useState();
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

  useEffect(() => {
    let params = route?.params;
    setSex(params.sex);
    setMemberId(params.memberId);
    return () => {};
  }, []);

  /**
   * 校验表单
   */
  useEffect(() => {
    let msg = '';
    if (errors.userName) {
      msg = '姓名不能为空';
    } else if (errors.idCard) {
      msg = '身份证号码不能为空';
    }
    msg && Toast({ message: msg });
  }, [errors]);

  /**
   * 设置表单默认值
   */
  useEffect(() => {
    setValue('memberName', route?.params?.name);
    setValue('credentialsNum', route?.params?.idCard);
    return () => {};
  }, []);

  const _handleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  /**
   * 单选框选中值
   * @param {*} index
   * @param {*} value
   */
  const _onSelect = (index, value) => {
    setSex(value);
  };

  /**
   * 提交到服务器
   * @param {*} formData
   */
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const sendData = {
      userId: userId,
      memberId: memberId,
      isDefault: isDefault ? 1 : 0,
      memberSex: sex.toString(),
      credentialsType: '01',
      ...formData,
    };

    const { result } = await editMember.fetch(sendData);
    if (result === 'success') {
      Toast({
        message: '修改成功',
      });
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
              inputStyle={{
                marginLeft: -20,
              }}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="memberName"
          rules={{ required: true }}
        />

        {/* 身份证 */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              placeholder="请填写身份号码"
              containerStyle={[styles.formInputStyle, styles.otherMargin]}
              maxLength={18}
              keyboardType="numeric"
              inputStyle={{
                marginLeft: -20,
                paddingBottom: 10,
              }}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="credentialsNum"
          rules={{ required: true }}
        />

        {/* 就诊人性别 */}
        <View style={[styles.sex, styles.otherMargin]}>
          <View style={[styles.inputLeft, styles.disance]}>
            <Text style={styles.inputLeftText}>您的性别</Text>
          </View>
          <RadioGroup
            color={primary}
            style={styles.radioGroupView}
            selectedIndex={sex == 1 ? 0 : 1}
            size={18}
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

        {/* 设置默认就诊人 */}
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
        title={'保存提交'}
        buttonStyle={styles.buttonStyle}
        onPress={_handleSubmit}
      />
    </Content>
  );
};

export default EditPatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  space: {
    height: 10,
    backgroundColor: borderLineColor,
  },

  formInputStyle: {
    height: 58,
    paddingLeft: 10,
    paddingRight: 10,
  },

  otherMargin: { marginTop: -6 },

  setPatientView: {
    marginTop: 16,
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  sex: {
    height: 90,
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
  },

  inputLeftText: {
    marginBottom: 5,
    color: projectColor,
    fontSize: fontSize,
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
    backgroundColor: '#3385FF',
  },
});
