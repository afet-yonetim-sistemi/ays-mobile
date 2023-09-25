import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function ModalScreen() {
  return (
    <View className="flex items-center justify-center h-full">
      <Text variant="titleLarge" className="text-primary-500">
        Afet Yönetim Sistemi
      </Text>
    </View>
  );
}
