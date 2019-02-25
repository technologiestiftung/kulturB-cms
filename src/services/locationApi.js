import fetch from 'unfetch';
import Store from '~/store';

const parseQuery = (url, params) => {
  const urlObject = new URL(url);
  Object.keys(params).forEach(key => params[key] && urlObject.searchParams.append(key, params[key]));
  return urlObject;
};

export async function get(params) {
  const url = parseQuery(`${config.url.base}${config.url.locations}`, params);
  const res = await fetch(url);
  return res.json();
}

export async function create(values) {
  const url = `${config.url.base}${config.url.locations}`;
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

export async function update(id, values) {
  const url = `${config.url.base}${config.url.locations}/${id}`;
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

export async function remove(id) {
  const url = `${config.url.base}${config.url.locations}/${id}`;
  const { AppState } = Store.getState();

  try {
    const res = await fetch(url, {
      method: 'DELETE',
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

export async function removeImage(id) {
  const url = `${config.url.base}${config.url.upload}/${id}`;
  const { AppState } = Store.getState();

  try {
    const res = await fetch(url, {
      method: 'DELETE',
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

export async function getTags() {
  const res = await fetch(`${config.url.base}${config.url.tags}`);
  return res.json();
}

export default {
  get,
  create,
  update,
  remove,
  getTags,
  removeImage
};
