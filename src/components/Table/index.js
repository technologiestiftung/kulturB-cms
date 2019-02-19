import React, { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import fetch from 'unfetch';
import styled from 'styled-components';

const TableWrapper = styled.div`
  position: relative;
`;

const headerData = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: true },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}
      </span>
    )
  },
  { key: 'address', title: 'Adresse', dataIndex: 'address', sorter: true },
  { key: 'city', title: 'Stadt', dataIndex: 'city', sorter: true },
  { key: 'zipcode', title: 'PLZ', dataIndex: 'zipcode', sorter: true },
  { key: 'website', title: 'Website', dataIndex: 'website', sorter: true, render: text => <a href={text.startsWith('http') ? text : `https://${text}`}>{text}</a> },
  { key: 'type', title: 'Typ', dataIndex: 'type', sorter: true, filters: [{ text: 'Organisation', value: 'organisation' }, { text: 'Venue', value: 'venue' }, { text: 'Organisation and venue', value: 'organisation and venue' }], filterMultiple: false }
];

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

    const url = new URL(this.props.url);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const res = await fetch(url);
    const { data, count } = await res.json();

    const pagination = { ...this.state.pagination };

    pagination.total = count;

    this.setState({
      loading: false,
      data,
      pagination
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(filters);
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
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
        <Table dataSource={this.state.data} columns={headerData} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} />
      </TableWrapper>
    );
  }
}

export default PaginationTable;
