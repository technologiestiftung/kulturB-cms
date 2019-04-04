import React, { PureComponent } from 'react';
import {
  Select
} from 'antd';

const { Option } = Select;

class LocationSelect extends PureComponent {
  render() {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Standort auswählen"
        onChange={this.props.selectLocation}
        notFoundContent=""
      >
        {
          this.props.locations
            .map(location => (
              <Option key={location._id} value={location.name}>
                {location.name}
              </Option>
            ))
        }
      </Select>
    );
  }
}

export default LocationSelect;
