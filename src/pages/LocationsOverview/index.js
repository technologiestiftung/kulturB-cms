import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';

import tableConfig from './config';

class Organisations extends PureComponent {
  render() {
    const apiUrl = `${config.url.base}${config.url.locations}`;
    const { columns } = tableConfig.table;

    return (
      <Container>
        <HeaderArea>
          <h1>Standorte Übersicht</h1>
          <StyledButton
            type="primary"
            icon="plus"
            onClick={() => history.push('/standorte/neu')}
          >
            Neuen Standort anlegen
          </StyledButton>
        </HeaderArea>
        <Table
          url={apiUrl}
          columns={columns}
          itemIdentifier="standorte"
        />
      </Container>
    );
  }
}

export default Organisations;
