import { notification } from 'antd';

export function parseQuery(url, params) {
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
}

export function renderSuccessMessage() {
  return notification.success({
    message: 'Erfolgreich gespeichert.'
  });
}

export function renderErrorMessage(res) {
  let message = 'Ein Fehler ist aufgetreten. Versuchen Sie erneut.';
  if (res.message === 'Already Registered') {
    message = 'Email Addresse bereits vergeben';
  }
  return notification.error({ message });
}

export default {
  parseQuery,
  renderSuccessMessage,
  renderErrorMessage,
};
