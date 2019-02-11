import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Segment, Button, Container, Header } from 'semantic-ui-react';

import Table from '~/components/Table';

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
        <Segment>
          <Header as="h1">Standorte Übersicht</Header>
          <Table
            handleSort={(a, b) => console.log(a, b)}
          />
          <ButtonWrapper>
            <StyledButton
              primary
              size="small"
              icon="plus"
              labelPosition="left"
              content="Hinzufügen"
            />
          </ButtonWrapper>
        </Segment>
      </Container>
    );
  }
}

export default Organisations;
