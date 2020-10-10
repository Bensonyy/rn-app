import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Card } from '../../../../components';
import {
  fontColor,
  subfontSize,
  subColor,
  borderLineColor,
  projectColor,
} from '../../../../theme';
import { Icon } from 'react-native-elements';
import { timeConvert } from '../../../../utils';
import { useNavigation } from '@react-navigation/native';

const AddressInfo = ({ detailData }) => {
  const { orderNurseItemList = [] } = detailData;
  const { startTime, excuteStaffId } = orderNurseItemList[0] || {};
  const navigation = useNavigation();

  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <View>
        <Text style={styles.tittle}>
          工作人员已于{timeConvert(startTime, 1)}出发
        </Text>

        <View style={styles.line} />

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('PathTrack', {
              dest: `${detailData.longitude},${detailData.latitude}`,
              fromUserId: detailData.userId, //用户id
              toUserId: excuteStaffId, //医生id
            });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 48, height: 48 }}
              source={require('../../img/ic_address.png')}
            />
            <Text style={styles.address}>{detailData?.userAddr}</Text>
            <Icon
              type={'simple-line-icon'}
              name="arrow-right"
              size={14}
              color={subColor}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Card>
  );
};

export default AddressInfo;

const styles = StyleSheet.create({
  tittle: {
    lineHeight: 40,
    fontSize: subfontSize,
    color: fontColor,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  address: {
    color: projectColor,
    fontSize: subfontSize,
    flex: 1,
    marginLeft: 10,
  },

  line: {
    height: 1,
    backgroundColor: borderLineColor,
    marginBottom: 16,
    marginTop: 10,
  },
});
