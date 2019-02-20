import fetch from 'unfetch';

async function login(values) {
  console.log(values);
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

export default { login };
