import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Text, Image, CheckBox } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  RootContext,
  Content,
  FormInput,
  Toast,
  flexStyle,
  Button,
} from '../../components';
import { userLogin, getVerifCode } from '../../api';
import {
  fontColor,
  subColor,
  largeSize,
  subfontSize,
  fontSize,
  primary,
  widgetSpace,
  fontColorWhite,
} from '../../theme';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);

  const [authCode, setAuthCode] = useState('');
  const [authCodeValid, setAuthCodeValid] = useState(true);

  const [count, setCount] = useState(0);
  // const { data, error, mutate } = useSWR(userLogin.url, {});
  const usernameRef = useRef(null);
  const authCodeRef = useRef(null);
  const countRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [checked, setChecked] = useState(false);

  const { signIn } = useContext(RootContext);

  const validate = ({ type }) => {
    if (type === 'checkedbox') {
      if (!checked) {
        Toast({ message: '请先选择服务协议' });
        return false;
      }
      return true;
    }

    if (type === 'username') {
      const valid = username.length > 0;
      setUsernameValid(valid);
      if (!valid) {
        usernameRef.current.shake();
      }
      return valid;
    }

    if (type === 'authCode') {
      const valid = authCode.length > 0;
      setAuthCodeValid(valid);
      if (!valid) {
        authCodeRef.current.shake();
      }
      return valid;
    }
  };

  const onLogin = async () => {
    if (
      validate({ type: 'checkedbox' }) &&
      validate({ type: 'username' }) &&
      validate({ type: 'authCode' })
    ) {
      setIsLoading(true);
      const { result, data, message } = await userLogin.fetch({
        tel: username,
        inputPass: authCode,
      });
      if (result === 'success') {
        Toast({
          message: message || '登录成功',
          onHidden: () => {
            signIn(data);
            setIsLoading(false);
            if (route.params) {
              //登陆页面返回上一级
              if (route.params.action === 'back') {
                navigation.goBack();
              } else {
                const { navigateTo, titleTo, ...rest } = route.params;
                navigation.replace(navigateTo, { title: titleTo, ...rest });
              }
            } else {
              navigation.replace('Home');
            }
          },
        });
      } else {
        Toast({ message });
        setIsLoading(false);
      }
    }
  };

  const onGetAuthCode = () => {
    const valid = validate({ type: 'username' });
    if (valid) {
      setCount(59);
      getVerifCodeByTel();
    }
  };

  const getVerifCodeByTel = async () => {
    const { result, data } = await getVerifCode.fetch(username);
    if (result === 'success') {
      console.log(data, 'getVerifCodeData');
    }
  };

  useEffect(() => {
    countRef.current = setTimeout(() => {
      if (count > 0) {
        setCount((c) => c - 1);
      }
    }, 1000);
    return () => {
      clearTimeout(countRef.current);
    };
  }, [count]);

  const authCodeText = count > 0 ? `${count} 秒后...` : '获取验证码';
  return (
    <Content>
      <View style={{ marginVertical: 15 }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 44, height: 44 }}
        />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text
          style={{ fontSize: largeSize, color: fontColor, marginBottom: 10 }}
        >
          请填写以下注册信息
        </Text>
        <Text style={{ fontSize: subfontSize, color: subColor }}>
          未注册手机验证后自动登录
        </Text>

        <View style={styles.formBox}>
          <FormInput
            refInput={usernameRef}
            leftIcon={(style) => (
              <Text style={[style, styles.input]}>手机号</Text>
            )}
            keyboardType="numeric"
            value={username}
            onChangeText={(value) => setUsername(value)}
            placeholder="请输入手机号码"
            errorMessage={usernameValid ? null : '手机号码必填'}
            onSubmitEditing={() => {
              validate({ type: 'username' });
            }}
          />
          <FormInput
            refInput={authCodeRef}
            leftIcon={(style) => (
              <Text style={[style, styles.input]}>验证码</Text>
            )}
            rightIcon={
              <Button
                onPress={onGetAuthCode}
                buttonStyle={{ borderColor: subColor, paddingHorizontal: 12 }}
                titleStyle={{ fontSize: subfontSize, color: fontColorWhite }}
                title={authCodeText}
                type="outline"
                disabled={count > 0}
              />
            }
            value={authCode}
            keyboardType="numeric"
            onChangeText={(value) => setAuthCode(value)}
            placeholder="请输入验证码"
            errorMessage={authCodeValid ? null : '验证码必填'}
            onSubmitEditing={() => {
              validate({ type: 'authCode' });
              authCodeRef.focus();
            }}
          />
          <View style={styles.btnWrap}>
            <Button
              // loading={isLoading}
              title="登录"
              containerStyle={{ flex: -1 }}
              buttonStyle={[styles.buttonStyle]}
              titleStyle={[styles.buttonText]}
              onPress={onLogin}
              disabled={isLoading}
            />
          </View>
          <View style={{ paddingTop: widgetSpace }}>
            <CheckBox
              center
              title={
                <View style={{ flexDirection: 'row' }}>
                  <Text>我已阅读并同意《</Text>
                  <Text style={{ color: primary }}>国寿逸生注册服务协议</Text>
                  <Text>》</Text>
                </View>
              }
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={checked}
              onPress={() => setChecked(!checked)}
              containerStyle={{
                borderColor: 'transparent',
                backgroundColor: 'transparent',
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formBox: {
    paddingTop: 40,
    flex: 1,
  },
  buttonText: {
    fontSize,
  },
  buttonStyle: {
    height: 45,
  },
  btnWrap: {
    paddingTop: 50,
  },
  color: {
    color: fontColor,
  },
  input: {
    fontSize: fontSize,
  },
});

export default Login;
