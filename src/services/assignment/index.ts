import { getDefaultStore } from 'jotai';
import axiosInstance from 'src/utils/axiosInstance';

import {
	assignmentBaseEndpoint,
	assignmentCancelEndpoint,
	assignmentGetUrl,
	assignmentSummaryUrl,
	searchAssignmentUrl,
} from '@/services/endpoints';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentTrackingAtom,
	defaultAssignmentTracking,
} from '@/stores/assignment';
import { locationAtom } from '@/stores/location';
import {
	AssignmentCancelRequest,
	AssignmentGetResponse,
	AssignmentSearchRequest,
	AssignmentSearchResponse,
	AssignmentSummaryResponse,
} from '@/types/index';

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
	async cancelAssignment({ reason }: AssignmentCancelRequest) {
		try {
			console.log('cancelAssignment', reason);
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));
			await axiosInstance.post(assignmentCancelEndpoint, {
				reason,
			});
			await store.set(assignmentTrackingAtom, defaultAssignmentTracking);
		} catch (error) {
			console.log('cancelAssignment errored', JSON.stringify(error));
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: false }));
			return Promise.reject(error);
		}
	}
	async clearAssignment() {
		store.set(assignmentTrackingAtom, defaultAssignmentTracking);
		console.log('assignment cleared');
	}
	async getAssignmentSummary() {
		try {
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));
			const location = store.get(locationAtom);

			const response = await axiosInstance.get(assignmentSummaryUrl);
			const data = response.data as AssignmentSummaryResponse;
			const assignment = data.response as AssignmentTracking['assignment'];
			let assignmentDetail: AssignmentTracking['assignmentDetail'] = null;
			if (
				assignment?.status &&
				[AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS].includes(assignment?.status)
			) {
				assignmentDetail = await this.getAssignment();
			}

			await store.set(assignmentTrackingAtom, (prev: AssignmentTracking) => ({
				...prev,
				origin: location,
				assignment,
				isWaitingForConfirmation: true,
				assignmentDetail,
			}));

			await store.set(assignmentTrackingAtom, (pre: AssignmentTracking) => ({
				...pre,
				isLoading: false,
				isDetailOpen: false,
			}));
		} catch (error: any) {
			console.log('getAssignmentSummary errored status', error.response.status);
			const status = error.response.status;
			if (status === 404) {
				await store.set(assignmentTrackingAtom, defaultAssignmentTracking);
			} else {
				return Promise.reject(error);
			}
		}
	}

	async setAssignment() {
		try {
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));
			const location = store.get(locationAtom);

			const response = await axiosInstance.get(assignmentGetUrl);
			const data = response.data as AssignmentGetResponse;
			const assignmentDetail = data.response as AssignmentTracking['assignmentDetail'];
			await store.set(assignmentTrackingAtom, (prev: AssignmentTracking) => ({
				...prev,
				origin: location,
				assignmentDetail,
			}));
			console.log('getAssignment full info');
			await store.set(assignmentTrackingAtom, (pre: AssignmentTracking) => ({
				...pre,
				isLoading: false,
			}));
		} catch (error: any) {
			console.log('getAssignment errored status', error.response.status);
			const status = error.response.status;
			if (status === 404) {
				await store.set(assignmentTrackingAtom, defaultAssignmentTracking);
			} else {
				return Promise.reject(error);
			}
		}
	}
	async getAssignment(): Promise<AssignmentTracking['assignmentDetail']> {
		try {
			await store.set(assignmentTrackingAtom, (pre: any) => ({ ...pre, isLoading: true }));

			const response = await axiosInstance.get(assignmentGetUrl);
			const data = response.data as AssignmentGetResponse;
			const assignmentDetail = data.response as AssignmentTracking['assignmentDetail'];
			return assignmentDetail;
		} catch (error: any) {
			console.log('getAssignment errored status', error.response.status);
			const status = error.response.status;
			if (status === 404) {
				await store.set(assignmentTrackingAtom, defaultAssignmentTracking);
			} else {
				return Promise.reject(error);
			}
		}
	}
}

export const assignmentService = new AssignmentService();
