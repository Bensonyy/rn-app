import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
require('dayjs/locale/zh-cn');
import { GiftedChat, Actions, Send } from 'react-native-gifted-chat';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import initialMessages from './messages';
import Loading from '../Loading';
import { Icon, Image } from 'react-native-elements';
import { primary } from '../../theme';
import { PickImage } from '../FileHandler';
import WSocket from '../WebSocket';
import Toast from '../Toast';
import { fileUpload } from '../../api';

let _msgType = 'tuwen';

const ImChat = ({
  fromUserId,
  fromUserName,
  toUserId,
  toUserName,
  fromAvatar,
  toAvatar,
  token,
  medicalId,
  consulType,
}) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [imgUrl, setImgUrl] = useState('');
  const [isUploadImg, setIsUploadImg] = useState(false);
  const [imMsg, setImMsg] = useState({ medicalId });
  const [isSendMsg, setIsSendMsg] = useState(true);
  // const [wsMsg, setWsMsg] = useState({});

  useEffect(() => {
    // setMessages(initialMessages.reverse());
    return () => {
      _msgType = 'tuwen';
    };
  }, []);

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
        }}
        icon={() => <Icon type="antdesign" name="picture" color={primary} />}
        options={{
          从相册选择图片: async () => {
            setIsUploadImg(true);

            const ret = await PickImage({ type: 'launchImageLibrary' });
            const formData = new FormData();
            const query = {
              channalType: 0, // 所属平台（0公有云，1私有云,2腾讯云）
              fileType: 0, //文件类型(0 图片，1视频，2其他文件)
              token,
            };
            // for (const key of Object.keys(params)) {
            //   formData.append(key, params[key]);
            // }
            formData.append('file', ret);
            const { result, data, message } = await fileUpload.fetch({
              formData,
              query,
            });

            const { fileUrl } = data || {};

            // console.log(data, 'fileUpload');
            // setIsSendMsg(false);
            // setImgUrl(fileUrl);
            onSendImg({ url: fileUrl });
          },
          取消: () => {
            console.log('Cancel');
            // setIsUploadImg(false);
          },
        }}
      />
    );
  };

  const renderSend = (props) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <Icon type="font-awesome" name="send" color={primary} />
      </View>
    </Send>
  );

  const onSend = (newMessages = []) => {
    _msgType = 'text';
    setIsSendMsg(true);
    console.log(newMessages[0], 'newMessages[0]');
    setImMsg(newMessages[0]);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  const onRecieve = (fromMsg = []) => {
    setIsSendMsg(false);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, fromMsg));
  };

  const onSendImg = ({ url, ...rest }) => {
    const msg = {
      _id: uuidv4(),
      // _id: fromUserId,
      createdAt: Date.now(),
      user: {
        _id: fromUserId,
        name: fromUserName,
        avatar: fromAvatar,
      },
      image: url,
      ...rest,
    };
    onSend([msg]);
  };

  const onMessage = useCallback(({ data } = {}) => {
    const {
      content,
      fromUserName,
      fromUserId,
      msgType,
      fromAvatar,
    } = JSON.parse(data);
    if (msgType === 'text' || msgType === 'image') {
      const _content = JSON.parse(content);
      const { user } = _content;
      user?._id && onRecieve([_content]);
      console.log(data, 'D 端 message');
    } else if (msgType === 'error') {
      Toast({ message: content || '服务异常或者未上线' });
    }
  }, []);

  const wsMsg = {
    fromUserId,
    fromUserName,
    toUserId: _msgType === consulType ? `${toUserId}1111` : toUserId,
    toUserName,
    msgType: _msgType,
    content: imMsg,
  };

  return (
    <Fragment>
      <WSocket msg={wsMsg} isSendMsg={isSendMsg} onMessage={onMessage} />
      <GiftedChat
        messages={messages}
        // text={text}
        // onInputTextChanged={setText}
        onSend={onSend}
        user={{
          _id: fromUserId,
          name: fromUserName,
          avatar: fromAvatar,
        }}
        alwaysShowSend
        showUserAvatar
        renderAvatarOnTop
        // scrollToBottom
        bottomOffset={26}
        // onPressAvatar={() => {}}
        renderActions={renderActions}
        renderSend={renderSend}
        // messagesContainerStyle={{ backgroundColor: 'indigo' }}
        renderLoading={() => <Loading type="absolute" />}
        locale={'zh-cn'}
        placeholder="请输入病情描述"
        parsePatterns={(linkStyle) => [
          {
            pattern: /#(\w+)/,
            style: linkStyle,
            onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
          },
        ]}
      />
    </Fragment>
  );
};

export default ImChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 4,
  },
});
