import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Table from '~/components/Table';
import { Layout, Button } from 'antd';

const { Content } = Layout;


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
      <Content>
        <h1>Standorte Übersicht</h1>
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
      </Content>
    );
  }
}

export default Organisations;
