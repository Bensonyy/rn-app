import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'react-native-elements';
import { fontSize } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';

const BottomView = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/kefu/kefu.png')}
        style={{
          height: 42,
          width: 40,
          marginRight: 32,
          marginTop: 4,
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.back}>返回</Text>
      </TouchableWithoutFeedback>
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
    justifyContent: 'flex-end',
    marginRight: 20,
  },

  back: {
    height: 44,
    width: 100,
    fontSize,
    textAlign: 'center',
    lineHeight: 44,
    borderStyle: 'solid',
    color: '#3385FF',
    borderColor: '#3385FF',
    borderRadius: 22,
    borderWidth: 1,
  },
});
