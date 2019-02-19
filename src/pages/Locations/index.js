import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import Table from '~/components/Table';
import Container from '~/components/Container';

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
    return (
      <Container>
        <h1>Standorte Übersicht</h1>
        <Table url="http://localhost:8000/api/v1/organisations" />
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
