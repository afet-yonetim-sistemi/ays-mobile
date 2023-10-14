import { atomWithAsyncStorage } from '@/stores/index';

export type LocationType = {
	latitude: number;
	longitude: number;
	altitude?: number;
};

export type LocationWithDistance = LocationType & {
	distance: number;
};

export const locationAtom = atomWithAsyncStorage<LocationType | null>('location', null);
export const locationCountAtom = atomWithAsyncStorage<number>('location-count', 0);
