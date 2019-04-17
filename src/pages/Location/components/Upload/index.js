import React, { PureComponent } from 'react';
import {
  Row, Col, Button, Icon, Upload
} from 'antd';

import { removeImage } from '~/services/locationApi';

class FileUpload extends PureComponent {
  onUploadChange({ file }) {
    if (file.status === 'uploading') {
      this.props.onUploadChange(false);
    }

    if (file.status === 'done') {
      this.props.onUploadChange({ file });
    }
  }

  async onImageRemove() {
    await removeImage(this.props.logo.id);
    this.props.onImageRemove();
  }

  getFilesList() {
    if (!this.props.logo) {
      return [];
    }

    this.props.logo.uid = this.props.logo.id;
    this.props.logo.thumbUrl = this.props.logo.url;

    return [this.props.logo];
  }

  render() {
    if (this.props.isCreateMode) {
      return null;
    }

    const hasImage = this.props.logo && this.props.logo.id;

    return (
      <Row style={{ marginBottom: '15px' }}>
        <Col span={17}>
          {hasImage && <div>Logo:</div>}
          <Upload
            data={{
              relation: 'location',
              relId: this.props.id,
              type: 'logo'
            }}
            name="file"
            action={`${config.url.base}${config.url.upload}`}
            headers={{
              Authorization: this.props.token
            }}
            listType="picture"
            defaultFileList={this.getFilesList()}
            multiple
            onChange={evt => this.onUploadChange(evt)}
            onRemove={evt => this.onImageRemove(evt)}
          >
            {!hasImage && (
              <Button>
                <Icon type="upload" /> Logo hochladen
              </Button>
            )}
          </Upload>
        </Col>
      </Row>
    );
  }
}

export default FileUpload;
