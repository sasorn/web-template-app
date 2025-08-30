export const useUrlParam = key => {
  if (!key) return null;

  // 1. Check query params first
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has(key)) {
    return queryParams.get(key);
  }

  // 2. Check path segments like /foo=value/bar=value
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  for (const part of pathParts) {
    const [param, value] = part.split("=");
    if (param === key) return value || null;
  }

  return null;
};

// Example: http://domain.com/foo=value1/bar=value2/lot=value3/shed=value4/more=value5/redirect=/user/profile
// i should be able to call:
// useUrlParam("foo") that returns value1
// useUrlParam("bar") that returns value2
// useUrlParam("lot") that returns value3
// useUrlParam("shed") that returns value4
// useUrlParam("more") that returns value5
// useUrlParam("redirect") that returns /user/profile
