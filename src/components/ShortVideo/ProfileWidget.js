import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';

const RightWidget = ({ description }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.profile}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={styles.title}>@张医生</Text>
        </View>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
            styles.displayNone,
          ]}
        >
          <Button
            title="健康咨询"
            type="clear"
            containerStyle={[
              styles.btnContainerStyle,
              {
                backgroundColor: 'rgba(236, 128, 141, 0.5)',
              },
            ]}
            titleStyle={styles.btnTitleStyle}
            onPress={() => navigation.navigate('OnlineConsultation')}
          />

          <Button
            title="医护到家"
            type="clear"
            containerStyle={[
              styles.btnContainerStyle,
              {
                backgroundColor: 'rgba(2, 167, 240, 0.5)',
              },
            ]}
            titleStyle={styles.btnTitleStyle}
            onPress={() => navigation.navigate('HomeCare')}
          />
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
    </View>
  );
};

export default React.memo(RightWidget);

const styles = StyleSheet.create({
  profile: {
    position: 'absolute',
    bottom: 15,
    paddingHorizontal: 15,
  },
  description: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
  displayNone: {
    display: 'none',
  },
  btnContainerStyle: {
    borderRadius: 10,
    marginLeft: 10,
    marginTop: -10,
    width: 80,
  },
  btnTitleStyle: {
    color: '#fff',
    fontSize: 14,
    height: 20,
    marginTop: -5,
  },
});
