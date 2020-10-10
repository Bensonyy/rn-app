import React, { useState, useEffect } from 'react';
import { Text, Icon } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import {
  fontSize,
  fontColor,
  smallfontSize,
  primary,
  projectColor,
  tagSize,
  subColor,
} from '../../theme';
import { TouchableItem } from '../Shared';
import { Loading } from '../../components';
import SafeAreaView from 'react-native-safe-area-view';
export const ProjectList = (props) => {
  const [selectIndex, setSelectedIndex] = useState(null);
  const {
    groupProject,
    callback,
    type,
    isLoading = false,
    isTip = false,
    title,
    ...otherProps
  } = props;
  useEffect(() => {
    console.log(selectIndex);
    selectIndex !== null && callback({ selectIndex });
  }, [selectIndex]);
  if (isLoading) {
    return (
      <SafeAreaView>
        <Loading />
      </SafeAreaView>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 16, marginHorizontal: 10 }}>
        <View style={styles.choiceBox}>
          <View style={styles.blueCircle}></View>
          <Text style={styles.choiceTitle}>{title}</Text>
          {/* <View style={styles.queryAll}>
            <Text>查看全部</Text>
            <Icon type={'antdesign'} name="right" size={14} color={'#666666'} />
          </View> */}
        </View>
      </View>
      {isTip && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 5,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: tagSize,
              color: subColor,
              paddingHorizontal: 23,
            }}
          >
            仅显示可预约的日期 最早可提前
            <Text style={{ color: '#FAB02E' }}> 4 </Text>天预约
          </Text>
        </View>
      )}

      <View style={styles.selectItem}>
        {groupProject.map((item, index) => (
          <TouchableItem
            onPress={() => {
              // console.log(index, '父');
              setSelectedIndex(index);
            }}
            key={index}
          >
            <View
              style={[
                selectIndex === index
                  ? styles.borderActive
                  : styles.selectItemButton,
                type === 'group'
                  ? { width: '46%' }
                  : {
                      width: '30%',
                    },
              ]}
              key={index}
            >
              {type === 'group' ? (
                <>
                  <Text
                    style={[
                      styles.selectDefault,
                      selectIndex === index
                        ? styles.selectActive
                        : styles.selectDefault,
                    ]}
                  >
                    {item.projectName}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#999999',
                      fontSize: 14,
                      paddingTop: 10,
                      paddingRight: 16,
                    }}
                  >
                    {item?.groupProjectItem
                      ? item.groupProjectItem.projectDesc
                      : ''}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.selectDefault,
                      selectIndex === index
                        ? styles.selectActive
                        : styles.selectDefault,
                    ]}
                  >
                    {item.date}
                  </Text>
                  <Text style={{ paddingVertical: 4 }}>
                    <Text>{item.week} </Text>
                    {item.time}
                  </Text>
                  <Text>{item.schedule}</Text>
                </>
              )}
            </View>
          </TouchableItem>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  selectItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
  },
  selectItemButton: {
    display: 'flex',
    // justifyContent: 'center',
    // paddingHorizontal: 6,
    paddingLeft: 12,
    paddingTop: 12,
    borderRadius: 10,
    width: '46%',
    minHeight: 92,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginLeft: 10,
  },
  selectDefault: {
    color: projectColor,
    fontWeight: 'bold',
    fontSize: smallfontSize,
  },
  borderActive: {
    display: 'flex',
    paddingTop: 12,
    borderRadius: 10,
    backgroundColor: '#EAF4FD',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: primary,
    marginTop: 12,
    marginLeft: 10,
    paddingLeft: 12,
  },
  selectActive: {
    color: primary,
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
});
