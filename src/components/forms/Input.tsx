import React, { useMemo } from "react";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import {
  Controller,
  FieldValues,
  UseControllerProps,
  Path,
} from "react-hook-form";
import customColors from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface InputProps<T extends FieldValues> extends TextInputProps {
  name: keyof T;
  control: UseControllerProps<T>["control"];
  rules?: Partial<UseControllerProps<T>["rules"]>;
  errorText?: string;
}
export function Input<T extends FieldValues>({
  name,
  control,
  rules = {},
  errorText,
  ...rest
}: InputProps<T>) {
  const { colorScheme, setColorScheme } = useColorScheme();

  const textColor = useMemo(() => {
    if (colorScheme === "dark") {
      return customColors.primary[200];
    } else {
      return customColors.primary[500];
    }
  }, [colorScheme]);

  return (
    <Controller
      name={name as Path<T>}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextInput
            className="bg-white dark:bg-secondary-500"
            {...rest}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            textColor={textColor}
          />
          {rest.error && (
            <HelperText type="error" visible={rest.error}>
              {errorText}
            </HelperText>
          )}
        </>
      )}
    />
  );
}
