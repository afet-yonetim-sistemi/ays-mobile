import * as SecureStore from 'expo-secure-store';
import { atom, createStore } from 'jotai';

const store = createStore();

export default store;

export const atomWithAsyncStorage = <T>(key: string, initialValue: T) => {
	const baseAtom = atom(initialValue);
	baseAtom.onMount = (setValue) => {
		(async () => {
			const item = (await SecureStore.getItemAsync(key)) as any;
			setValue(JSON.parse(item));
		})();
	};
	const derivedAtom = atom(
		(get) => get(baseAtom),
		async (get, set, update) => {
			const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update;
			set(baseAtom, nextValue);
			await SecureStore.setItemAsync(key, JSON.stringify(nextValue));
		}
	);
	return derivedAtom;
};
