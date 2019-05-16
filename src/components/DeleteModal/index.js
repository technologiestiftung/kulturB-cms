import React, { PureComponent, Fragment } from 'react';
import { Button, Modal } from 'antd';

const initialState = {
  isDeleteModalVisible: false,
  itemToDelete: {},
};

class DeleteModal extends PureComponent {
  state = initialState;

  onOpenModal(evt, item) {
    evt.preventDefault();
    evt.stopPropagation();

    this.setState({
      isDeleteModalVisible: true,
      itemToDelete: item
    });
  }

  async onOk(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    await this.props.remove(this.state.itemToDelete.id);
    await this.props.fetch();
    this.closeModal();
  }

  onCancel(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false,
      itemToDelete: {}
    });
  }

  render() {
    const { item } = this.props;
    const { isDeleteModalVisible, itemToDelete } = this.state;
    return (
      <Fragment>
        <Button
          type="danger"
          size="small"
          icon="delete"
          content="Delete"
          onClick={evt => this.onOpenModal(evt, item)}
        />
        <Modal
          title="Eintrag löschen"
          visible={isDeleteModalVisible}
          onOk={evt => this.onOk(evt)}
          onCancel={evt => this.onCancel(evt)}
        >
          <p>
            Sind Sie sicher, dass Sie den Eintrag
            <strong> {itemToDelete.name || itemToDelete.email} </strong>
            löschen wollen?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

export default DeleteModal;
