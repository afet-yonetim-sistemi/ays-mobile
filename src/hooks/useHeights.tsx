// this is a hook to get the status bar height
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useStatusBarHeight = () => {
  const insets = useSafeAreaInsets();
  return insets.top;
};

const useBottomTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  return insets.bottom;
};

const useHeights = () => {
  return {
    statusBarHeight: useStatusBarHeight(),
    bottomTabBarHeight: useBottomTabBarHeight(),
  };
};

export { useStatusBarHeight, useBottomTabBarHeight, useHeights };
