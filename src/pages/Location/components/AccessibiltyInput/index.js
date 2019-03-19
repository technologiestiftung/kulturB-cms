import React from 'react';
import { Select } from 'antd';

export default function getAccessibilityInput(accessibilty) {
  const options = accessibilty.map(option => (
    <Select.Option key={option.value}>
      {option.label}
    </Select.Option>
  ));

  return (
    <Select
      style={{ width: '100%' }}
    >
      {options}
    </Select>
  );
}
