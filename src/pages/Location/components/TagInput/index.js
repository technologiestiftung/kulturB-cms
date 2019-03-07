import React from 'react';
import { Select } from 'antd';

export default function getTagInput(tags) {
  const options = tags.map(tag => (
    <Select.Option key={tag._id}>
      {tag.name}
    </Select.Option>
  ));

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Kategorien angeben"
    >
      {options}
    </Select>
  );
}
