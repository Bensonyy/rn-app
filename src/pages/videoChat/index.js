import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Content } from '../../components';
import { fontColor, fontSize, fontColorWhite, subfontSize } from '../../theme';
import illness from '../../config/illness.json';
import Picker from 'react-native-picker';
import { getNavigationEnquiryList } from '../../api';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const activeObj = {
  0: {
    imgLeft: require('./img/manIcon.png'),
    imgBg: require('./img/man.png'),
    imgRight: require('./img/womanIcon.png'),
  },
  1: {
    imgLeft: require('./img/noActiveMan.png'),
    imgBg: require('./img/woman.png'),
    imgRight: require('./img/noActiveWomen.png'),
  },
};
const partColorObj = {
  brain: '#666666',
  lung: '#F55A42',
  liver: '#AF8AC6',
  stomach: '#FAB02E',
  ovary: '#54B9F8',
  mainBody: '#80C400',
};
export default (params) => {
  const navigation = useNavigation();
  const [status, setStatus] = useState(0);
  const [fetchData, setFetchData] = useState([]);
  const [selected, setSelected] = useState(['颅脑', '心脑血管病', '冠心病']);
  const createAreaData = () => {
    let data = [];
    let len = fetchData.length;
    for (let i = 0; i < len; i++) {
      let city = [];
      for (
        let j = 0, cityLen = fetchData[i].navigationEnquiry.length;
        j < cityLen;
        j++
      ) {
        const result = fetchData[i].navigationEnquiry[j].symptomList;
        let _city = {};
        let newSymptomList = [];
        for (let item of result) {
          item.symptomName && newSymptomList.push(item.symptomName);
        }
        _city[
          fetchData[i].navigationEnquiry[j].category.categoryName
        ] = newSymptomList;

        city.push(_city);
      }

      let _data = {};
      _data[fetchData[i].category.categoryName] = city;
      data.push(_data);
    }
    return data;
  };
  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getNavigationEnquiryList.fetch();
      if (result === 'success') {
        setFetchData(data);
      } else {
        console.log('失败');
      }
    };
    fetchData();
  }, []);
  const findData = (selected) => {
    for (let item of fetchData) {
      if (item.category.categoryName === selected[0]) {
        for (let y of item.navigationEnquiry) {
          if (y.category.categoryName === selected[1]) {
            for (let z of y.symptomList) {
              if (z.symptomName === selected[2]) {
                console.log(z.symptomName, 'symptomName');
                return z.symptomId;
              }
            }
          }
        }
      }
    }
  };
  const initPicker = (initData) => {
    Picker.init({
      pickerTitleText: '导诊',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerData: createAreaData(),
      selectedValue: initData,
      onPickerConfirm: (pickedValue) => {
        const diseaseId = findData(pickedValue);
        navigation.navigate('RecommendGroup', {
          diseaseId,
        });
      },
    });
    Picker.show();
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={activeObj[status].imgBg} style={styles.image}>
        <View style={styles.title}>
          <TouchableWithoutFeedback onPress={() => setStatus(0)}>
            <View>
              <Image source={activeObj[status].imgLeft} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ fontSize, color: fontColorWhite }}>导诊</Text>
          <TouchableWithoutFeedback onPress={() => setStatus(1)}>
            <Image source={activeObj[status].imgRight} />
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['颅脑']);
          }}
        >
          <View style={[styles.partBtn, { left: 20, top: 90 }]}>
            <View
              style={[
                styles.btnCircle,
                {
                  backgroundColor: partColorObj.brain,
                },
              ]}
            ></View>
            <Text style={[styles.btnText, { color: partColorObj.brain }]}>
              颅脑
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['心肺']);
          }}
        >
          <View style={[styles.partBtn, { left: 20, top: 150 }]}>
            <View
              style={[
                styles.btnCircle,
                {
                  backgroundColor: partColorObj.lung,
                },
              ]}
            ></View>
            <Text style={[styles.btnText, { color: partColorObj.lung }]}>
              心肺
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['肝胆']);
          }}
        >
          <View style={[styles.partBtn, { left: 20, top: 200 }]}>
            <View
              style={[
                styles.btnCircle,
                {
                  backgroundColor: partColorObj.liver,
                },
              ]}
            ></View>
            <Text style={[styles.btnText, { color: partColorObj.liver }]}>
              肝胆
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['肠胃']);
          }}
        >
          <View style={[styles.partBtn, { left: 20, top: 260 }]}>
            <View
              style={[
                styles.btnCircle,
                {
                  backgroundColor: partColorObj.stomach,
                },
              ]}
            ></View>
            <Text style={[styles.btnText, { color: partColorObj.stomach }]}>
              肠胃
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['肾脏']);
          }}
        >
          <View style={[styles.partBtn, { left: 20, top: 430 }]}>
            <View
              style={[
                styles.btnCircle,
                {
                  backgroundColor: partColorObj.ovary,
                },
              ]}
            ></View>
            <Text style={[styles.btnText, { color: partColorObj.ovary }]}>
              {status ? '子宫' : '肾脏'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['头颈']);
          }}
        >
          <View style={[styles.partBtn, { right: 20, top: 90 }]}>
            <Text style={[styles.btnText, { color: partColorObj.mainBody }]}>
              头颈
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['躯干']);
          }}
        >
          <View style={[styles.partBtn, { right: 20, top: 230 }]}>
            <Text style={[styles.btnText, { color: partColorObj.mainBody }]}>
              躯干
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['四肢']);
          }}
        >
          <View style={[styles.partBtn, { right: 20, bottom: 300 }]}>
            <Text style={[styles.btnText, { color: partColorObj.mainBody }]}>
              四肢
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            initPicker(['皮肤']);
          }}
        >
          <View style={[styles.partBtn, { right: 20, bottom: 120 }]}>
            <Text style={[styles.btnText, { color: partColorObj.mainBody }]}>
              皮肤
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: screenWidth,
  },
  partBtn: {
    position: 'absolute',
    width: 68,
    height: 28,
    backgroundColor: fontColorWhite,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCircle: {
    width: 4,
    height: 4,
    borderRadius: 100,
    marginRight: 5,
  },
  btnText: {
    fontSize: subfontSize,
    fontWeight: '600',
  },
  title: {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 20,
    top: 40,
    flexDirection: 'row',
  },
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
  },
  absolute: {
    position: 'absolute',
    height: 500,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  text: {
    flex: 1,
    color: fontColor,
    textAlignVertical: 'center',
    textAlign: 'center',
    height: screenHeight,
    fontSize: 16,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
