import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Table,
  Tag,
  Button,
  Modal
} from 'antd';

import history from '~/history';
import { remove, get } from '~/services/locationApi';

const { Column } = Table;

const TableWrapper = styled.div`
  position: relative;
  background: white;

  .ant-table-wrapper {
    .ant-table-pagination {
      margin: 16px;
    }

    .ant-table-row {
      cursor: pointer;
    }
  }
`;

const renderColumn = (column) => {
  if (column.key === 'tags') {
    column.render = tags => (
      tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)
    );
  }

  if (column.key === 'types') {
    column.render = types => (
      types.map(tag => <Tag key={tag}>{tag}</Tag>)
    );
  }

  if (column.key === 'website') {
    column.render = text => text ? <a href={text.startsWith('http') ? text : `https://${text}`}>{text}</a> : null;
  }

  return (
    <Column
      key={column.key}
      title={column.title}
      dataIndex={column.key}
      filters={column.filters}
      render={column.render}
      sorter={column.sorter}
      filterMultiple={column.filterMultiple}
      width={column.width}
    />
   );
};

class PaginationTable extends PureComponent {
  state = {
    data: [],
    pagination: {},
    loading: false,
    isDeleteModalVisible: false,
    itemToDelete: {}
  }

  componentDidMount() {
    this.fetch();
  }

  onRowClick(evt, item) {
    history.push(`/${this.props.itemIdentifier}/${item.id}`);
  }

  onTableChange = (pagination, filters, sorter) => {
    this.setState((prevState) => {
      const pager = prevState.pagination;
      pager.current = pagination.current;
      return { pagination: pager };
    });

    this.fetch({
      limit: pagination.pageSize,
      skip: (pagination.pageSize * pagination.current) - pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  }

  onOpenModal(evt, item) {
    evt.preventDefault();
    evt.stopPropagation();

    this.setState({
      isDeleteModalVisible: true,
      itemToDelete: item
    });
  }

  async onOk() {
    await remove(this.state.itemToDelete.id);
    await this.fetch(this.lastParams);
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false,
      itemToDelete: {}
    });
  }

  fetch = async (params = { limit: 10 }) => {
    this.setState({ loading: true });
    this.lastParams = params;

    const { data, count } = await get(params);

    this.setState((prevState) => {
      const { pagination } = prevState;
      pagination.total = count;

      return {
        loading: false,
        data,
        pagination
      };
    });
  }

  render() {
    return (
      <TableWrapper>
        <Table
          rowKey="id"
          dataSource={this.state.data}
          pagination={this.state.pagination}
          onChange={this.onTableChange}
          loading={this.state.loading}
          onRow={item => ({
            onClick: evt => this.onRowClick(evt, item)
          })}
        >
          {this.props.columns.map(item => renderColumn(item))}
          <Column
            key="action"
            render={item => (
              <Button
                type="primary"
                size="small"
                icon="delete"
                content="Delete"
                onClick={evt => this.onOpenModal(evt, item)}
              />
            )}
          />
        </Table>
        <Modal
          title="Eintrag löschen"
          visible={this.state.isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag <strong>{this.state.itemToDelete.name}</strong> löschen wollen
          </p>
        </Modal>
      </TableWrapper>
    );
  }
}

export default PaginationTable;
