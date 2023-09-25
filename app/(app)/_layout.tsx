import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "src/screens/drawer";

export default function TabLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
        }}
      />
      <Drawer.Screen
        name="modal"
        options={{
          title: "modal",
          // drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
