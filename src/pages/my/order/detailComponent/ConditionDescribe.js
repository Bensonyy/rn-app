//病情描述
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../../components';
import {
  fontColor,
  fontSize,
  borderLineColor,
  subfontSize,
  projectColor,
} from '../../../../theme';

const ConditionDescribe = ({ chiefComplaint }) => {
  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <Text style={styles.title}>病情描述</Text>
      <View style={styles.line} />
      <Text
        style={{ fontSize: subfontSize, color: projectColor, lineHeight: 24 }}
      >
        {chiefComplaint}
      </Text>
    </Card>
  );
};

export default ConditionDescribe;

const styles = StyleSheet.create({
  title: {
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize: fontSize,
    color: fontColor,
  },

  line: {
    height: 1,
    backgroundColor: borderLineColor,
    marginBottom: 5,
    marginTop: 8,
  },
});
