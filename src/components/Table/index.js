import React, { PureComponent } from 'react';
import { Dimmer, Loader, Table, Pagination } from 'semantic-ui-react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  position: relative;
`;

const headerData = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Alter' },
  { key: 'gender', label: 'Geschlecht' }
];

const tableData = [
  { name: 'John', age: 15, gender: 'Male', id: 1 },
  { name: 'Amber', age: 40, gender: 'Female', id: 2 },
  { name: 'Leslie', age: 25, gender: 'Female', id: 3 },
  { name: 'Ben', age: 70, gender: 'Male', id: 4 }
];

class PaginationTable extends PureComponent {
  render() {
    const isLoading = false;
    const activeColumn = false;
    const sortDirection = 'ascending';

    return (
      <TableWrapper>
        <Dimmer active={isLoading}>
          <Loader>Lade Daten</Loader>
        </Dimmer>
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              {headerData.map(header => (
                <Table.HeaderCell
                  key={header.key}
                  sorted={null}
                  onClick={this.props.handleSort(header.key)}
                >
                  {header.label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map(d => (
              <Table.Row key={d.id}>
                {
                  Object.keys(d)
                    .filter(cellKey => headerData.find(header => header.key === cellKey))
                    .map((cellKey, index) => <Table.Cell key={`${d.id}-${index}`}>{d[cellKey]}</Table.Cell>)
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Pagination
          defaultActivePage={1}
          totalPages={10}
          firstItem={null}
          lastItem={null}
        />
      </TableWrapper>
    );
  }
}

export default PaginationTable;
