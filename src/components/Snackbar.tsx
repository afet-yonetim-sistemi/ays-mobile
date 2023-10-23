import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar as PaperSnackbar, Portal } from 'react-native-paper';

import { snackbarAtom } from '@/stores/ui';

export default function Snackbar() {
	const [snackbar, setSnackbar] = useAtom(snackbarAtom);

	const onDismissSnackBar = () => setSnackbar({ visible: false });
	const { t } = useTranslation();
	return (
		<Portal>
			<PaperSnackbar
				visible={snackbar.visible}
				onDismiss={onDismissSnackBar}
				duration={snackbar.duration || 3000}
				action={{
					label: t('buttons.ok'),
					onPress: onDismissSnackBar,
				}}
			>
				{snackbar.message}
			</PaperSnackbar>
		</Portal>
	);
}
