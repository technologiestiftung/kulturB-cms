import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Table,
  Tag,
  Button
} from 'antd';

import history from '~/history';
import locationApi from '~/services/locationApi';

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

  if (column.key === 'website') {
    column.render = text => <a href={text.startsWith('http') ? text : `https://${text}`}>{text}</a>;
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
    loading: false
  }

  componentDidMount() {
    this.fetch();
  }

  onRowClick(evt, item) {
    history.push(`/${this.props.itemIdentifier}/${item.id}`);
  }

  fetch = async (params = { limit: 10 }) => {
    this.setState({ loading: true });

    const { data, count } = await locationApi.get(params);

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

  handleTableChange = (pagination, filters, sorter) => {
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

  render() {
    return (
      <TableWrapper>
        <Table
          rowKey="id"
          dataSource={this.state.data}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={this.state.loading}
          onRow={item => ({
            onClick: evt => this.onRowClick(evt, item)
          })}
        >
          {this.props.columns.map(item => renderColumn(item))}
          <Column
            title="Action"
            key="action"
            render={() => (
              <Button
                type="primary"
                size="small"
                icon="delete"
                content="Delete"
              />
            )}
          />
        </Table>
      </TableWrapper>
    );
  }
}

export default PaginationTable;
