import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;

class SelectInput extends PureComponent {
  render() {
    const { options, mode = 'default' } = this.props;

    return (
      <Select
        mode={mode}
        notFoundContent=""
        optionFilterProp="title"
        style={{ width: '100%' }}
        placeholder="Wert auswählen"
        {...this.props}
      >
        {options.map(option => (
          <Option
            title={option.label}
            key={option.value}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectInput;
