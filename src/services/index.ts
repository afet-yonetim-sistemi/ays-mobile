import { getDefaultStore } from 'jotai';

import { hudAtom } from '@/stores/ui';

const store = getDefaultStore();

export const setHud = (hud: boolean = true) => {
	store.set(hudAtom, hud);
};
