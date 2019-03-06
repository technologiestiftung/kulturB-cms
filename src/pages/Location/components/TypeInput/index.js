import React from 'react';
import { Select } from 'antd';

export default function getTypeInput(types) {
  const options = types.map(type => (
    <Select.Option key={type}>
      {type}
    </Select.Option>
  ));

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Typen festlegen"
    >
      {options}
    </Select>
  );
}
