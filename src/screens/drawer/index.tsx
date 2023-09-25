// CustomDrawer.tsx
import { useHeights } from "@/hooks/useHeights";
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import ProfileArea from "./ProfileArea";
import Footer from "./Footer";
type Props = DrawerContentComponentProps & {};

const CustomDrawer: React.FC<Props> = (props) => {
  const { statusBarHeight, bottomTabBarHeight } = useHeights();

  return (
    <View
      className={`flex-1`}
      style={{
        marginBottom: bottomTabBarHeight,
        marginTop: statusBarHeight,
      }}
    >
      <ProfileArea />
      <Divider />
      <View className="flex-1 my-2">
        <DrawerItemList {...props} />
      </View>
      <Divider />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  items: {
    flex: 1,
  },
  footer: {
    marginBottom: 20,
  },
});

export default CustomDrawer;
