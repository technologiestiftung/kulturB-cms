import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
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
  state = {
    isDeleteModalVisible: false,
    locationToDelete: null
  }

  onOpenModal(evt, item) {
    this.setState({
      isDeleteModalVisible: true,
      locationToDelete: item.name
    });
  }

  onOk() {
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false,
      locationToDelete: null
    });
  }

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
          onDelete={(evt, item) => this.onOpenModal(evt, item)}
        />
        <Modal
          title="Standort löschen"
          visible={this.state.isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Standort <strong>{this.state.locationToDelete}</strong> löschen wollen
          </p>
        </Modal>
      </Container>
    );
  }
}

export default Organisations;
