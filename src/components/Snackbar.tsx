import { useAtom } from 'jotai';
import React from 'react';
import { Snackbar as PaperSnackbar, Portal } from 'react-native-paper';

import { snackbarAtom } from '@/stores/ui';

export default function Snackbar() {
	const [snackbar, setSnackbar] = useAtom(snackbarAtom);

	const onDismissSnackBar = () => setSnackbar({ visible: false });

	return (
		<Portal>
			<PaperSnackbar
				visible={snackbar.visible}
				onDismiss={onDismissSnackBar}
				duration={snackbar.duration || 3000}
				action={{
					label: 'Tamam',
					onPress: onDismissSnackBar,
				}}
			>
				{snackbar.message}
			</PaperSnackbar>
		</Portal>
	);
}
