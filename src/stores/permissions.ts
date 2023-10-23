import { atomWithReset } from 'jotai/utils';

// this is the atom that will hold the state of the Permissions such as location

export type PermissionsAtomType = {
	location: boolean;
	backgroundLocation: boolean;
	loaded: boolean;
};

export const permissionsAtom = atomWithReset<PermissionsAtomType>({
	location: false,
	backgroundLocation: false,
	loaded: false,
});

export type UserAgreementAtomType = {
	accepted: boolean;
	version: string;
	loaded: boolean;
};

export const userAgreementAtom = atomWithReset<UserAgreementAtomType>({
	accepted: false,
	version: '1.0',
	loaded: false,
});
