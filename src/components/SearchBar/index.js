import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const { Search } = Input;

const SearchInput = styled(Search)`
  max-width: 400px;
  margin-bottom: 10px;
`;

class SearchBar extends PureComponent {
  render() {
    return (
      <SearchInput
        placeholder="Suche..."
        onSearch={value => this.props.onSearch(value)}
        enterButton
      />
    );
  }
}

export default SearchBar;
