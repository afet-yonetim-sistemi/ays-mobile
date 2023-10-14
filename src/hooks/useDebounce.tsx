import { useEffect, useState } from 'react';

type DebouncedCallback<T> = (arg: T) => void;

function useDebounce<T>(callback: DebouncedCallback<T>, delay: number): DebouncedCallback<T> {
	console.log('type of call', typeof callback);
	const [debouncedCallback, setDebouncedCallback] = useState<DebouncedCallback<T>>(callback);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedCallback(callback);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [callback, delay]);

	return debouncedCallback;
}

export default useDebounce;
