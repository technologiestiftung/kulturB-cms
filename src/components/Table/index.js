import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import {
  Table,
  Tag,
  Button,
  Modal,
  Input
} from 'antd';

import history from '~/history';
import { remove, get, locationSearch } from '~/services/locationApi';

const { Column } = Table;
const { Search } = Input;

const TableWrapper = styled.div`
  position: relative;
  background: white;

  .ant-table-wrapper {
    .ant-table-pagination {
      margin: 16px;
    }

    .ant-table-row {
      cursor: ${props => (props.token ? 'pointer' : 'auto') };
      height: 80px;

      &:hover {
        td {
          background: ${props => (props.token ? '#e6f7ff' : 'none') };
        }
      }
    }
  }
`;

const SearchBar = styled(Search)`
  max-width: 400px;
  margin-bottom: 10px;
`;

const renderColumn = (col) => {
  const column = col;
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
    column.render = (text) => {
      if (typeof text === 'undefined') {
        return null;
      }

      return <a target="_blank" rel="noopener noreferrer" href={text.startsWith('http') ? text : `https://${text}`}>{text}</a>;
    };
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
    itemToDelete: {},
    searchTerm: ''
  }

  componentDidMount() {
    this.fetch();
  }

  onRowClick(evt, item) {
    if (this.props.token) {
      history.push(`/${item.id}`);
    }
  }

  onTableChange = (pagination, filters, sorter) => {
    this.setState((prevState) => {
      const pager = prevState.pagination;
      pager.current = pagination.current;
      return { pagination: pager };
    });

    const params = {
      limit: pagination.pageSize,
      skip: (pagination.pageSize * pagination.current) - pagination.pageSize,
      sort: sorter.field,
      order: sorter.order,
      ...filters
    };

    const { searchTerm } = this.state;
    if (searchTerm) {
      return this.search(searchTerm, params);
    }
    return this.fetch(params);
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

  fetch = async (params = {}) => {
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

  async search(value, params) {
    this.setState({ loading: true });
    if (value === '') {
      this.setState({
        searchTerm: '',
        pagination: {
          current: 0
        }
      });
      return this.fetch();
    }

    const { data, count } = await locationSearch(value, params);
    this.setState({
      loading: false,
      searchTerm: value,
      data,
      pagination: {
        current: 0,
        total: count
      }
    });
  }

  render() {
    return (
      <Fragment>
        <SearchBar
          placeholder="Suche..."
          onSearch={value => this.search(value)}
          enterButton
        />
        <TableWrapper token={this.props.token}>
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
            {this.props.token && (
              <Column
                key="action"
                render={item => (
                  <Button
                    type="danger"
                    size="small"
                    icon="delete"
                    content="Delete"
                    onClick={evt => this.onOpenModal(evt, item)}
                  />
                  )}
              />
            )}
          </Table>
          <Modal
            title="Eintrag löschen"
            visible={this.state.isDeleteModalVisible}
            onOk={() => this.onOk()}
            onCancel={() => this.onCancel()}
          >
            <p>
              Sind Sie sicher, dass sie den Eintrag
              <strong> {this.state.itemToDelete.name} </strong>
              löschen wollen?
            </p>
          </Modal>
        </TableWrapper>
      </Fragment>
    );
  }
}

export default PaginationTable;
