export default (prevState, { type, payload }) => {
  const { token } = payload;
  switch (type) {
    case 'updateState':
      if (token === null) {
        return {};
      }
      return {
        ...prevState,
        ...payload,
      };
    case 'getLoginInfo':
      return {
        ...prevState,
      };
  }
};
