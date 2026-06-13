const AUTHENTICATION_FAILURE_CODES = new Set([400, 401, 403, 404]);

export const normalizeApiError = (error, fallbackMessage = "Something went wrong. Please try again.") => {
  const response = error?.response;
  const data = response?.data;
  const status = response?.status || null;

  const paramsMessage = data?.params
    ? Object.values(data.params).find((value) => Array.isArray(value) && value.length)?.[0]
    : null;

  const validationMessage =
    data?.errors?.[0]?.message ||
    data?.errors?.[0]?.msg ||
    paramsMessage;

  const message =
    validationMessage ||
    data?.message ||
    data?.msg ||
    error?.message ||
    fallbackMessage;

  return {
    message,
    status,
    code: data?.code || error?.code || null,
    details: data || null,
    isNetworkError: !response,
    isAuthFailure: AUTHENTICATION_FAILURE_CODES.has(status),
  };
};
