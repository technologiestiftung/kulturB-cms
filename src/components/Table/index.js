import React, { PureComponent } from 'react';
import fetch from 'unfetch';
import styled from 'styled-components';
import {
  Table,
  Tag,
  Divider,
  Button
} from 'antd';

const { Column } = Table;

const TableWrapper = styled.div`
  position: relative;
`;

const parseQuery = (url, params) => {
  const urlObject = new URL(url);
  Object.keys(params).forEach(key => urlObject.searchParams.append(key, params[key]));
  return urlObject;
};

const renderColumns = columns => columns.map((column) => {
  if (column.key === 'tags') {
    column.render = tags => (
      <span>
        {tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}
      </span>
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
    />
   );
});

class PaginationTable extends PureComponent {
  state = {
    data: [],
    pagination: {},
    loading: false
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = async (params = { limit: 10 }) => {
    this.setState({ loading: true });

    const url = parseQuery(this.props.url, params);
    const res = await fetch(url);
    const { data, count } = await res.json();

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
        <Table rowKey="uid" dataSource={this.state.data} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading}>
          {renderColumns(this.props.columns)}
          <Column
            title="Action"
            key="action"
            render={() => (
              <span>
                <Button
                  type="primary"
                  size="small"
                  icon="edit"
                  content="Edit"
                />
                <Divider type="vertical" />
                <Button
                  type="primary"
                  size="small"
                  icon="delete"
                  content="Delete"
                />
              </span>
            )}
          />
        </Table>
      </TableWrapper>
    );
  }
}

export default PaginationTable;
