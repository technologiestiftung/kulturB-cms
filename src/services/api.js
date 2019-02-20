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

export async function updateLocation(id, values) {
  const url = `${config.url.base}${config.url.organisation}/${id}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(values)
    }).then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function createLocation(values) {
  const url = `${config.url.base}${config.url.organisation}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(values)
    }).then(r => r.json());

    return res;
  } catch (err) {
    console.log(err);
  }
}

export default {
  login,
  updateLocation,
  createLocation
};