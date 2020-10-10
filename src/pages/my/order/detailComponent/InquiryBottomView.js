import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';
import { fontSize, projectColor, primary } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { Button, Toast } from '../../../../components';

const BottomView = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/kefu/kefu.png')}
        style={{
          height: 42,
          width: 40,
          marginRight: 20,
          marginTop: 4,
        }}
      />

      <Button
        title={'返回'}
        titleStyle={{ fontSize: fontSize, color: projectColor }}
        type="outline"
        buttonStyle={styles.back}
        onPress={() => {
          navigation.goBack();
        }}
      />

      {/* <Button
        title={'联系医生'}
        titleStyle={{ fontSize: fontSize, color: primary,  }}
        type="outline"
        buttonStyle={styles.contact}
        onPress={() => {
          Toast({
            message: '此功能正在开发中',
          });
        }}
      /> */}
    </View>
  );
};

export default BottomView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginBottom: 20,
    marginTop: 40,
    justifyContent: 'flex-end',
    marginRight: 20,
  },

  back: {
    height: 44,
    width: 100,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderColor: projectColor,
  },

  contact: {
    height: 44,
    width: 104,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderColor: primary,
  },
});
