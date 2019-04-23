import fetch from 'unfetch';
import Store from '~/store';

const parseQuery = (url, params) => {
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

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export async function addImage(file, data) {
  const url = `${config.url.base}${config.url.upload}`;
  const { AppState } = Store.getState();

  try {
    const formData = new FormData();
    const blob = dataURItoBlob(file);
    formData.append('file', blob, 'test.jpg');
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
  removeImage,
  locationSearch
};
