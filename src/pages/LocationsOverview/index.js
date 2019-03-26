import React, { PureComponent } from 'react';
import history from '~/history';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';

import tableConfig from './config';

class Organisations extends PureComponent {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
  }

  state = {
    loading: false
  }

  render() {
    const apiUrl = `${config.url.base}${config.url.locations.base}`;
    const { columns } = tableConfig.table;

    return (
      <Container>
        <HeaderArea>
          <h1>Standorte Übersicht</h1>
          <StyledButton
            type="primary"
            icon="plus"
            onClick={() => history.push('/standorte/neu')}
          >
            Neuen Standort anlegen
          </StyledButton>
        </HeaderArea>
        <Table
          url={apiUrl}
          columns={columns}
          itemIdentifier="standorte"
          loading={this.state.loading}
          ref={this.tableRef}
        />
      </Container>
    );
  }
}

export default Organisations;
