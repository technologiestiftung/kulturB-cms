import React, { PureComponent } from 'react';
import Select from 'react-select';

class LocationSelect extends PureComponent {
  render() {
    const options = this.props.locations
      .map(location => ({ label: location.name, value: location._id }));

    return (
      <Select
        isSearchable
        noOptionsMessage={() => 'Keinen Standort gefunden'}
        placeholder="Standort auswählen"
        onChange={this.props.selectLocation}
        options={options}
      />
    );
  }
}

export default LocationSelect;
