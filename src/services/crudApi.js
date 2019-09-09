import fetch from 'unfetch';
import Store from '~/store';
import { parseQuery } from './utils';

export async function get(params = {}, type) {
  const url = parseQuery(`${config.url.base}${config.url[type].base}`, params);
  const res = await fetch(url);
  return res.json();
}

export async function getById(id, type) {
  const url = `${config.url.base}${config.url[type].base}/${id}`;
  const res = await fetch(url);
  return res.json();
}

export async function create(values, type) {
  const url = `${config.url.base}${config.url[type].base}`;
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

export async function update(id, values, type) {
  const url = `${config.url.base}${config.url[type].base}/${id}`;
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

export async function remove(id, type) {
  const url = `${config.url.base}${config.url[type].base}/${id}`;
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

export async function upload(file, data, type = 'upload') {
  const url = `${config.url.base}${config.url[type].base}`;
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


export async function search(name, params, type) {
  const url = parseQuery(`${config.url.base}${config.url[type].base}/search`, { name, ...params });
  const res = await fetch(url);
  return res.json();
}

export default {
  get,
  getById,
  create,
  update,
  remove,
  upload,
  search
};
