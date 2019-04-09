import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const StyledSelect = styled(Select)`
  width: 75%;
`;

class LocationSelect extends PureComponent {
  render() {
    const options = this.props.locations
      .map(location => ({ label: location.name, value: location._id }));

    const { name, _id } = this.props.location;
    return (
      <StyledSelect
        value={{ label: name, value: _id }}
        noOptionsMessage={() => 'Keinen Standort gefunden'}
        placeholder="Standort auswählen"
        onChange={this.props.selectLocation}
        options={options}
        isSearchable
      />
    );
  }
}

export default LocationSelect;
