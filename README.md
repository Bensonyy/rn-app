# react-native 脚手架

从零开始做互联医院项目 App 开发

### 技术选型

- react-native 跨平台 app 框架
- react-navigation5 路由
- react-native-elements UI 基础组件库
- swr 请求后台接口(最具潜力的 Hook http 请求库)
- expo 开发调试器

# 开发调试（两种方式）：

### Expo 快速模式

- 全局安装 expo-cli: npm install -g expo-cli
- 项目根目录执行 yarn web, 会自动打开浏览器 web 页出现二维码，手机需安装 Expo App 扫描二维码进行开发调试，代码改动保存后会实时更新视图

### React-Native-cli 模式（本项目推荐）

- USB 连接真机，执行 yarn android 命令，会自动安装开发模式下生成的 apk 到手机安装，代码改动手机端能实时呈现

### 如何增加一个业务页面

- 在 pages 目录新建页面 js, 如: pages/home/Home.js
- 页面 js 需包含以下基本结构：

```
import React from 'react';
import { View, Text } from 'react-native';
import { Content } from '../../components';

export default function Demo() {
  return (
    <Content>
      <View>
        <Text>新建业务页面</Text>
      </View>
    </Content>
  );
}

// Content 是封装好的主内容区布局组件，这个组件的设计主要负责处理所有页面共用逻辑及平台兼容性问题，目前已集成 SafeAreaView, ScrollView 功能;
// Content 的 props 支持传 type , 如：<Content type="full" /> 表示主内容区占满手机屏幕, 不传默认是有间距的
```

# 关于 webview 中 APP 与 H5 通信

App 端已经封装了 JSBridge 实现 App 与 H5 相互通信，把 JSBridge 类实例注入到了 H5 页面中的 window 对象下，所以 H5 中通过 window.AppJSBridge 可访问 JSBridge 的所有方法与属性，由于注入是异步的，在 window.AppJSBridgeOnReady 回调中才能调用实例方法和属性。

### H5 页面中通过 window.AppJSBridge.callNative 与 App 通信：

```
/**
* callNative(type, params, callback)
* @param {type} 调 RN 的服务标识
* @param {params 可选} 向 RN 传递参数
* @param {callback} RN 处理后回调 web
*/
window.AppJSBridgeOnReady = function() {
    alert(JSON.stringify(window.AppJSBridge.appInfo))
    window.AppJSBridge.callNative('getLoginInfo', {}, data => {
      alert(JSON.stringify(data))
    })
 }
```

# 代码规范

### 事件函数以 on 开头，如：

```
<BtnCom title="确认支付" onPress={onPay} />
```

### JSX 虚拟 DOM 结构以 render 开头，如：

```
const renderForm = () => {
  return (
    <View style={styles.formBox}>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <FormInput
            inputStyle={[styles.input]}
            onBlur={onBlur}
            leftIcon={(style) => <Text style={[style]}>联系人</Text>}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="userName"
        rules={{ required: true }}
      />
    </View>
  );
};

return (
  <Content>
    <View style={styles.selectItem}>
      {groupProject.map((item, index) => (
        <Button
          containerStyle={[styles.selectItemButton]}
          key={index}
          title={item.projectName}
          onPress={() => setSelectedIndex(index)}
          type={selectIndex === index ? 'solid' : 'outline'}
        />
      ))}
    </View>
    {renderForm()}
  </Content>
);
```

# 代码风格统一

- 代码格式化插件 Prettier - Code formatter

# 优雅的提交代码使用 git-cz :

1. package.json 中已经集成了 git-cz 相关命令

```
"ct": "git add . && git-cz",
```

因此可以使用 yarn ct 提交代码

<strong>git-cz 地址： https://www.npmjs.com/package/git-cz</strong>

# 郑重说明：

### 此项目是公司商业项目，仅供个人学习使用，不得复用或抄袭此项目中的设计交互和图标，

### 主要业务模块：地理定位，微信/支付宝支付，IM 聊天和在线视频等功能
