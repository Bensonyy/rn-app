import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

export const primary = '#3385FF'; // 主色调
export const backgroundColor = '#fff'; // 主背景色
export const projectColor = '#666666'; //选择项目色号
export const fontColor = '#333333'; // 主字体颜色
export const subColor = '#999999'; // 次级字体颜色
export const borderLineColor = '#f2f2f2'; // 分割线颜色
export const smallColor = '#fff';
export const largeSize = 22; //最大字号
export const fontSize = 18; // 主字号
export const subfontSize = 16; // 主字号
export const tagSize = 12; // 标签字号
export const tagColor = '#369AED'; //标签色号
export const tabBackgroundColor = '#fff'; // 首页 tab 的背景色
export const statusBarStyle = 'dark';
export const videoBackgroundColor = '#1A1A1A'; // 视频背景色
export const tagBgColor = '#EAF4FD'; //标签北京颜色
export const smallfontSize = 14; // 小字号
export const fontColorHome = '#fff';
export const fontColorWhite = '#fff';
export const placeholderColor = '#BEBEBE'; //placeholder色号
export const red = '#FF0000';
export const ratingColor = '#F78E00'; //评分字号
export const ratingFontSize = 32; //评分字号
export const defaultBackground = '#FAFAFA';
export const orderBackground = '#F0F0F0';
export const orange = '#FAB02E';
//间距和高度
export const contentSpace = 16; //内容距离屏幕边缘
export const widgetSpace = 10; //内容距离屏幕边缘

export const theme = {
  base: {
    primary,
  },
  light: {
    background: backgroundColor,
    text: fontColor,
  },
  dark: {
    background: '#222222',
    text: '#ffffff',
  },
};

export const lightTheme = () => {
  const { text, background } = theme.light;
  const { primary } = theme.base;

  return {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      background,
      text,
      primary,
      leftBtnColor: primary,
      headerTitleStyle: text,
    },
  };
};

export const darkTheme = () => {
  const { text, background } = theme.dark;
  return {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background,
      text,
    },
  };
};

// elementsTheme 主题色
export const elementsTheme = () => {
  return {
    Input: {
      inputStyle: {
        fontSize,
      },
    },

    Button: {
      buttonStyle: { borderRadius: 50, backgroundColor: primary },
      titleStyle: {
        color: fontColorHome,
        fontSize,
      },
    },
  };
};
