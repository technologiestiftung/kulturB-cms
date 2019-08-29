import crudApi from '~/services/crudApi';

const type = 'changes';
export const get = params => crudApi.get({ create: true, ...params }, type);
export const getById = id => crudApi.getById(id, type);
export const create = values => crudApi.create(values, type);
export const update = (id, values) => crudApi.update(id, values, type);
export const remove = id => crudApi.remove(id, type);
export const search = (name, params) => crudApi.search(name, params, type);

export default {
  get,
  getById,
  create,
  update,
  remove,
  search
};
