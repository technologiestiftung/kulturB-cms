export function parseQuery(url, params) {
  const urlObject = new URL(url);
  Object.keys(params).forEach((key) => {
    if (typeof params[key] !== 'undefined') {
      const value = params[key];
      if (Array.isArray(value)) {
        if (value.length) {
          return urlObject.searchParams.append(key, JSON.stringify(value));
        }
        return;
      }
      return urlObject.searchParams.append(key, value);
    }
  });
  return urlObject;
};

export default {
  parseQuery
};
