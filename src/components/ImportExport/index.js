import React, { PureComponent, Fragment } from 'react';
import { Upload } from 'antd';
import StyledButton from '~/components/Button';

class ImportExport extends PureComponent {
  render() {
    const apiUrl = `${config.url.base}${config.url.locations.base}`;

    return (
      <Fragment>
        <StyledButton
          icon="export"
          href={`${apiUrl}${config.url.locations.export}`}
        >
          Exportieren
        </StyledButton>
        <Upload
          name="file"
          action={`${apiUrl}${config.url.locations.import}`}
          onChange={this.props.onChange}
          headers={{ authorization: this.props.token }}
          accept=".csv"
          showUploadList={false}
        >
          <StyledButton
            icon="import"
          >
            Importieren
          </StyledButton>
        </Upload>
      </Fragment>
    );
  }
}

export default ImportExport;
