import React, { PureComponent } from 'react';
import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';

import tableConfig from './config';

class Organisations extends PureComponent {
  render() {
    const apiUrl = `${config.url.base}${config.url.locations.base}`;
    const { columns } = tableConfig.table;

    return (
      <Container>
        <HeaderArea>
          <h1>Kulturorte Übersicht</h1>
          {this.props.token && (
            <StyledButton
              type="primary"
              icon="plus"
              style={{ marginLeft: 'auto' }}
              onClick={() => history.push('/neu')}
            >
              Neuen Kulturort anlegen
            </StyledButton>
          )}
        </HeaderArea>
        <Table
          url={apiUrl}
          columns={columns}
          itemIdentifier="kulturorte"
          token={this.props.token}
        />
      </Container>
    );
  }
}

export default Organisations;
