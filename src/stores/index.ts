import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, createStore } from 'jotai';

const store = createStore();

export default store;

export const atomWithAsyncStorage = <T>(key: string, initialValue: T) => {
	const baseAtom = atom(initialValue);
	baseAtom.onMount = (setValue) => {
		(async () => {
			const item = (await AsyncStorage.getItem(key)) as any;
			if (item === null) {
				setValue(initialValue);
			} else {
				setValue(JSON.parse(item));
			}
		})();
	};
	const derivedAtom = atom(
		(get) => get(baseAtom),
		async (get, set, update) => {
			const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update;
			set(baseAtom, nextValue);
			await AsyncStorage.setItem(key, JSON.stringify(nextValue));
		}
	);
	return derivedAtom;
};
