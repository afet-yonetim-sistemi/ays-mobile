import { atom } from 'jotai';

import { AuthUser } from '@/types';

export const isAuthenticatedAtom = atom<boolean | null>(null);
export const loadingAtom = atom<boolean>(true);
export const userAtom = atom<AuthUser>(null);
