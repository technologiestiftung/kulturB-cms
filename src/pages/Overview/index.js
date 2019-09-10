import React from 'react';
import { connect } from 'react-redux';
import history from '~/history';

import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import Button from '~/components/Button';

const Overview = ({
  actions, user, config: { name, table, labels: [labelSing, labelPl] }
}) => (
  <Container>
    <HeaderArea>
      <h1>{labelPl} Übersicht</h1>
      <Button
        type="primary"
        icon="plus"
        style={{ marginLeft: 'auto' }}
        onClick={() => history.push(`/${name}/neu`)}
      >
        <span>Neuen {labelSing} anlegen</span>
      </Button>
    </HeaderArea>
    <Table
      get={actions.get}
      remove={actions.remove}
      search={actions.search}
      columns={table.columns}
      itemIdentifier={name}
      user={user}
    />
  </Container>
);

export default connect(({ role, organisation, token }) => ({
  user: { role, organisation, token }
}))(Overview);
