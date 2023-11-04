import { useAtom } from 'jotai';
import { styled } from 'nativewind';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextProps } from 'react-native';
import { Snackbar as PaperSnackbar, Portal, SnackbarProps } from 'react-native-paper';

import { snackbarAtom } from '@/stores/ui';

export default function Snackbar() {
	const [snackbar, setSnackbar] = useAtom(snackbarAtom);

	const onDismissSnackBar = () => setSnackbar((prev) => ({ ...prev, visible: false }));
	const { t } = useTranslation();
	const snackbarColor: string = useMemo(() => {
		switch (snackbar.severity) {
			case 'error':
				return 'bg-red-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'info':
				return 'bg-blue-500';
			case 'success':
				return 'bg-green-500';
			default:
				return 'bg-red-500';
		}
	}, [snackbar.severity]);

	return (
		<Portal>
			<StyledSnackbar
				visible={snackbar.visible}
				onDismiss={onDismissSnackBar}
				duration={snackbar.duration || 3000}
				action={{
					label: t('buttons.ok'),
					onPress: onDismissSnackBar,
				}}
				labelStyle="text-white"
				rippleColor="red"
				className={snackbarColor}
			>
				{snackbar.message || ''}
			</StyledSnackbar>
		</Portal>
	);
}

type CustomSnackbarProps = SnackbarProps & {
	labelStyle: TextProps['style'];
};

const CustomSnackbar = ({ labelStyle, children, ...props }: CustomSnackbarProps) => {
	return (
		<PaperSnackbar
			{...props}
			action={{
				...props.action,
				label: props.action?.label || 'OK',
				labelStyle,
				onPress: props.action?.onPress || (() => {}),
			}}
		>
			{children}
		</PaperSnackbar>
	);
};

const StyledSnackbar = styled(CustomSnackbar, {
	props: {
		labelStyle: true,
	},
});
