import React, {
  useRef,
  useState,
  useEffect,
  Fragment,
  useCallback,
} from 'react';
import WS from 'react-native-websocket';
import { useIsFocused } from '@react-navigation/native';
import Toast from '../Toast';
import { getWsUri } from '../../api';

/**
 * msgType 消息内容
 * 0:text 文字
 * 1:image  图片
 * 2:voice  声音
 * 3:vedio 视频
 * 4:music 音乐
 * 5:news 新闻
 * 6:map 地图
 */

// {
//   "chatId":"111",
//   "fromUserId":"22",
//   "fromUserName":"22",
//   "toUserId":"11",
//   "toUserName":"11",
//   "content":"hello",
//   "msgType":"text"
//  }

const WSocket = ({
  msg = {},
  isSendMsg = true,
  onMessage = () => {},
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reconnect, setReconnect] = useState(true);
  const isFocused = useIsFocused();
  let wsRef = useRef(null);

  const { fromUserId, toUserId, content, msgType, fromUserName } = msg;
  const { text, image, medicalId } = content || {};

  useEffect(() => {
    if (isFocused) {
      setReconnect(true);
    }
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    if (isSendMsg) {
      if (wsRef && isOpen && toUserId) {
        console.log(msg, 'webSocket msg');
        wsRef.send(JSON.stringify(msg));
      }
    }
    return () => {
      setReconnect(false);
      wsRef?.current?.close();
    };
  }, [
    isOpen,
    text,
    image,
    medicalId,
    msgType,
    fromUserName,
    fromUserId,
    toUserId,
  ]);

  const onError = useCallback((e) => {
    Toast('服务连接异常,请返回重新进入');
    console.log(e, 'onError websocket');
  }, []);

  const onClose = useCallback((e) => {
    setTimeout(() => {
      setReconnect(true);
    }, 300);
    console.log(e, 'onClose websocket');
  }, []);

  return (
    <Fragment>
      {fromUserId ? (
        <WS
          ref={(ref) => (wsRef = ref)}
          url={getWsUri({ userId: fromUserId })}
          onOpen={() => {
            setIsOpen(true);
          }}
          // onMessage={console.log}
          onError={onError}
          onClose={onClose}
          onMessage={onMessage}
          {...rest}
          reconnect={reconnect} // Will try to reconnect onClose
        />
      ) : null}
    </Fragment>
  );
};

export default WSocket;
