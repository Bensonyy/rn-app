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
  TextInput,
} from 'react-native';
import { Icon, Divider, Button } from 'react-native-elements';
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
  Loading,
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
  getDiseaseist,
  createMedical,
} from '../../api';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';
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
    memberName: '请输入就诊人名字',
  };
  const isFocused = useIsFocused();
  const { getLoginInfo } = useContext(RootContext);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDefault, setDefault] = useState(1);
  const [radioIndex, setradioIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [groupProject, setGroupProject] = useState([]);
  const [chiefComplaint, onChangeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userIdRef = useRef(userId);
  const navigation = useNavigation();
  const route = useRoute();
  const { routeParams, itemInfo, consulType } = route.params || {};
  const { groupId } = routeParams || {};

  const { control, handleSubmit, errors, setValue, getValues } = useForm({
    defaultValues: {},
  });
  useEffect(() => {
    const fetchUserId = async () => {
      const loginInfo = await getLoginInfo();
      const { userId, token } = loginInfo || {};
      userIdRef.current = userId;
      setUserId(userId);
      setToken(token);
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    const fetchDiseaseistData = async () => {
      setIsLoading(true);
      const { result, data, message } = await getDiseaseist.fetch(groupId);
      if (result === 'success') {
        const newData = (data || []).map((item) => {
          return {
            ...item,
            projectName: item.symptomName,
          };
        });
        setGroupProject(newData);
        setIsLoading(false);
      } else {
        console.log('失败');
      }
    };
    fetchDiseaseistData();
  }, [groupId, isFocused]);
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
      setValue('memberName', memberData?.memberName);
      setValue('credentialsNum', memberData?.credentialsNum);
      setValue('memberSex', sexNum);
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
      } else if (selectedIndex === null) {
        Toast({ message: '请选择疾病' });
      } else {
        return true;
      }
    }
  };
  const _handleSubmit = () => {
    getValidate() && handleSubmit(onSubmit)();
  };
  const onSubmit = async (formData) => {
    // const loginInfo = await getLoginInfo();
    // const userId = loginInfo?.userId;
    // console.log(userId, 'ffff');
    const diseaseInfo = groupProject[selectedIndex];
    const prams = {
      ...routeParams,
      ...formData,
      chiefComplaint,
      credentialsType: '01',
      diseaseCode: diseaseInfo.symptomCode,
      diseaseName: diseaseInfo.symptomName,
      userId,
      consulType,
    };
    const { result, data, message } = await createMedical.fetch(prams);

    if (result === 'success') {
      navigation.navigate('PayMedicalRecord', {
        routeParams,
        medicalId: data,
        consulType,
        token,
      });
    }
  };
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
                navigateTo: 'ImgConsult',
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
        <View>
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
                    <Text style={styles.inputLeftText}>就诊人姓名</Text>
                    <Text style={styles.requireFlag}>*</Text>
                  </View>
                )}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="memberName"
            // rules={{ required: true }}
          />
          {/* 就诊人性别 */}
          <View style={[styles.sex, styles.otherMargin]}>
            <View style={[styles.inputLeft, styles.disance]}>
              <Text style={styles.inputLeftText}>就诊人性别</Text>
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
              name="memberSex"
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
                onBlur={onBlur}
                leftIcon={() => (
                  <View style={styles.inputLeft}>
                    <Text style={styles.inputLeftText}>身份证号码</Text>
                    <Text style={styles.requireFlag}>*</Text>
                  </View>
                )}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="credentialsNum"
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
  const handleCallback = useCallback((index) => {
    console.log(index, 'index');
    setSelectedIndex(index);
  }, []);
  return (
    <Content type="full">
      {/* <View style={styles.maxBorder}></View> */}
      <View style={styles.space} />
      <View style={styles.container}>{patient()}</View>
      <View style={[styles.space, { marginTop: 16 }]} />
      <ProjectList
        isLoading={isLoading}
        groupProject={groupProject}
        type="group"
        title="请选择疾病"
        callback={({ selectIndex }) => handleCallback(selectIndex)}
      />
      <View style={[styles.space, { marginVertical: 16 }]} />
      <View style={[styles.choiceBox, { marginHorizontal: 16 }]}>
        <View style={styles.blueCircle}></View>
        <Text style={styles.choiceTitle}>请输入咨询内容</Text>
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <TextInput
          style={{
            height: 154,
            backgroundColor: '#F0F0F0',
            borderRadius: 10,
            textAlignVertical: 'top',
            paddingHorizontal: 16,
          }}
          multiline={true}
          numberOfLines={10}
          onChangeText={(text) => onChangeText(text)}
          value={chiefComplaint}
        />
      </View>
      <Button
        onPress={() => _handleSubmit()}
        title="确定新增"
        containerStyle={{ marginVertical: 30, marginHorizontal: 16 }}
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
    marginHorizontal: 16,
  },

  space: {
    height: 12,
    backgroundColor: '#E5E5E5',
  },
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
    // paddingHorizontal: 16,
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
