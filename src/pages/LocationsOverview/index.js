import React, { PureComponent } from 'react';
import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';
import { remove, get, locationSearch } from '~/services/locationApi';

import tableConfig from './config';


class Organisations extends PureComponent {
  render() {
    const { role, organisation, token } = this.props;
    const { columns } = tableConfig.table;
    const isAdmin = role === 'ADMIN';

    return (
      <Container>
        <HeaderArea>
          <h1>Kulturorte Übersicht</h1>
          {isAdmin && (
            <StyledButton
              type="primary"
              icon="plus"
              style={{ marginLeft: 'auto' }}
              onClick={() => history.push('/kulturorte/neu')}
            >
              Neuen Kulturort anlegen
            </StyledButton>
          )}
        </HeaderArea>
        <Table
          get={get}
          remove={remove}
          search={locationSearch}
          columns={columns}
          itemIdentifier="kulturorte"
          role={role}
          organisation={organisation}
          token={token}
        />
      </Container>
    );
  }
}

export default Organisations;
