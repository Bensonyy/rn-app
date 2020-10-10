import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import WSocket from '../WebSocket';

import { fontColorWhite, fontSize, videoBackgroundColor } from '../../theme';
import { flexStyle } from '../Shared';
import Sound from 'react-native-sound';

// 网络资源
const musciPath =
  'http://39.100.100.138/group1/M00/00/02/rBrFpl9xfFeAVWvaAADOkGeS5iA89..mp3';

const music = new Sound(musciPath, null, (error) => {
  if (error) {
    console.log('播放失败...');
  } else {
    music.setNumberOfLoops(1);
  }
});

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

let _msgType = 'video';

const OnLineVideo = ({
  onCallback = () => {},
  fromUserId,
  fromUserName,
  toUserId,
  toUserName,
  fromAvatar,
  toAvatar,
  token,
  medicalId,
  consulType,
  routeParams,
}) => {
  const [appId, setAppId] = useState('1eaad6e93a7d43ce86103757c08c2223');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [channelName, setChannelName] = useState('channel-x');
  const [peerIds, setPeerIds] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [wsMsg, setWsMsg] = useState({});
  const [endCall, setEndCall] = useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  let _engine;

  useEffect(() => {
    /**
     * @description Function to initialize the Rtc Engine, attach event listeners and actions
     */
    const init = async () => {
      _engine = await RtcEngine.create(appId);
      await _engine.enableVideo();

      _engine.addListener('Warning', (warn) => {
        console.log('Warning', warn);
      });

      _engine.addListener('Error', (err) => {
        console.log('Error', err);
      });

      _engine.addListener('UserJoined', (uid, elapsed) => {
        // console.log('UserJoined', uid, elapsed);
        // Get current peer IDs
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          setPeerIds([...peerIds, uid]);
          //有新用户接入时关闭铃声
          music.pause();
        }
      });

      _engine.addListener('UserOffline', (uid, reason) => {
        // console.log('UserOffline', uid, reason);

        if (!reason) {
          onEndCall();
        }

        const _peerIds = peerIds.filter((id) => id !== uid);
        setPeerIds(_peerIds);
      });

      // If Local user joins RTC channel
      _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        // console.log('JoinChannelSuccess', channel, uid, elapsed);
        // Set state variable to true
        setJoinSucceed(true);
      });

      await onStartCall();
    };
    init();
    return () => {};
  }, []);

  /**
   * @description Function to start the call
   */
  const onStartCall = useCallback(async () => {
    //开启铃声
    music.play();
    // Join Channel using null token and channel name
    await _engine?.joinChannel(null, channelName, null, 0);
  }, [_engine]);

  /**
   * @description Function to end the call
   */
  const onEndCall = useCallback(async () => {
    //关闭铃声
    music.pause();
    await _engine?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
    setEndCall(true);
    onCallback({ enableVideo: false });
    navigation.navigate('OnlineConsultation', { groupInfo: routeParams });
  }, [_engine]);

  const onSwitchCamera = useCallback(async () => {
    await _engine?.switchCamera();
  }, [_engine]);

  useEffect(() => {
    const asyncFn = async () => {
      if (videoEnabled) {
        await _engine?.enableVideo();
      } else {
        await _engine?.disableVideo();
      }
    };
    asyncFn();
  }, [videoEnabled, _engine]);

  useEffect(() => {
    if (!isFocused) {
      onEndCall();
    }
    return () => {};
  }, [isFocused, _engine]);

  const renderVideos = () => {
    console.log(peerIds, 'peerIds');
    return joinSucceed && peerIds.length ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {/* <ScrollView
          style={styles.remoteContainer}
          contentContainerStyle={{ paddingHorizontal: 2.5 }}
          horizontal={true}
        > */}
        {peerIds?.length
          ? peerIds.map((value, index, array) => {
              return (
                <RtcRemoteView.SurfaceView
                  key={index}
                  style={styles.remote}
                  uid={value}
                  channelId={channelName}
                  renderMode={VideoRenderMode.Hidden}
                />
              );
            })
          : null}
        {/* </ScrollView> */}
      </View>
    ) : null;
  };

  const onMessage = useCallback(({ data } = {}) => {
    const {
      content,
      fromUserName,
      fromUserId,
      msgType,
      fromAvatar,
    } = JSON.parse(data);
  }, []);

  useEffect(() => {
    const msg = {
      fromUserId,
      fromUserName,
      toUserId: _msgType === consulType ? `${toUserId}1111` : toUserId,
      toUserName,
      msgType: _msgType,
      content: endCall
        ? { type: 'close' }
        : {
            medicalId,
          },
    };
    setWsMsg(msg);
    return () => {};
  }, [fromUserId, toUserId, endCall, joinSucceed, medicalId, consulType]);

  return (
    <View style={styles.max}>
      <WSocket msg={wsMsg} onMessage={onMessage} />
      {renderVideos()}
      {peerIds?.length ? null : (
        <View style={[styles.videoItemBox, { bottom: 300, left: 140 }]}>
          <Text style={{ color: fontColorWhite, fontSize }}>
            {endCall === true ? '连接已断开' : '正在连接中…'}
          </Text>
        </View>
      )}
      {joinSucceed ? (
        <View style={styles.videoItemBox}>
          <TouchableOpacity
            onPress={() => {
              setVideoEnabled(!videoEnabled);
            }}
          >
            <Image
              source={require('./img/switchVoice.png')}
              style={[styles.itemBtn, { display: 'none' }]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onEndCall();
            }}
          >
            <Image
              source={require('./img/endCall.png')}
              style={styles.itemBtn}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // videoEnabled ? onSwitchCamera() : setVideoEnabled(true);
              onSwitchCamera();
            }}
          >
            <Image
              source={require('./img/switchCamera.png')}
              style={styles.itemBtn}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default OnLineVideo;

const styles = StyleSheet.create({
  max: {
    flex: 1,
    backgroundColor: videoBackgroundColor,
  },
  buttonHolder: {
    display: 'none',
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  remoteContainer: {
    // height: 150,
    // position: 'absolute',
    // top: 5,
  },
  remote: {
    position: 'absolute',
    top: 5,
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  videoItemBox: {
    position: 'absolute',
    bottom: 50,
    left: (dimensions.width - 180) / 2,
    width: 180,
    ...flexStyle.row,
    ...flexStyle.spaceBetween,
  },
  itemBtn: {
    width: 64,
    height: 64,
  },
});
