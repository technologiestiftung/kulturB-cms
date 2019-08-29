import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { Table, Tag } from 'antd';

import history from '~/history';
import DeleteModal from '~/components/DeleteModal';
import SearchBar from '~/components/SearchBar';

const { Column } = Table;

const TableWrapper = styled.div`
  position: relative;
  background: white;

  .ant-table-wrapper {
    .ant-table-pagination {
      margin: 16px;
    }
  }
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
    searchTerm: ''
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

  fetch = async (params = {}) => {
    this.setState({ loading: true });
    this.lastParams = params;

    const { data, count } = await this.props.get(params);

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

    const { data, count } = await this.props.search(value, params);
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
    const { columns, user } = this.props;
    const isAdmin = user && user.role === 'ADMIN';

    return (
      <Fragment>
        <SearchBar onSearch={value => this.search(value)} />
        <TableWrapper role={user.role}>
          <Table
            rowKey="id"
            dataSource={this.state.data}
            pagination={this.state.pagination}
            onChange={this.onTableChange}
            loading={this.state.loading}
            onRow={item => ({
              onClick: evt => this.onRowClick(evt, item),
            })}
            locale={{
              sortTitle: 'Sortieren',
              filterTitle: 'Filter',
              filterConfirm: 'Ok',
              filterReset: 'Zurücksetzen',
              emptyText: 'Keine Einträge vorhanden'
            }}
          >
            {columns.map(item => renderColumn(item))}
            {isAdmin && (
              <Column
                key="action"
                render={item => (
                  <DeleteModal
                    item={item}
                    remove={this.props.remove}
                    fetch={this.fetch}
                  />
                )}
              />
            )}
          </Table>
        </TableWrapper>
      </Fragment>
    );
  }
}

export default PaginationTable;
