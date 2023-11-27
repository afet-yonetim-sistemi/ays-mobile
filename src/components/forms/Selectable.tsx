import React, { useState } from 'react';
import { Menu } from 'react-native-paper';

import Button from '@/components/Button';

export interface SelectOption {
	value: string;
	label: string;
	onPress?: () => void;
}

interface SelectComponentProps {
	defaultValue: string;
	options: SelectOption[];
	onPress?: (selectedOption: SelectOption) => void;
}

const Selectable: React.FC<SelectComponentProps> = ({ defaultValue, options, onPress }) => {
	const [visible, setVisible] = useState(false);

	const showMenu = () => setVisible(true);
	const hideMenu = () => setVisible(false);

	const handleOptionSelect = (option: SelectOption) => {
		if (option.onPress) {
			option.onPress();
		} else if (onPress) {
			onPress(option);
		}
		hideMenu();
	};

	const defaultOption = options.find((option) => option.value === defaultValue);

	return (
		<Menu
			visible={visible}
			onDismiss={hideMenu}
			anchor={<Button onPress={showMenu}>{defaultOption ? defaultOption.label : 'Select'}</Button>}
			theme={{ colors: { primary: 'red' } }}
		>
			{options.map((option) => (
				<Menu.Item
					key={option.value}
					onPress={() => handleOptionSelect(option)}
					title={option.label}
				/>
			))}
		</Menu>
	);
};

export default Selectable;
