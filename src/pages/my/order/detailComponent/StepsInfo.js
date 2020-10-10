import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../../components';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { primary, fontColor, subfontSize, subColor } from '../../../../theme';

const StepsInfo = ({ stepData, activeStep, isComplete = false }) => {
  return (
    <Card
      containerStyle={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <Text style={styles.tittle}>
        {isComplete ? '订单已完成' : '正在为您处理订单，请耐心等待'}
      </Text>
      <View style={{ flex: 1 }}>
        <ProgressSteps
          activeStep={activeStep}
          isComplete={isComplete}
          activeStepIconBorderColor={primary}
          completedProgressBarColor={primary}
          completedStepIconColor={primary}
          borderWidth={2}
          activeLabelColor={subColor}
          activeStepNumColor={primary}
          completedLabelColor={primary}
          marginBottom={-50}
          topOffset={10}
        >
          {stepData.map((item, index) => (
            <ProgressStep
              key={index}
              label={item.name}
              nextBtnDisabled
              previousBtnDisabled
              nextBtnTextStyle={{ display: 'none' }}
              previousBtnTextStyle={{ display: 'none' }}
            />
          ))}
        </ProgressSteps>
      </View>
    </Card>
  );
};

export default StepsInfo;

const styles = StyleSheet.create({
  tittle: {
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize: subfontSize,
    color: fontColor,
  },
});
