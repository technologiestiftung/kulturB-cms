import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import Table from '~/components/Table';
import Container from '~/components/Container';

import tableConfig from './config';

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  &&& {
    margin-left: auto;
  }
`;

class Organisations extends PureComponent {
  render() {
    const { url } = config;
    const apiUrl = `${url.base}${url.organisation}`;
    const { columns } = tableConfig.table;
    return (
      <Container>
        <h1>Standorte Übersicht</h1>
        <Table url={apiUrl} columns={columns} itemIdentifier="standorte" />
        <ButtonWrapper>
          <StyledButton
            type="primary"
            size="small"
            icon="plus"
            content="Hinzufügen"
          />
        </ButtonWrapper>
      </Container>
    );
  }
}

export default Organisations;
