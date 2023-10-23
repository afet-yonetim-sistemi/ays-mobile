import { getDefaultStore } from 'jotai';
import { axiosInstance } from 'src/utils/axiosInstance';

import { assignmentBaseEndpoint, searchAssignmentUrl } from '@/services/endpoints';
import { assignmentTrackingAtom, defaultAssignmentTracking } from '@/stores/assignment';
import { AssignmentSearchRequest, AssignmentSearchResponse } from '@/types/index';

const store = getDefaultStore();
export enum AssignmentProcess {
	Approve = 'approve',
	Reject = 'reject',
	Complete = 'complete',
	Start = 'start',
}

class AssignmentService {
	async searchAssignment(body: AssignmentSearchRequest): Promise<AssignmentSearchResponse> {
		try {
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));
			const response = await axiosInstance.post<AssignmentSearchResponse>(
				searchAssignmentUrl,
				body
			);
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: false }));

			return response.data;
		} catch (error) {
			console.log('error', error);
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: false }));

			return Promise.reject(error);
		}
	}
	async processAssignment(action: AssignmentProcess) {
		try {
			// son konum variş noktasına ne kadar uzak
			// if (action === AssignmentProcess.Complete) {
			// 	const location = store.get(locationAtom);
			// 	const destination = store.get(destinationAtom);
			// 	if (!location || !destination) {
			// 		return Promise.reject('Location not found');
			// 	}
			// 	console.log(
			// 		'getDistanceToLocation',
			// 		locationService.getDistanceToLocation(location, destination)
			// 	);
			// 	return Promise.reject('Location fount');
			// }

			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));
			const response = await axiosInstance.post<AssignmentSearchResponse>(
				assignmentBaseEndpoint + '/' + action
			);
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: false }));

			return response.data;
		} catch (error) {
			console.log('processAssignment errored', error);
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: false }));
			return Promise.reject(error);
		}
	}
	async clearAssignment() {
		store.set(assignmentTrackingAtom, defaultAssignmentTracking);
		console.log('assignment cleared');
	}
}

export const assignmentService = new AssignmentService();
