import crudApi from '~/services/crudApi';

const type = 'locations';
export const get = (params = {}) => crudApi.get(params, type);
export const getById = id => crudApi.getById(id, type);
export const create = values => crudApi.create(values, type);
export const update = (id, values) => crudApi.update(id, values, type);
export const remove = id => crudApi.remove(id, type);
export const search = (name, params) => crudApi.search(name, params, type);
export const addImage = (file, data) => crudApi.upload(file, data);
export const removeImage = id => crudApi.remove(id, 'upload');

export default {
  get,
  getById,
  create,
  update,
  remove,
  addImage,
  removeImage,
  search
};
