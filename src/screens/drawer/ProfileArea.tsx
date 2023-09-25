import React, { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";
import { Text } from "react-native-paper";

const ProfileArea = () => {
  const { user } = useAuth();

  const fullName = useMemo(() => {
    if (user) {
      return `${user.userFirstName} ${user.userLastName}`;
    }
    return "";
  }, [user]);

  return (
    <View className={`items-center justify-center flex-row mb-4 px-2`}>
      <View className="w-14 h-14 rounded-full bg-primary-500" />
      <View className="ml-2 flex-1">
        <Text
          className="text-primary-500 dark:text-primary-100"
          variant="titleMedium"
        >
          {fullName}
        </Text>
        {/* <Text
          className="text-primary-500 dark:text-primary-200"
          variant="bodySmall"
        >
          {user?.institutionId}
        </Text> */}
      </View>
    </View>
  );
};

export default ProfileArea;
