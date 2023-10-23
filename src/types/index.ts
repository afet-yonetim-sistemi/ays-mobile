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

export type UserLocationRequest = components['schemas']['UserLocationSaveRequest'];

export type AuthUser = {
	jti: string;
	iss: string;
	iat: number;
	exp: number;
	institutionId: string;
	userLastName: string;
	roles: string[];
	userType: string;
	userFirstName: string;
	userId: string;
	username: string;
} | null;
