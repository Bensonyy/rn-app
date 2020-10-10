import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  StyleSheet,
  View,
  YellowBox,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Button,
  Divider,
  Input,
  Image,
  Text,
  Icon,
} from 'react-native-elements';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { RootContext } from '../../components/Context';
import {
  Content,
  FormInput,
  Toast,
  Card,
  TouchableItem,
  ProjectList,
  BottomComponents,
  GroupInfoComponent,
} from '../../components';
import { isMobile } from '../../utils';
import {
  fontSize,
  fontColor,
  largeSize,
  smallfontSize,
  subfontSize,
  primary,
  smallColor,
  borderLineColor,
  tagSize,
  tagColor,
  tagBgColor,
  projectColor,
} from '../../theme';
import {
  getGroupProjectByGroupId,
  getSystemCurTime,
  createOrder,
  getGroupInfoById,
} from '../../api';
import Carousel from 'react-native-snap-carousel';
// import Modal from 'react-native-modal';
YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);
const screenH = Dimensions.get('window').height;
const horizontalMargin = 20;
const sliderWidth = 90;
const itemWidth = sliderWidth + horizontalMargin * 2;
const itemHeight = 200;
const HomeCare = () => {
  const [selectIndex, setSelectedIndex] = useState(null);
  const [serviceTime, setServiceTime] = useState(null);
  const [selectTime, setSelectTime] = useState(null);
  const [ap, setAp] = useState(null);
  const navigation = useNavigation();
  const { control, handleSubmit, errors } = useForm();
  const route = useRoute();
  const [groupProject, setGroupProject] = useState([]);
  const [headDoctorInfo, setHeadDoctorInfo] = useState({});
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [isCollect, setCollect] = useState(0);
  const [cardData, setCardInfo] = useState({});
  const [groupData, setGroupInfo] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const groupId = route?.params?.groupInfo?.groupId;
  const mockData = [
    {
      title: '服务项目说明',
      content: [
        '用户必须具备正规医疗机构开具的处方、药品及病历证明',
        '护士只提供上门打针服务,不提供相关药品',
        '年龄不满5岁不提供上门服务',
        '本服务为肌肉注射和皮下注射,不提供输液服',
      ],
    },
  ];
  useEffect(() => {
    let msg = '';
    if (errors.userName) {
      msg = '联系人不能为空';
    } else if (errors.userTel) {
      msg = '请输入正确的联系电话';
    }
    msg && Toast({ message: msg });
  }, [errors]);

  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getGroupProjectByGroupId.fetch({
        groupId,
      });
      if (result === 'success') {
        setGroupProject(data);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const loginInfo = await getLoginInfo();
      const id = loginInfo?.userId;
      setUserId(id);
      const { result, data, message } = await getGroupInfoById.fetch({
        groupId,
        userId: id,
      });
      if (result === 'success') {
        setCardInfo(data);
        setHeadDoctorInfo(data.headDoctorInfo);
        setCollect(data.isCollect);
        setGroupInfo([...data.doctorInfoList, ...data.nurseInfoList]);
      }
    };
    fetchData();
  }, [groupId]);
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getSystemCurTime.fetch();
      if (result === 'success') {
        setServiceTime(data);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (formData) => {
    if (!address) {
      Toast({ message: '请选择地址' });
      return;
    }

    const arr = location.split(',');
    const sendData = {
      provideId: groupProject[selectIndex].groupId,
      projectId: groupProject[selectIndex].projectId,
      hospitalId: route?.params?.groupInfo?.hospitalId,
      longitude: arr[0],
      latitude: arr[1],
      userAddr: address,
      projectName: groupProject[selectIndex].projectName,
      projectPrice: groupProject[selectIndex].projectPrice,
      orderTime: `${selectTime} ${ap}`,
      ...formData,
    };
    setIsLoading(true);
    const { result, data, message } = await createOrder.fetch(sendData);
    if (result === 'success') {
      Toast({
        message: message,
        onHidden: () => {
          setIsLoading(false);
          navigation.navigate('Payment', {
            projectPrice: groupProject[selectIndex].projectPrice,
            orderId: data,
          });
        },
      });
    }
  };

  const getValidate = useCallback(() => {
    let msg = '';
    if (selectIndex === null) {
      msg = ' 请选择服务项目';
    }
    if (msg) {
      msg && Toast({ message: msg });
    } else {
      return true;
    }
  }, [selectIndex, selectTime, ap]);

  const _handleSubmit = ({
    navigateName,
    userId,
    groupInfo,
    hospitalId,
    groupTitle,
    projectObj,
  }) => {
    if (getValidate()) {
      handleSubmit(
        _onSubmit({
          navigateName,
          userId,
          groupInfo,
          hospitalId,
          groupTitle,
          projectObj,
        })
      )();
    }
  };
  const _onSubmit = async ({
    navigateName,
    userId,
    groupInfo,
    hospitalId,
    groupTitle,
    projectObj,
  }) => {
    const loginInfo = await getLoginInfo();
    const isLogin = loginInfo && loginInfo.token;
    const params = {
      userId,
      groupInfo,
      hospitalId,
      groupTitle,
      projectObj,
    };
    if (isLogin) {
      navigation.navigate(navigateName, params);
    } else {
      navigation.navigate('Login', { ...params, navigateTo: navigateName });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View>
          <Image
            source={{
              uri: item.doctorAvater || item.nusersAvater,
            }}
            style={{ width: 44, height: 44, borderRadius: 50 }}
          />
        </View>
        <View style={styles.doctorDes}>
          <Text style={{ fontSize: smallfontSize, color: fontColor }}>
            {item.doctorName || item.nurseName}
          </Text>
          <Text>{item.professionalTitle}</Text>
        </View>
      </View>
    );
  };
  const cardInfo = () => {
    return (
      <Card
        containerStyle={{
          marginTop: -35,
          marginHorizontal: 16,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <GroupInfoComponent
          headDoctorInfo={headDoctorInfo}
          isCollect={isCollect}
          groupId={groupId}
          onClickAvatarCom={() => {
            navigation.navigate('Profile', {
              groupId,
            });
          }}
        />
        <Divider style={[styles.line]} />
        <View style={styles.swiperBox}>
          <Image
            source={require('./img/group.png')}
            style={{ width: 36, height: 39 }}
          />
          <Carousel
            data={groupData}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
          />
        </View>
        <Divider style={[styles.line]} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            numberOfLines={2}
            style={{ fontSize: subfontSize, color: fontColor }}
          >
            擅长：
            <Text style={{ fontSize: 16, color: '#999999' }}>
              {cardData.groupIntroduce}
            </Text>
          </Text>
        </View>
      </Card>
      // </TouchableWithoutFeedback>
    );
  };
  const renderForm = () => {
    return (
      <View style={styles.formBox}>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              inputStyle={[styles.input]}
              onBlur={onBlur}
              leftIcon={(style) => <Text style={[style]}>联系人</Text>}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="userName"
          rules={{ required: true }}
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              inputStyle={[styles.input]}
              onBlur={onBlur}
              leftIcon={(style) => <Text style={[style]}>联系电话</Text>}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="userTel"
          rules={{
            validate: isMobile,
          }}
        />

        <FormInput
          disabled={true}
          inputStyle={[styles.input]}
          numberOfLines={2}
          leftIcon={(style) => <Text style={[style]}>联系地址</Text>}
          rightIcon={(style) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Map', {
                  callback: ({ location, pname, cityname, address, name }) => {
                    setAddress(`${pname}${cityname}${address}${name}`);
                    setLocation(location);
                  },
                })
              }
            >
              <Text style={[style]}>选择</Text>
            </TouchableOpacity>
          )}
          value={address}
        />

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <FormInput
              inputStyle={[styles.input]}
              onBlur={onBlur}
              leftIcon={(style) => <Text style={[style]}>备注</Text>}
              onChangeText={(value) => onChange(value)}
              value={value}
              multiline={true}
              numberOfLines={4}
            />
          )}
          name="orderRemark"
        />
        <Button title="提交" disabled={isLoading} onPress={_handleSubmit} />
      </View>
    );
  };
  const showModal = (modalData) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{ height: 500 }}
      >
        <View style={styles.scrollableModal}>
          <View style={styles.innerContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}
            >
              <View></View>
              <Text
                style={{
                  fontSize: 18,
                  color: '#333333',
                  paddingLeft: 20,
                  fontWeight: 'bold',
                }}
              >
                医护上门须知
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: primary, fontSize }}>确定</Text>
              </TouchableWithoutFeedback>
            </View>
            <Divider style={[styles.otherLine, { marginHorizontal: 10 }]} />
            <ScrollView
              style={{
                marginHorizontal: 20,
              }}
            >
              {modalData.map((item, index) => {
                return (
                  <View key={index}>
                    <Text style={{ color: '#333333', fontSize }}>
                      {item.title}
                    </Text>
                    {item.content &&
                      item.content.map((item, id) => {
                        return (
                          <View
                            style={{
                              marginTop: 16,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            key={id}
                          >
                            <View
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: 50,
                                backgroundColor: '#F78E00',
                                marginRight: 10,
                              }}
                            ></View>
                            <Text style={{ fontSize: 14 }}>{item}</Text>
                          </View>
                        );
                      })}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  const handleCallback = useCallback(
    (index) => {
      console.log(index);
      setModalVisible(true);
      setSelectedIndex(index);
      console.log(groupProject[index].groupProjectItem, '????????');
      setModalData(
        groupProject[index].groupProjectItem !== null
          ? JSON.parse(groupProject[index].groupProjectItem.projectAttention)
          : []
      );
    },
    [groupProject]
  );
  return (
    <>
      <Content type="full" showBg={true} title="预约上门项目选择">
        {cardInfo()}
        <ProjectList
          groupProject={groupProject}
          type="group"
          title="请选择服务项目"
          callback={({ selectIndex }) => handleCallback(selectIndex)}
        />
        {showModal(modalData)}
      </Content>
      <BottomComponents
        title="下一步"
        source={require('./img/kefu.png')}
        onPress={() =>
          _handleSubmit({
            navigateName: 'SelectTime',
            userId,
            groupInfo: route.params.groupInfo,
            hospitalId: cardData.hospitalId,
            groupTitle: cardData.groupName,
            projectObj: groupProject[selectIndex],
          })
        }
      />
    </>
  );
};

export default HomeCare;

const styles = StyleSheet.create({
  selectItem: {
    marginLeft: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectItemButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 153,
    minHeight: 92,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginRight: 13,
  },
  selectDefault: {
    color: projectColor,
    fontSize: smallfontSize,
  },
  borderActive: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: primary,
  },
  selectActive: {
    color: primary,
  },
  selectItemTime: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  ampm: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  line: {
    marginVertical: 15,
    backgroundColor: borderLineColor,
  },
  timesBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fontColor: { color: fontColor, fontSize: 16 },
  error: {
    color: 'red',
  },
  input: {
    color: fontColor,
  },
  doctorBox: {
    display: 'flex',
  },
  infoBox: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  doctorName: {
    color: fontColor,
    fontSize: largeSize,
  },
  attention: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 69,
    height: 30,
    borderColor: primary,
    borderWidth: 2,
    // color: 'blue',
    fontSize: smallfontSize,
    backgroundColor: '#fff',
  },
  swiperBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  slide: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
  },
  doctorDes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 10,
    // alignItems: 'center',
  },
  tagItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minWidth: 64,
    height: 18,
    backgroundColor: tagBgColor,
    borderRadius: 100,
    marginLeft: 10,
  },
  tagText: {
    fontSize: tagSize,
    color: tagColor,
  },
  choiceBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
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
    paddingLeft: 10,
    flex: 3,
  },
  queryAll: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBox: {
    paddingLeft: 10,
    marginTop: 26,
    display: 'flex',
    flexDirection: 'row',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollableModalContent1: {
    // height: 200,
    // backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText1: {
    fontSize: 20,
    color: '#000',
  },
  scrollableModalContent2: {
    height: 200,
    // backgroundColor: '#A9DCD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText2: {
    fontSize: 20,
    color: 'white',
  },
  innerContainer: {
    height: screenH - 260,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  otherLine: {
    height: 1.2,
    backgroundColor: borderLineColor,
    marginVertical: 16,
  },
});
