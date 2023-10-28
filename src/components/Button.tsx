import React from 'react';
import { ButtonProps, Button as RNButton } from 'react-native-paper';

type Props = ButtonProps;

export default function Button(props: Props) {
	return (
		<RNButton {...props} className="rounded-md">
			{props.children}
		</RNButton>
	);
}
