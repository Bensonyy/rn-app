import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import VideoRecord from './VideoList.js';
import Evaluate from './Evaluate.js';
import { Avatar, Divider, Icon, Button, Rating } from 'react-native-elements';
import { Content, GroupInfoComponent } from '../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootContext } from '../../components/Context.js';

import {
  fontSize,
  fontColor,
  largeSize,
  smallfontSize,
  ratingFontSize,
  ratingColor,
  subfontSize,
  primary,
  subColor,
  smallColor,
  borderLineColor,
  tagSize,
  tagColor,
  tagBgColor,
  projectColor,
} from '../../theme';
import ExpandableText from 'rn-expandable-text';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import {
  getVideoRecord,
  getGroupInfoById,
  getGroupProjectByGroupId,
} from '../../api';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const Profile = (params) => {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = route.params.groupId;
  const { getLoginInfo } = useContext(RootContext);
  //  const loginInfo = await getLoginInfo();
  //       const userId = loginInfo?.userId;
  const [isCollect, setCollect] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [groupProject, setGroupProject] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [headDoctorInfo, setHeadDoctorInfo] = useState({});
  const fetchData = useCallback(
    ({ groupId }) => {
      const fetchData = async () => {
        setIsLoading(true);
        const loginInfo = await getLoginInfo();
        const userId = loginInfo?.userId;
        const { result, data: resData, message } = await getGroupInfoById.fetch(
          {
            groupId,
            userId: userId ? userId : '',
          }
        );
        if (result === 'success') {
          console.log(resData, 'resData');
          setGroupInfo(resData);
          setHeadDoctorInfo(resData.headDoctorInfo);
          setCollect(resData.isCollect);
        }
        setIsLoading(false);
      };
      const fetchProjectData = async () => {
        const {
          result,
          data: projectData,
          message,
        } = await getGroupProjectByGroupId.fetch({ groupId });
        if (result === 'success') {
          setGroupProject(projectData);
        }
      };
      fetchData();
      fetchProjectData();
    },
    [groupId]
  );

  useEffect(() => {
    fetchData({ groupId });
  }, [groupId]);

  return (
    <Content type="full" style={styles.container}>
      <GroupInfoComponent
        headDoctorInfo={headDoctorInfo}
        isCollect={isCollect}
        groupId={groupId}
        styleObj={{
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      />
      <View style={styles.ratingBox}>
        <View style={styles.ratingLeft}>
          <Text style={{ color: ratingColor, fontSize: ratingFontSize }}>
            4.8
          </Text>
          <Text style={{ color: projectColor, fontSize: smallfontSize }}>
            综合评分
          </Text>
          <Divider
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
              backgroundColor: borderLineColor,
              height: 24,
              width: 1,
            }}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>医护上门满意度</Text>
            <Rating
              imageSize={14}
              ratingColor="#F78E00"
              ratingCount={5}
              startingValue={4}
              readonly
              style={{ paddingHorizontal: 10 }}
            />
            <Text style={{ color: ratingColor }}> 4.8</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
            }}
          >
            <Text>在线问诊满意度</Text>
            <Rating
              imageSize={14}
              ratingColor="#F78E00"
              ratingCount={5}
              startingValue={4}
              readonly
              style={{ paddingHorizontal: 10 }}
            />
            <Text style={{ color: ratingColor }}> 4.8</Text>
          </View>
          <View>
            <Text style={{ color: subColor, fontSize: tagSize }}>
              {'团队服务 7891 人'} / {'3791人参与评分'}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.tabContainer, { flex: 1 }]}>
        <ScrollableTabView
          tabBarUnderlineStyle={{
            backgroundColor: '#ffffff',
            left: screenWidth / 7 - 9,
            width: 26,
            height: 2,
          }}
          tabBarActiveTextColor="#3385FF"
          tabBarInactiveTextColor="#999999"
          initialPage={0}
          onChangeTab={(i, ref) => {
            console.log(i, 'i');
          }}
          renderTabBar={() => <DefaultTabBar />}
        >
          <ScrollView tabLabel="简介">
            <View>
              <View style={styles.item}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: primary,
                      borderRadius: 50,
                      marginRight: 5,
                    }}
                  ></View>
                  <Text style={{ color: fontColor, fontSize: subfontSize }}>
                    专业擅长
                  </Text>
                </View>
                <ExpandableText
                  numberOfLines={4}
                  unexpandView={() => (
                    <Text style={styles.readMeExpandText}>收起</Text>
                  )}
                  expandView={() => (
                    <View style={styles.readMeExpandText}>
                      <Text style={{ color: '#666666' }}>展开全部</Text>
                      <Icon
                        type={'antdesign'}
                        name="down"
                        size={14}
                        color={'#666666'}
                      />
                    </View>
                  )}
                >
                  <Text style={{ fontSize: subfontSize }}>
                    {groupInfo.groupIntroduce}
                    {/* 2型和I型糖尿病的综合治疗，擅长难治性糖尿病及严重
                    并发症的个性化治疗，治疗思路严谨独到，妊娠期糖尿病及妊娠甲状腺病的个体化治疗；甲状腺结节、甲亢以及甲减的全面治疗… */}
                  </Text>
                </ExpandableText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 16,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: primary,
                      borderRadius: 50,
                      marginRight: 5,
                    }}
                  ></View>
                  <Text style={{ color: fontColor, fontSize: subfontSize }}>
                    团队服务项目
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: -8,
                  }}
                >
                  {groupProject.map((item, index) => (
                    <View style={styles.tagItem} key={index}>
                      <Text style={styles.tagText}>{item.projectName}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View tabLabel="视频">
            <VideoRecord groupId={groupId} />
          </View>
          <View tabLabel="评价">
            <Evaluate groupId={groupId} />
          </View>
        </ScrollableTabView>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            marginVertical: 16,
            justifyContent: 'space-between',
          }}
        >
          <Image
            source={require('../../assets/kefu/kefu.png')}
            style={{
              height: 42,
              width: 40,
              marginRight: 12,
              marginTop: 4,
            }}
          />
          <Button
            title="在线问诊"
            buttonStyle={{
              backgroundColor: '#fff',
              marginRight: 10,
              marginLeft: 5,
            }}
            containerStyle={{ flex: 1 }}
            titleStyle={{
              color: primary,
            }}
            type="outline"
            onPress={() => {
              navigation.navigate('OnlineConsultation', {
                groupInfo: { groupId },
              });
            }}
          />
          <Button
            title="医护上门"
            buttonStyle={{
              marginLeft: 10,
            }}
            containerStyle={{ flex: 1 }}
            type="solid"
            onPress={() => {
              navigation.navigate('HomeCare', {
                groupInfo: { groupId },
              });
            }}
          />
        </View>
      </View>
    </Content>
  );
};

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
    minHeight: 700,
  },
  ratingLeft: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    // overflow: 'hidden',
    width: 90,
    // flex: 1,
  },
  absolute: {
    position: 'absolute',
    height: 300,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    width: screenWidth,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    width: screenWidth / 2,
    color: '#fff',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    // textIndent: -99999,
  },
  doctorBox: {
    display: 'flex',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    // paddingTop: 12,
  },
  ratingBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  tabContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  item: {
    marginVertical: 6,
    marginHorizontal: 6,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  readMeExpandText: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#666666',
    textAlign: 'left',
    marginTop: 12,
  },
  tagItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // paddingVertical: 8,
    minWidth: 44,
    height: 30,
    backgroundColor: tagBgColor,
    borderRadius: 50,
    marginLeft: 10,
    marginVertical: 5,
  },
  tagText: {
    fontSize: 14,
    color: tagColor,
    // lineHeight: 20,
  },
});
export default Profile;
