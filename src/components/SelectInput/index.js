import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default function getSelectInput(entries) {
  const options = entries.map(option => (
    <Option
      title={option.name || option}
      key={option._id || option}
    >
      {option.name || option}
    </Option>
  ));

  return (
    <Select
      mode="multiple"
      notFoundContent=""
      optionFilterProp="title"
      style={{ width: '100%' }}
      placeholder="Wert auswählen"
    >
      {options}
    </Select>
  );
}
