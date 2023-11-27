import React from 'react';
import { View } from 'react-native';

type Props = {
	children: React.ReactNode;
};

export default function Container({ children }: Props) {
	return (
		<View className="flex flex-1 justify-center items-center w-full px-8 bg-[#f5f5f5] dark:bg-secondary-500">
			{children}
		</View>
	);
}
