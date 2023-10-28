import React from 'react';
import { CardProps, Card as RNCard } from 'react-native-paper';

export default function Card(props: CardProps) {
	return (
		//@ts-ignore
		<RNCard
			{...props}
			className="w-full p-4 space-y-7 bg-white dark:bg-card py-8 border-2 border-gray-50 dark:border-outline"
		>
			{props.children}
		</RNCard>
	);
}
