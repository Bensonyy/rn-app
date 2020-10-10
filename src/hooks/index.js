import { useNavigationState, useRoute } from '@react-navigation/native';
import useRoot from './useRoot';
import useLocation from './useLocation';
import useUserInfo from './useUserInfo';

// 判断路由是否是父级状态中的第一个路由
const useIsFirstRouteInParent = () => {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState(
    (state) => state.routes[0].key === route.key
  );

  return isFirstRouteInParent;
};

export { useRoot, useIsFirstRouteInParent, useLocation, useUserInfo };
