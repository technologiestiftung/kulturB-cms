import store from 'store';

const get = key => store.get(key);
const set = (key, value) => store.set(key, value);

export default { get, set };
