export const authBaseEndpoint = '/authentication';
export const loginUrl = `${authBaseEndpoint}/token`;
export const invalidateUrl = `${authBaseEndpoint}/token/invalidate`;
export const refreshTokenUrl = `${authBaseEndpoint}/token/refresh`;

// assignment urls
export const assignmentBaseEndpoint = '/assignment';
export const assignmentCancelEndpoint = '/assignment/cancel';
export const searchAssignmentUrl = `${assignmentBaseEndpoint}/search`;
export const assignmentSummaryUrl = `${assignmentBaseEndpoint}/summary`;
export const assignmentGetUrl = `${assignmentBaseEndpoint}`;

// user urls
export const userBaseEndpoint = '/user';
export const userLocationUrl = `${userBaseEndpoint}/location`;
export const userSelfUrl = `/user-self`;
export const userSelfUpdateUrl = `/user-self/status/support`;
