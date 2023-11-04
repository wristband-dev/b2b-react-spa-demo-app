export const INVOICE_TERMS = [
  { value: 'DUE_ON_RECEIPT', label: 'Due on Receipt' },
  { value: 'NET_7', label: 'Net 7 (7 Days)' },
  { value: 'NET_15', label: 'Net 15 (15 Days)' },
  { value: 'NET_30', label: 'Net 30 (30 Days)' },
];

const env = import.meta.env;
export const APPLICATION_DOMAIN = `${env.VITE_APPLICATION_DOMAIN}`;
export const CLIENT_ID =  `${env.VITE_CLIENT_ID}`;
export const DOMAIN_FORMAT = `${env.VITE_DOMAIN_FORMAT}`;
export const IS_LOCALHOST = DOMAIN_FORMAT === 'LOCALHOST';
export const INVOTASTIC_HOST = DOMAIN_FORMAT === 'LOCALHOST' ? 'localhost:6001' : 'business.invotastic.com:6001';
const authCallbackTenantDomain = DOMAIN_FORMAT === 'LOCALHOST' ? '' : '{tenant_domain}.';
export const APPLICATION_LOGIN_URL = `http://${APPLICATION_DOMAIN}/login`;
export const AUTH_CALLBACK_URL = `http://${authCallbackTenantDomain}${INVOTASTIC_HOST}/callback`;
export const BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
};

export const LS_KEY_ACCESS_TOKEN="accessToken";
export const LS_KEY_EXPIRES_AT="expiresAt";
export const LS_KEY_REFRESH_TOKEN="refreshToken";
export const LS_KEY_USER_ID="userId";
export const LS_KEY_TENANT_ID="tenantId";
export const LS_KEY_IDENTITY_PROVIDER_NAME="identityProviderName";
export const LS_KEY_TENANT_DOMAIN_NAME="tenantDomainName";
export const LS_KEY_LOGIN_STATE_DATA="loginStateData";



export const STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CZ', label: 'Canal Zone' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'GU', label: 'Guam' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VI', label: 'Virgin Islands' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const OWNER_ROLE = 'app:invotasticb2b:owner';
