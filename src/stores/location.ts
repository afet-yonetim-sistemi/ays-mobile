import { atomWithAsyncStorage } from '@/stores/index';

export type LocationType = {
	latitude: number;
	longitude: number;
};

export type LocationWithDistance = LocationType & {
	distance: number;
};

export const locationAtom = atomWithAsyncStorage<LocationType | null>('location', null);
