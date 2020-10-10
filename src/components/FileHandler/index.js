import React from 'react';
import { StyleSheet, Platform, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';

export const PickImage = async ({
  isVideo = false,
  type = 'showImagePicker',
} = {}) => {
  let options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true,
    },
    cancelButtonTitle: '取消',
  };

  if (isVideo) {
    options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium',
    };
  }
  try {
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      await request(PERMISSIONS.ANDROID.CAMERA);
    }

    return new Promise((resolve, reject) => {
      ImagePicker[type](options, (response) => {
        if (response.didCancel) {
          resolve({ action: 'didCancel' });
        } else if (response.error) {
          console.log(response.error, 'ImagePicker Error');
          reject({ action: 'error', error: response.error });
        } else if (response.customButton) {
          console.log(response.customButton, 'User tapped custom button');
          resolve({ action: 'customButton', customButton: true });
        } else {
          const { uri, type, fileSize, fileName } = response;
          resolve({ uri, type, name: fileName, fileSize });
        }
      });
    });
  } catch (error) {
    console.log(error, 'PickImage Error');
  }
};

const styles = StyleSheet.create({});
