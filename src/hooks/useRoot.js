import React, { useState, useReducer, useMemo } from 'react';
import loginReducer from '../reducers/login';
import { Store, EE } from '../utils';

import { darkTheme, lightTheme, elementsTheme } from '../theme';

const initLoginState = {
  isLoading: true,
  token: null,
  userName: null,
};

const useRoot = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loginState, dispatch] = useReducer(loginReducer, initLoginState);

  const rootContext = useMemo(
    () => ({
      signIn: async (loginInfo) => {
        EE.emit('signIn', loginInfo);
        await Store.set('loginInfo', loginInfo);
        dispatch({
          type: 'updateState',
          payload: loginInfo,
        });
      },
      signOut: async () => {
        EE.emit('signOut');
        await Store.remove('loginInfo');
        // dispatch({
        //   type: 'updateState',
        //   payload: {
        //     token: null,
        //     userName: null,
        //   },
        // });
      },
      getLoginInfo: async () => {
        return await Store.get('loginInfo');
      },
      signUp: () => {}, // 注册
      toggleTheme: () => {
        setIsDarkTheme((isDarkTheme) => !isDarkTheme);
      },
      theme: isDarkTheme ? darkTheme() : lightTheme(),
      elementsTheme: elementsTheme(),
    }),
    [isDarkTheme, loginState]
  );

  return { rootContext, loginState, dispatch };
};

export default useRoot;
