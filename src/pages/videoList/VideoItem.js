import React from 'react';
import { StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ShortVideoItem } from '../../components';

const VideoItem = () => {
  const route = useRoute();
  const item = route?.params?.item ?? null;
  return item ? (
    <ShortVideoItem {...item} paused={false} isSingle={true} />
  ) : null;
};

export default VideoItem;

const styles = StyleSheet.create({});
