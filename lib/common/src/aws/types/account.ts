

export interface CreateAccountInput {
  accountId?: string;
  accountName: string;
  emailAddress: string;
  organizationalUnit: string;
  accountKey: string;
}

export type CreateAccountOutputStatus =
  | 'SUCCESS'
  | 'FAILURE'
  | 'ALREADY_EXISTS'
  | 'NOT_RELEVANT'
  | 'NON_MANDATORY_ACCOUNT_FAILURE';

export type OrganizationAccountOutputStatus = 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | string;

export interface CreateAccountOutput {
  status?: CreateAccountOutputStatus | OrganizationAccountOutputStatus;
  statusReason?: string;
  provisionedProductStatus?: string;
  provisionToken?: string;
}

export type AccountAvailableStatus =
  | 'SUCCESS'
  | 'FAILURE'
  | 'IN_PROGRESS'
  | 'NON_MANDATORY_ACCOUNT_FAILURE'
  | 'NOT_EXISTS';

export interface AccountAvailableOutput {
  status?: AccountAvailableStatus | OrganizationAccountOutputStatus;
  statusReason?: string;
  provisionedProductStatus?: string;
  provisionToken?: string;
}
