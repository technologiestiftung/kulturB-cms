import changesApi from '~/services/changesApi';

const type = 'changes';
export const get = params => changesApi.get({ create: true, ...params }, type);
export const create = values => changesApi.create({ create: true, ...values }, type);

export default {
  ...changesApi,
  get,
  create
};
