import React from 'react';
import { Select } from 'antd';

export default function getSelectInput(entries) {
  const options = entries.map(option => (
    <Select.Option
      title={option.name ? option.name : option}
      key={option._id ? option._id : option}
    >
      {option.name ? option.name : option}
    </Select.Option>
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
