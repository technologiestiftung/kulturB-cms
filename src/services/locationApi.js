import fetch from 'unfetch';
import Store from '~/store';

const parseQuery = (url, params) => {
  const urlObject = new URL(url);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
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

export async function locationSearch(name, params) {
  const url = parseQuery(`${config.url.base}${config.url.locations}/search`, { name, ...params });
  const res = await fetch(url);
  return res.json();
}

export async function getTags() {
  const res = await fetch(`${config.url.base}${config.url.tags}`);
  return res.json();
}

export async function createTag(name) {
  const { AppState } = Store.getState();

  const res = await fetch(`${config.url.base}${config.url.tags}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function updateTag(id, name) {
  const { AppState } = Store.getState();

  const res = await fetch(`${config.url.base}${config.url.tags}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function deleteTag(id) {
  const { AppState } = Store.getState();

  const res = await fetch(`${config.url.base}${config.url.tags}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AppState.token
    }
  });
  return res.json();
}

export default {
  get,
  create,
  update,
  remove,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  removeImage,
  locationSearch
};
