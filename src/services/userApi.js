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

export default {
  login,
  refreshToken
};
