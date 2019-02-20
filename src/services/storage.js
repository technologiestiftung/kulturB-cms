import store from 'store';

const { localStoragePrefix } = config;

const prefixKey = key => `${localStoragePrefix}:${key}`;

export const get = key => store.get(prefixKey(key));
export const set = (key, value) => store.set(prefixKey(key), value);
export const remove = key => store.remove(prefixKey(key));

export default { get, set, remove };
