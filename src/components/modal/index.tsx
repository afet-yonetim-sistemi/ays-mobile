import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { Input } from '@/components/forms/Input';
import { modalAtom } from '@/stores/ui';

export const Modal = () => {
	const { t } = useTranslation();
	const [modal, setModal] = useAtom(modalAtom);
	const {
		control,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<{
		confirmInput: string;
	}>({});

	const hideDialog = () => {
		setModal((prev) => ({ ...prev, visible: false }));
	};

	const onSubmit = () => {
		console.log('onSubmit');
		if (modal.onConfirm) {
			if (modal.type === 'prompt') {
				const { confirmInput } = getValues();
				modal.onConfirm(confirmInput);
				setModal((prev) => ({ ...prev, visible: false }));
			} else {
				modal.onConfirm();
				setModal((prev) => ({ ...prev, visible: false }));
			}
		}
	};

	const isPrompt = modal.type === 'prompt';

	return (
		<Portal>
			<Dialog visible={modal.visible} onDismiss={() => {}}>
				<Dialog.Icon icon="alert" />
				<Dialog.Title>{modal.title}</Dialog.Title>
				<Dialog.Content>
					{modal.message && <Text variant="bodyMedium">{modal.message}</Text>}
					{isPrompt && (
						<Input
							name="confirmInput"
							label={t('screens.home.fields.confirmText')}
							control={control}
							mode="outlined"
							error={!!errors.confirmInput}
							errorText={errors.confirmInput?.message}
							{...modal.confirmInputProps}
						/>
					)}
				</Dialog.Content>
				<Dialog.Actions>
					<Button textColor="red" onPress={hideDialog}>
						Cancel
					</Button>
					<Button textColor="green" onPress={handleSubmit(onSubmit)}>
						Ok
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
