import React, { PureComponent } from 'react';
import { Upload } from 'antd';
import StyledButton from '~/components/Button';

class Import extends PureComponent {
  render() {
    const {
      type, beforeUpload, onChange, token,
    } = this.props;

    const apiUrl = `${config.url.base}${config.url[type].base}`;

    return (
      <Upload
        name="file"
        action={`${apiUrl}${config.url[type].import}`}
        beforeUpload={beforeUpload}
        onChange={onChange}
        headers={{ authorization: token }}
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
