import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';

import tableConfig from './config';

const StyledButton = styled(Button)`
  &&& {
    margin-left: auto;
  }
`;

const HeaderArea = styled.div`
  display: flex;
  align-items: center;

  h1 {
    line-height: 1;
  }
`;

class Organisations extends PureComponent {
  render() {
    const { url } = config;
    const apiUrl = `${url.base}${url.organisation}`;
    const { columns } = tableConfig.table;
    return (
      <Container>
        <HeaderArea>
          <h1>Standorte Übersicht</h1>
          <StyledButton
            type="primary"
            icon="plus"
            onClick={() => history.push('/standort-anlegen')}
          >
            Neuen Standort anlegen
          </StyledButton>
        </HeaderArea>
        <Table url={apiUrl} columns={columns} itemIdentifier="standorte" />
      </Container>
    );
  }
}

export default Organisations;
