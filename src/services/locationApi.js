import fetch from 'unfetch';
import Store from '~/store';

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

export async function createLocation(values) {
  const url = `${config.url.base}${config.url.organisation}`;
  const { AppState } = Store.getState();

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        Authorization: AppState.token
      }
    }).then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function updateLocation(id, values) {
  const url = `${config.url.base}${config.url.organisation}/${id}`;
  const { AppState } = Store.getState();

  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        Authorization: AppState.token
      }
    }).then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

export default {
  get,
  createLocation,
  updateLocation
};
