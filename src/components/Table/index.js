import React, { PureComponent } from 'react';
import { Spin, Table } from 'antd';
import styled from 'styled-components';

const TableWrapper = styled.div`
  position: relative;
`;

const headerData = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { key: 'age', title: 'Alter', dataIndex: 'age', sorter: (a, b) => a.age > b.age },
  { key: 'gender', title: 'Geschlecht', dataIndex: 'gender' }
];

const tableData = [
  { name: 'John', age: 15, gender: 'Male', key: 1 },
  { name: 'Amber', age: 40, gender: 'Female', key: 2 },
  { name: 'Leslie', age: 25, gender: 'Female', key: 3 },
  { name: 'Ben', age: 70, gender: 'Male', key: 4 }
];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class PaginationTable extends PureComponent {
  render() {
    const isLoading = false;

    return (
      <TableWrapper>
        <Spin tip="Lade Daten" spinning={isLoading}>
          <Table dataSource={tableData} columns={headerData} onChange={onChange} />
        </Spin>
      </TableWrapper>
    );
  }
}

export default PaginationTable;
