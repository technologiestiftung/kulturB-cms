import fetch from 'unfetch';
import Store from '~/store';
import { parseQuery } from './utils';

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

export async function refreshToken({ token }) {
  const url = `${config.url.base}${config.url.user.base}${config.url.user.refreshToken}?token=${token}`;
  try {
    const res = await fetch(url)
      .then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function search(name, params) {
  const url = parseQuery(`${config.url.base}${config.url.user.base}/search`, { role: 'USER', name, ...params });
  const res = await fetch(url);
  return res.json();
}

export async function find(params = {}) {
  const url = parseQuery(`${config.url.base}${config.url.user.base}`, { role: 'USER', ...params });
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });
  return res.json();
}

export async function findById(id) {
  const url = `${config.url.base}${config.url.user.base}/${id}`;
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });
  return res.json();
}

export async function create(values) {
  const url = `${config.url.base}${config.url.user.base}`;
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });
  return res.json();
}

export async function update(id, values) {
  const url = `${config.url.base}${config.url.user.base}/${id}`;
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });

  return res.json();
}

export async function remove(id) {
  const url = `${config.url.base}${config.url.user.base}/${id}`;
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });

  return res.json();
}

export async function exportUsers() {
  const url = `${config.url.base}${config.url.user.base}${config.url.user.export}`;
  const { AppState } = Store.getState();

  const res = await fetch(url, {
    headers: {
      Authorization: AppState.token
    }
  });

  const blob = await res.blob();
  const uri = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'nutzer.csv';
  link.href = uri;
  // we need to append the element to the dom -> otherwise it will not work in firefox
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default {
  login,
  refreshToken,
  find,
  findById,
  create,
  update,
  remove,
  exportUsers,
};
