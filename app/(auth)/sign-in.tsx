import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "src/hooks/useAuth";
import { LoginBody } from "@/types/index";
import { Button, Card, Surface, Text, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/forms/Input";

type Props = {};

const SignIn = (props: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBody>();
  const { login } = useAuth();
  return (
    <View className="flex flex-1 justify-center items-center w-full p-4 dark:bg-secondary-900">
      <Card
        elevation={4}
        className="w-full p-4 space-y-3 bg-white dark:bg-secondary-500 py-8"
      >
        <Text
          variant="titleLarge"
          className="text-primary-500 dark:text-white text-center pb-2"
        >
          Giriş Yap
        </Text>
        <Input
          name="username"
          label="Username"
          control={control}
          mode="outlined"
          rules={{
            required: "Username is required",
          }}
          error={!!errors.username}
          errorText={errors.username?.message}
        />
        <Input
          name="password"
          label="Password"
          control={control}
          mode="outlined"
          rules={{
            required: "Password is required",
          }}
          error={!!errors.password}
          errorText={errors.password?.message}
          secureTextEntry
        />
        <Button onPress={handleSubmit(login)} mode="contained">
          Login
        </Button>
      </Card>
    </View>
  );
};

export default SignIn;
