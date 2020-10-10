const isProd = process.env.NODE_ENV === 'production';

export const config = {
  name: 'rn-app', // 项目名称
  apiUrl: isProd ? '' : 'http://127.0.0.1:8090', // api/index.js 中的接口地址
  wsUrl: isProd ? '' : 'ws://127.0.0.1:8090',
  publicKey: '', // 加密密钥
};

export const swrOptions = {
  errorRetryCount: isProd ? 5 : 0,
  refreshInterval: isProd ? 3000 : 0,
};

export const tabHeight = 49;
export const wxAppID = '';

export const ampWebKey = '10598c876777f3949c7ae4e5bf145942';
export const ampAndroidKey = '3f3ca6cd51a52122c17e587c202409b6';
