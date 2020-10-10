import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  StyleSheet,
  View,
  YellowBox,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';
import {
  Button,
  Divider,
  Input,
  Image,
  Text,
  Icon,
} from 'react-native-elements';
import { RootContext } from '../../components/Context';
import {
  Content,
  Card,
  GroupInfoComponent,
  ProjectList,
  flexStyle,
  Toast,
} from '../../components';
import { timeConvert } from '../../utils';
import {
  fontSize,
  fontColor,
  largeSize,
  smallfontSize,
  subfontSize,
  primary,
  borderLineColor,
  tagSize,
  tagColor,
  tagBgColor,
  projectColor,
  contentSpace,
} from '../../theme';
import {
  getGroupProjectByGroupId,
  getSystemCurTime,
  getGroupInfoById,
  getCommentAllistByBizId,
  commentAllistBySymptomId,
  getDiseaseist,
} from '../../api';
import Carousel from 'react-native-snap-carousel';
import { AvatarCom } from '../../components';
import ExpandableText from 'rn-expandable-text';

const WIDTH = Dimensions.get('screen').width;

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);
const horizontalMargin = 10;
const sliderWidth = 120;
const itemWidth = sliderWidth + horizontalMargin * 2;
const itemHeight = 200;
const OnlineConsultation = () => {
  const [serviceTime, setServiceTime] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [groupProject, setGroupProject] = useState([]);
  const [headDoctorInfo, setHeadDoctorInfo] = useState({});
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState();
  const [isCollect, setCollect] = useState(0);
  const [cardData, setCardInfo] = useState({});
  const [groupData, setGroupInfo] = useState([]);
  const [selectIndex, setSelectedIndex] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [symptomList, setSymptomList] = useState([]);
  const [symptomId, setSymptomId] = useState(null);
  const [routeParams, setRouteParams] = useState({});
  const isFocused = useIsFocused();

  const { groupInfo } = route.params || {};

  const groupId = groupInfo?.groupId;
  const groupName = groupInfo?.groupName;

  const flexData = [
    { id: 0, imgUrl: require('./img/phone.png'), navigaName: 'ImgConsult' },
    { id: 1, imgUrl: require('./img/text.png'), navigaName: 'Im' },
    {
      id: 2,
      imgUrl: require('./img/video.png'),
      navigaName: 'MiddlePay',
      params: {
        type: 'onLineVideo',
      },
    },
  ];
  //先写死
  const tagInfo = [
    { projectName: '门诊详细' },
    { projectName: '答复及时' },
    { projectName: '解释到位' },
  ];
  useEffect(() => {
    console.log(isFocused, 'isFocused');
    const fetchData = async () => {
      const { result, data, message } = await getGroupProjectByGroupId.fetch({
        groupId,
      });
      if (result === 'success') {
        setGroupProject(data);
      }
    };
    fetchData();
  }, [isFocused]);
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
        setRouteParams({
          groupId: data.groupId,
          hospitalId: data.hospitalId,
          doctorId: data.headDoctorInfo.doctorId,
          groupHead: data.groupHead,
          groupName,
        });
        setCardInfo(data);
        setHeadDoctorInfo(data.headDoctorInfo);
        setCollect(data.isCollect);
        setGroupInfo([...data.doctorInfoList, ...data.nurseInfoList]);
      }
    };
    const fetchCommentData = async () => {
      const { result, data, message } = await getDiseaseist.fetch(groupId);
      if (result === 'success') {
        setSymptomList(data || []);
        setSymptomId(data && data[0].symptomId);
      } else {
        console.log('失败');
      }
    };
    fetchData();
    fetchCommentData();
  }, [groupId, isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await commentAllistBySymptomId.fetch(
        symptomId
      );
      if (result === 'success') {
        setCommentList(data);
      }
    };
    symptomId && fetchData();
  }, [symptomId]);

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
  const renderCardInfo = () => {
    return (
      <Card
        containerStyle={{
          marginTop: -35,
          marginHorizontal: contentSpace,
          paddingHorizontal: contentSpace,
          paddingVertical: contentSpace,
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
            <Text style={{ fontSize: contentSpace, color: '#999999' }}>
              {cardData.groupIntroduce}
            </Text>
          </Text>
        </View>
      </Card>
    );
  };
  const renderInquiryWay = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          ...flexStyle.spaceBetween,
          marginTop: 20,
          marginHorizontal: contentSpace,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Toast({
              message: '此功能正在开发中',
            });
          }}
        >
          <View style={styles.cardStyle}>
            <Image
              source={require('./img/phone.png')}
              style={{ height: 48, width: 48 }}
            />
            <Text style={styles.cardTextStyle}>电话问诊</Text>
            <Text>
              <Text style={styles.peopleCount}>90</Text>人已邀请
            </Text>
            <View style={[styles.smallTagItem, { width: 74, marginLeft: 0 }]}>
              <Text style={styles.smallTagText}>点击拨号</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            userId
              ? navigation.navigate('ImgConsult', {
                  routeParams,
                  consulType: 'tuwen',
                })
              : navigation.navigate('Login', { action: 'back' });
          }}
        >
          <View style={styles.cardStyle}>
            <Image
              source={require('./img/text.png')}
              style={{ height: 48, width: 48 }}
            />
            <Text style={styles.cardTextStyle}>图文问诊</Text>
            <Text>
              <Text style={styles.peopleCount}>10</Text>分钟接诊
            </Text>
            <View style={[styles.smallTagItem, { width: 74, marginLeft: 0 }]}>
              <Text style={styles.smallTagText}>点击开启</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            userId
              ? navigation.navigate('ImgConsult', {
                  routeParams,
                  consulType: 'video',
                })
              : navigation.navigate('Login', { action: 'back' });
          }}
        >
          <View style={styles.cardStyle}>
            <Image
              source={require('./img/video.png')}
              style={{ height: 48, width: 48 }}
            />
            <Text style={styles.cardTextStyle}>视频问诊</Text>
            <Text>
              <Text style={styles.peopleCount}>68</Text>人已邀请
            </Text>
            <View style={[styles.smallTagItem, { width: 74, marginLeft: 0 }]}>
              <Text style={styles.smallTagText}>点击连线</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const renderHeatConsults = () => {
    return (
      <View
        style={{
          marginHorizontal: contentSpace,
          marginTop: contentSpace,
        }}
      >
        <View style={styles.choiceBox}>
          <View style={styles.blueCircle}></View>
          <Text style={styles.choiceTitle}>热度咨询</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 11, flexWrap: 'wrap' }}>
          {symptomList.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSymptomId(item.symptomId);
                }}
                key={item.symptomId}
              >
                <View
                  style={[
                    styles.tagItem,
                    symptomId === item.symptomId && styles.tagActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      symptomId === item.symptomId && styles.tagTextActive,
                    ]}
                  >
                    {item.symptomName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  const renderCommentListComponent = () => {
    return (
      <View style={{ marginHorizontal: contentSpace }}>
        {commentList?.map((item, index) => {
          const { userPrimary, commentItemList } = item;
          return (
            <View key={item.commentId}>
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 19,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <AvatarCom
                    source={{
                      uri: userPrimary?.userAvater
                        ? userPrimary?.userAvater
                        : 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    }}
                    size="medium"
                  />
                  <View
                    style={{ justifyContent: 'space-around', marginLeft: 5 }}
                  >
                    <Text>{userPrimary?.userNickname}</Text>
                    <Text>
                      {commentItemList &&
                        commentItemList[0] &&
                        timeConvert(commentItemList[0].commentDate, 0)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {tagInfo.map((item, index) => (
                  <View style={styles.smallTagItem} key={index}>
                    <Text style={styles.smallTagText}>{item.projectName}</Text>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 8 }}>
                <ExpandableText
                  numberOfLines={3}
                  expandView={() => (
                    <View>
                      <Text style={{ display: 'none' }}>展开全部</Text>
                    </View>
                  )}
                >
                  <Text>
                    {commentItemList &&
                      commentItemList[0] &&
                      commentItemList[0].content}
                  </Text>
                </ExpandableText>
              </View>
              <Divider style={[styles.line]} />
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <Content type="full" showBg={true} title={groupName}>
      {renderCardInfo()}
      {renderInquiryWay()}
      {renderHeatConsults()}
      {renderCommentListComponent()}
    </Content>
  );
};

export default OnlineConsultation;

const styles = StyleSheet.create({
  selectItem: {
    marginLeft: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  line: {
    marginVertical: 10,
    backgroundColor: '#E5E5E5',
  },
  tagItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minWidth: 100,
    height: 28,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    borderColor: '#B2B2B2',
    borderWidth: 1,
    marginRight: 10,
    marginVertical: 5,
  },
  tagActive: {
    backgroundColor: '#E7F4FE',
    borderColor: '#3385FF',
  },
  tagTextActive: {
    color: '#3385FF',
  },
  tagText: {
    fontSize: smallfontSize,
    color: '#B2B2B2',
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
  // line: {
  //   marginVertical: 15,
  //   backgroundColor: borderLineColor,
  // },
  timesBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fontColor: { color: fontColor, fontSize: subfontSize },
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
  smallTagItem: {
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
  smallTagText: {
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
    fontWeight: 'bold',
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
  cardStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: contentSpace,
    width: (WIDTH - 32) / 3 - 6,
    height: 164,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: 'blue',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 2,
  },
  cardTextStyle: {
    fontSize: subfontSize,
    color: fontColor,
    fontWeight: 'bold',
  },
  peopleCount: {
    color: '#F78E00',
    fontSize: 14,
  },
});
