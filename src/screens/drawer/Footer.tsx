import { View, Text } from "react-native";
import React, { useCallback, useMemo } from "react";
import { Button } from "react-native-paper";
import { useAuth } from "@/hooks/useAuth";

type Props = {};

const Footer = (props: Props) => {
  const { logout } = useAuth();
  return (
    <View className="mt-2">
      <Button textColor="red" onPress={logout}>
        Logout
      </Button>
    </View>
  );
};

export default Footer;
