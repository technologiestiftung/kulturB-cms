import fetch from 'unfetch';
import Store from '~/store';

export async function getTags(sort = 'name', order = 'ascend') {
  const res = await fetch(`${config.url.base}${config.url.tags}?sort=${sort}&order=${order}`);
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
  getTags,
  createTag,
  updateTag,
  deleteTag
};
