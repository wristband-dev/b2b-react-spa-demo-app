'use strict';

/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.

const apiClient = require('../client/api-client');

exports.getPermissionInfo = async function (values, requestConfig) {
  const response = await apiClient.get(`/permission-info?values=${values.join(',')}`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0
    ? items.map((item) => {
        return item.value;
      })
    : [];
};

exports.getTenant = async function (tenantId, requestConfig) {
  const tenantResponse = await apiClient.get(`/tenants/${tenantId}`, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    address: { ...tenant.publicMetadata.address },
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};
