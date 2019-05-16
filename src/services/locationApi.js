import fetch from 'unfetch';
import Store from '~/store';
import { parseQuery } from './utils';

export async function get(params = {}) {
  const url = parseQuery(`${config.url.base}${config.url.locations.base}`, params);
  const res = await fetch(url);
  return res.json();
}

export async function getById(id) {
  const url = `${config.url.base}${config.url.locations.base}/${id}`;
  const res = await fetch(url);
  return res.json();
}

export async function create(values) {
  const url = `${config.url.base}${config.url.locations.base}`;
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
  const url = `${config.url.base}${config.url.locations.base}/${id}`;
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
  const url = `${config.url.base}${config.url.locations.base}/${id}`;
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

export async function addImage(file, data) {
  const url = `${config.url.base}${config.url.upload}`;
  const { AppState } = Store.getState();

  try {
    const formData = new FormData();
    formData.append('file', file, 'teaser.jpg');
    Object.keys(data)
      .map(key => formData.append(key, data[key]));
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: AppState.token,
      },
      body: formData
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

export async function locationSearch(name, params) {
  const url = parseQuery(`${config.url.base}${config.url.locations.base}/search`, { name, ...params });
  const res = await fetch(url);
  return res.json();
}

export default {
  get,
  create,
  update,
  remove,
  addImage,
  removeImage,
  locationSearch
};
