import fetch from 'unfetch';

const parseQuery = (url, params) => {
  const urlObject = new URL(url);
  Object.keys(params).forEach(key => urlObject.searchParams.append(key, params[key]));
  return urlObject;
};

export async function get(params) {
  const url = parseQuery(`${config.url.base}${config.url.organisation}`, params);
  const res = await fetch(url);
  return res.json();
}

export default { get };
