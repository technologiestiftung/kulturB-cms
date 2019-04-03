import React, { PureComponent } from 'react';
import { Upload } from 'antd';
import StyledButton from '~/components/Button';

class Import extends PureComponent {
  render() {
    const apiUrl = `${config.url.base}${config.url.locations.base}`;

    return (
      <Upload
        name="file"
        action={`${apiUrl}${config.url.locations.import}`}
        beforeUpload={this.props.beforeUpload}
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
    );
  }
}

export default Import;
