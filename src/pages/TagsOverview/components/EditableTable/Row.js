import React from 'react';
import { Form } from 'antd';
import { Provider } from './Context';

const EditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default EditableFormRow;
