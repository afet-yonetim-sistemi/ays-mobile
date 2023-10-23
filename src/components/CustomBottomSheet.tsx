import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import React, { forwardRef } from 'react';
import { ViewProps } from 'react-native';

type Props = BottomSheetProps & {
	children: React.ReactNode;
	handleStyle?: ViewProps['style'];
	handleIndicatorStyle?: ViewProps['style'];
	backgroundStyle?: ViewProps['style'];
	containerStyle?: ViewProps['style'];
	style?: ViewProps['style'];
};

const CustomBottomSheet = forwardRef((props: Props, ref: any) => {
	return (
		<BottomSheet ref={ref} {...props}>
			{props.children}
		</BottomSheet>
	);
});

const StyledBottomSheet = styled(CustomBottomSheet, {
	props: {
		handleStyle: true,
		handleIndicatorStyle: true,
		style: true,
		backgroundStyle: true,
		containerStyle: true,
	},
});

export default StyledBottomSheet;
