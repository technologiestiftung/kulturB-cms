import fetch from 'unfetch';

export async function login(values) {
  const url = `${config.url.base}${config.url.user.base}${config.url.user.login}`;
  try {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(values)
      })
      .then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

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

export default { login };
