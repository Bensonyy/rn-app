import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Rating, Divider } from 'react-native-elements';
import { tagBgColor, tagColor, tagSize, subfontSize } from '../../theme';
import { AvatarCom } from '../../components';
import ExpandableText from 'rn-expandable-text';
import { getCommentAllistByBizId } from '../../api';
import { timeConvert } from '../../utils';
const Evaluate = (props) => {
  const { groupId } = props;
  const mockData = [
    {
      id: 0,
      avatarUrl:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      name: '李玄',
      time: '2020.09.27',

      ratingCount: 4,
      desc:
        '李医生看病耐心细致，思路清晰，根据我的个人情况给出了很好的诊疗方案及后续治疗计',
      groupProject: [
        { projectName: '门诊详细' },
        { projectName: '答复及时' },
        { projectName: '解释到位' },
      ],
    },
    {
      id: 0,
      avatarUrl:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      name: '李玄',
      time: '2020.09.27',

      ratingCount: 4,
      desc:
        '李医生看病耐心细致，思路清晰，根据我的个人情况给出了很好的诊疗方案及后续治疗计',
      groupProject: [
        { projectName: '门诊详细' },
        { projectName: '答复及时' },
        { projectName: '解释到位' },
      ],
    },
    {
      id: 0,
      avatarUrl:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      name: '李玄',
      time: '2020.09.27',

      ratingCount: 4,
      desc:
        '李医生看病耐心细致，思路清晰，根据我的个人情况给出了很好的诊疗方案及后续治疗计',
      groupProject: [
        { projectName: '门诊详细' },
        { projectName: '答复及时' },
        { projectName: '解释到位' },
      ],
    },
    {
      id: 0,
      avatarUrl:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      name: '李玄',
      time: '2020.09.27',

      ratingCount: 4,
      desc:
        '李医生看病耐心细致，思路清晰，根据我的个人情况给出了很好的诊疗方案及后续治疗计',
      groupProject: [
        { projectName: '门诊详细' },
        { projectName: '答复及时' },
        { projectName: '解释到位' },
      ],
    },
  ];
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getCommentAllistByBizId.fetch(
        groupId
      );
      if (result === 'success') {
        setCommentList(data);
        console.log(JSON.stringify(data), 'formData');
      } else {
        console.log('失败');
      }
    };
    fetchData();
  }, [groupId]);
  const Item = ({ data }) => {
    const { userPrimary, commentItemList } = data;
    console.log(data, 'data');
    // console.log(commentItemList);
    //先写死
    const groupProject = [
      { projectName: '门诊详细' },
      { projectName: '答复及时' },
      { projectName: '解释到位' },
    ];
    return (
      <View style={{ marginHorizontal: 16 }}>
        <View
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
            <View style={{ justifyContent: 'space-around', marginLeft: 5 }}>
              <Text>{userPrimary?.userNickname}</Text>
              <Rating
                imageSize={16}
                ratingColor="#F78E00"
                ratingCount={5}
                startingValue={data.grade}
                readonly
              />
            </View>
          </View>

          <Text>
            {commentItemList &&
              commentItemList[0] &&
              timeConvert(commentItemList[0].commentDate, 0)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {groupProject.map((item, index) => (
            <View style={styles.tagItem} key={index}>
              <Text style={styles.tagText}>{item.projectName}</Text>
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
      </View>
    );
  };
  const renderItem = ({ item }) => <Item data={item} />;
  return (
    <FlatList
      data={commentList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
const styles = StyleSheet.create({
  tagItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minWidth: 64,
    height: 18,
    backgroundColor: tagBgColor,
    borderRadius: 100,
    marginRight: 10,
    marginVertical: 5,
  },
  tagText: {
    fontSize: tagSize,
    color: tagColor,
  },
});
export default Evaluate;
