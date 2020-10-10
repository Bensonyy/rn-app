import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

function WebviewDemo({ route, navigation }) {
  const onPress = () => {
    navigation.navigate('H5');
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="跳转到H5" onPress={onPress} />
    </View>
  );
}

export default WebviewDemo;
