import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import { Icon } from 'react-native-elements';
import convertToProxyURL from 'react-native-video-cache';
import { tabHeight } from '../../config';
import { videoBackgroundColor, fontColorHome } from '../../theme';
import AnimatedHeartView from './AnimatedHeartView';
import Loading from '../../components/Loading';
import RightWidget from './RightWidget';
import TopWidget from './TopWidget';
import { RootContext } from '../Context';
import { loveVideo, canceLove, followGroup, setVideoRead } from '../../api';
import Toast from '../Toast';
import { useNavigation } from '@react-navigation/native';
import { EE } from '../../utils';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
// 连续点击阈值 连续两次点击间隔小于阈值视为双击
const CLICK_THRESHOLD = 200;

const ShortVideoItem = (props) => {
  const [paused, setPaused] = useState(true);
  const [isLike, setLike] = useState(props.isLove || false);
  const [isCollect, setIsCollect] = useState(props.isCollect || false);
  const [loveCount, setLoveCount] = useState(props.loveCount);
  const [readCount, setReadCount] = useState(props.readCount);
  const [heartList, setHeartList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const lastClickTime = useRef(0);
  const pauseHandler = useRef();
  const { getLoginInfo } = useContext(RootContext);
  const [userId, setUserId] = useState('');
  const [videoProgress, setVideoProgress] = useState(null);
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const { isSingle } = props;

  const { groupInfo = {} } = props;
  const { groupId } = groupInfo || {};

  useEffect(() => {
    if (isFocused && props.currentItem === props.index) {
      const getLogin = async () => {
        const loginInfo = await getLoginInfo();
        if (loginInfo) {
          setUserId(loginInfo.userId);
        } else {
          setUserId('');
        }
      };
      getLogin();
    }
    return () => {};
  }, [isFocused, props.currentItem]);

  useEffect(() => {
    if (isFocused && props.currentItem === props.index) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isFocused, props.currentItem]);

  useEffect(() => {
    try {
      async function fetchUrl() {
        const localProxiedURL = await convertToProxyURL(props.fileUrl);
        setUrl(localProxiedURL);
      }
      fetchUrl();
    } catch (error) {
      setUrl(props.fileUrl);
    }
  }, [props.fileUrl]);

  useEffect(() => {
    EE.on('setIsCollect', ({ isCollect, groupId: _groupId }) => {
      if (groupId === _groupId) {
        setIsCollect(isCollect);
      }
    });
  }, [groupId]);

  const addHeartView = useCallback((heartViewData) => {
    setHeartList((list) => [...list, heartViewData]);
  }, []);

  const removeHeartView = useCallback((index) => {
    setHeartList((list) => list.filter((item, i) => index !== i));
  }, []);

  /**
   * 点赞/取消点赞
   */
  const onLike = useCallback(
    async (isCancel = true, _userId) => {
      if (isCancel) {
        //取消点赞
        const { result, data, message } = await canceLove.fetch({
          groupId,
          userId: userId || _userId,
          videoId: props.videoId,
        });
        if (result === 'success') {
          setLike(false);
          setLoveCount(loveCount - 1);
        }
      } else {
        //点赞
        const { result, data, message } = await loveVideo.fetch({
          groupId,
          userId: userId || _userId,
          videoId: props.videoId,
        });
        if (result === 'success') {
          setLike(true);
          setLoveCount(loveCount + 1);
        }
      }
    },
    [userId, setLike, loveCount]
  );

  /**
   * 关注
   */
  const onFollow = useCallback(
    async (_userId) => {
      const { result, data, message } = await followGroup.fetch({
        groupId,
        userId: userId || _userId,
      });
      if (result === 'success') {
        Toast({ message: '关注成功' });
        setIsCollect(true);
        EE.emit('setIsCollect', { isCollect: true, groupId });
      }
    },
    [userId, setIsCollect]
  );

  const handlerClick = useCallback(
    async (event) => {
      const { pageX, pageY } = event.nativeEvent;
      const heartViewData = {
        x: pageX,
        y: pageY - 60,
        key: new Date().getTime().toString(),
      };
      const currentTime = new Date().getTime();
      // 连续点击
      if (currentTime - lastClickTime.current < CLICK_THRESHOLD) {
        if (userId) {
          pauseHandler.current && clearTimeout(pauseHandler.current);
          addHeartView(heartViewData);
          onLike(isLike);
        } else {
          navigation.navigate('Login', {
            options: 'back',
          });
        }
      } else {
        pauseHandler.current = setTimeout(() => {
          setPaused((preValue) => !preValue);
        }, CLICK_THRESHOLD);
      }

      lastClickTime.current = currentTime;
    },
    [addHeartView, onLike, isLike, userId]
  );

  const setLoading = useCallback((_isLoading) => {
    setIsLoading(_isLoading);
  }, []);

  const onVideLoad = useCallback(async () => {
    setLoading(false);
    const { groupInfo, videoId } = props;
    // const { result, data, message } = await setVideoRead.fetch({
    //   groupId,
    //   videoId,
    // });
    const { read } = require('../../../mock/db.json');
    const { result, data, message } = read;
    if (result === 'success') {
      setReadCount(readCount + 1);
    }
  }, [readCount]);

  const renderOther = () => {
    return (
      <View style={styles.container}>
        {isLoading ? <Loading type="absolute" color={'#fff'} /> : null}
        {!isLoading && paused ? (
          <Image
            source={require('../../assets/play.png')}
            style={{
              height: 72,
              width: 72,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -34,
              marginTop: -34,
            }}
          />
        ) : null}
        {heartList.map(({ x, y, key }, index) => {
          return (
            <AnimatedHeartView
              x={x}
              y={y}
              key={key}
              onAnimFinished={() => removeHeartView(index)}
            />
          );
        })}
      </View>
    );
  };

  const containerHeight = isSingle ? HEIGHT : HEIGHT - tabHeight;
  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderGrant={handlerClick}
      onResponderTerminationRequest={() => true}
      style={[styles.container, { height: containerHeight }]}
    >
      {url ? (
        <Video
          source={{ uri: url }}
          // poster="http://himg.bdimg.com/sys/portrait/item/3b6a3536333630383633318715.jpg"
          // posterResizeMode="center"
          style={[styles.videoBox, { height: containerHeight }]}
          paused={paused}
          resizeMode={'cover'}
          repeat
          onLoad={onVideLoad}
          onLoadStart={() => setLoading(true)}
          onProgress={(data) => !videoProgress && setVideoProgress(data)}
        />
      ) : null}
      {isSingle ? null : (
        <TopWidget
          {...props}
          isLike={isLike}
          isCollect={isCollect}
          loveCount={loveCount}
          readCount={readCount}
          seekableDuration={videoProgress?.seekableDuration || 0}
          onLike={onLike}
          onFollow={onFollow}
        />
      )}
      {isSingle ? null : (
        <RightWidget
          {...props}
          isLike={isLike}
          isCollect={isCollect}
          loveCount={loveCount}
          onLike={onLike}
          onFollow={onFollow}
        />
      )}
      {renderOther()}
    </View>
  );
};

export default React.memo(
  ShortVideoItem,
  (preValue, nextValue) =>
    preValue.id === nextValue.id && preValue.paused === nextValue.paused
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBox: {
    width: WIDTH,
    backgroundColor: videoBackgroundColor,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  displayNone: {
    display: 'none',
  },
});
