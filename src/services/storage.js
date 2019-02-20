import store from 'store';

const { localStoragePrefix } = config;

const prefixKey = key => `${localStoragePrefix}:${key}`;

const get = key => store.get(prefixKey(key));
const set = (key, value) => store.set(prefixKey(key), value);
const remove = key => store.remove(prefixKey(key));

export default { get, set, remove };
