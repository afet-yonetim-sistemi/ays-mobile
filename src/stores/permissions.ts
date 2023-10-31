import { PermissionStatus } from 'expo-location';
import { atomWithReset } from 'jotai/utils';

import { atomWithAsyncStorage } from '.';

// this is the atom that will hold the state of the Permissions such as location

export type PermissionsAtomType = {
	location: PermissionStatus;
	backgroundLocation: PermissionStatus;
	loaded: boolean;
};

export const initialPermissions: PermissionsAtomType = {
	location: PermissionStatus.UNDETERMINED,
	backgroundLocation: PermissionStatus.UNDETERMINED,
	loaded: false,
};

export const permissionsAtom = atomWithAsyncStorage<PermissionsAtomType>(
	'permissions',
	initialPermissions
);

export type UserAgreementAtomType = {
	accepted: boolean;
	version: string;
	loaded: boolean;
};

export const initialUserAgreement: UserAgreementAtomType = {
	accepted: false,
	version: '1.0',
	loaded: true,
};

export const userAgreementAtom = atomWithAsyncStorage<UserAgreementAtomType>(
	'user-agreement',
	initialUserAgreement
);

export const userAgreementSheetAtom = atomWithReset({
	isOpen: false,
	isApproved: false,
});
