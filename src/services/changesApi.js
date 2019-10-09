import crudApi from '~/services/crudApi';

const type = 'changes';
export const get = params => crudApi.get({ create: false, ...params }, type);
export const getById = id => crudApi.getById(id, type);
export const create = values => crudApi.create({ create: false, ...values }, type);
export const update = (id, values) => crudApi.update(id, values, type);
export const remove = id => crudApi.remove(id, type);
export const search = (name, params) => crudApi.search(name, params, type);

export async function diff(id) {
  const url = `${config.url.base}${config.url[type].base}/${id}${config.url[type].diff}`;
  const res = await fetch(url);
  return res.json();
}

export default {
  get,
  getById,
  create,
  update,
  remove,
  search,
  diff
};
