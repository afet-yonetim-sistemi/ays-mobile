import { components, paths } from './OpenAPITypes';

/**
 * Refresh Token Types
 */
export type RefreshTokenPath = paths['/api/v1/authentication/admin/token/refresh']['post'];
export type RefreshTokenResponse = RefreshTokenPath['responses']['200']['content']['*/*'];

export type LoginPath = paths['/api/v1/authentication/token']['post'];
export type LoginBody = components['schemas']['AysLoginRequest'];
export type LoginResponse = components['schemas']['AysResponseAysTokenResponse'];

export type InvalidatePath = paths['/api/v1/authentication/token/invalidate']['post'];
export type InvalidateBody = components['schemas']['AysTokenInvalidateRequest'];
export type InvalidateResponse = components['schemas']['AysTokenInvalidateRequest'];

export type Assignment = components['schemas']['AssignmentSearchResponse'];
export type AssignmentResponse = components['schemas']['AssignmentResponse'];
export type AssignmentSearchRequest = components['schemas']['AssignmentSearchRequest'];
export type AssignmentSearchResponse = components['schemas']['AysResponseAssignmentSearchResponse'];
export type AssignmentApproveRequest = components['schemas']['AssignmentSearchRequest'];
export type AssignmentApproveResponse =
	components['schemas']['AysResponseAssignmentSearchResponse'];
export type AssignmentSummaryResponse =
	components['schemas']['AysResponseAssignmentSummaryResponse'];
export type AssignmentGetResponse = components['schemas']['AysResponseAssignmentUserResponse'];
export type AssignmentCancelRequest = components['schemas']['AssignmentCancelRequest'];

export type UserLocationRequest = components['schemas']['UserLocationSaveRequest'];
export type UserSelfResponse = components['schemas']['AysResponseUserSelfResponse'];
export type UserSelfSupportStatusRequest = components['schemas']['UserSupportStatusUpdateRequest'];

export type DefaultResponse = components['schemas']['AysResponseVoid'];
export type AuthUser = UserSelfResponse['response'] | null;

export type UserToken = {
	jti: string;
	iss: string;
	iat: number;
	exp: number;
	institutionId: string;
	roles: string[];
	userType: string;
	userId: string;
	username: string;
} | null;
