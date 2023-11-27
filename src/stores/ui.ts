import { atom } from 'jotai';

import { InputProps } from '@/components/forms/Input';

// this is the atom that will hold the state of the UI such as snackbar, modal, etc

export type SnackbarAtomType = {
	visible: boolean;
	message?: string;
	severity?: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
};
export const snackbarAtom = atom<SnackbarAtomType>({
	visible: false,
	message: '',
	severity: 'success',
	duration: 3000,
});

export type ModalAtomType = {
	visible: boolean;
	title: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: (confirmInput?: string) => void;
	confirmInputText?: string;
	confirmInputProps?: Partial<InputProps<any>>;
	onCancel?: () => void;
	type: 'confirm' | 'alert' | 'prompt';
	inputValue?: string;
};
export const modalAtom = atom<ModalAtomType>({
	visible: false,
	title: '',
	message: '',
	confirmText: '',
	cancelText: '',
	onConfirm: () => {},
	onCancel: () => {},
	type: 'confirm',
	inputValue: '',
});

export const hudAtom = atom<boolean>(false);

export const languageAtom = atom<string>('tr');
