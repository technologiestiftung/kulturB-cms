import React, { PureComponent } from 'react';
import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';
import { remove, find, search } from '~/services/userApi';

import tableConfig from './config';

class Users extends PureComponent {
  render() {
    const { columns } = tableConfig.table;

    return (
      <Container>
        <HeaderArea>
          <h1>Nutzer Übersicht</h1>
          {this.props.token && (
            <StyledButton
              type="primary"
              icon="plus"
              style={{ marginLeft: 'auto' }}
              onClick={() => history.push('/nutzer/neu')}
            >
              Neuen Nutzer anlegen
            </StyledButton>
          )}
        </HeaderArea>
        <Table
          get={find}
          remove={remove}
          search={search}
          columns={columns}
          itemIdentifier="nutzer"
          token={this.props.token}
          role={this.props.role}
        />
      </Container>
    );
  }
}

export default Users;
