import { styled } from 'nativewind';
import React from 'react';
import { TextProps, ViewProps } from 'react-native';
import { List, ListAccordionProps } from 'react-native-paper';

type Props = ListAccordionProps & {
	children: React.ReactNode;
	titleStyle?: TextProps['style'];
	style?: ViewProps['style'];
};

const CustomListAccordion = (props: Props) => {
	return <List.Accordion {...props}>{props.children}</List.Accordion>;
};

const StyledListAccordion = styled(CustomListAccordion, {
	props: {
		style: true,
		titleStyle: true,
	},
});

export default StyledListAccordion;
