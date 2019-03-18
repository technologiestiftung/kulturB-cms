import React, { PureComponent } from 'react';
import history from '~/history';
import { message } from 'antd';
import Table from '~/components/Table';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';
import ImportExport from '~/components/ImportExport';

import tableConfig from './config';

class Organisations extends PureComponent {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
  }

  state = {
    loading: false
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} erfolgreich hochgeladen.`);
      this.setState({ loading: false });
      this.tableRef.current.fetch();
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload fehlgeschlagen.`);
      this.setState({ loading: false });
    }
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
        <ImportExport
          token={this.props.token}
          onChange={info => this.onChange(info)}
        />
      </Container>
    );
  }
}

export default Organisations;
