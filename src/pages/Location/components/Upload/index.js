import React, { PureComponent } from 'react';
import {
  Row, Col, Button, Icon, Upload, Modal
} from 'antd';

import Cropper from '../Cropper';
import { addImage, removeImage } from '~/services/locationApi';

class FileUpload extends PureComponent {
  state = {
    image: {},
    showCropper: false,
    cropped: null
  }

  onUploadChange({ file }) {
    if (file.status === 'uploading') {
      this.props.onUploadChange(false);
    }

    if (file.status === 'done') {
      this.props.onUploadChange({ file, type: this.props.type });
    }
  }

  async onImageRemove() {
    await removeImage(this.props.image.id);
    this.props.onImageRemove();
  }

  getFilesList() {
    if (!this.props.image) {
      return [];
    }

    this.props.image.uid = this.props.image.id || (this.state.image && this.state.image.id);
    this.props.image.thumbUrl = this.props.image.url || (this.state.image && this.state.image.url);

    return [this.props.image];
  }

  beforeUpload(file, fileList) {
    return new Promise((resolve, reject) => {
      if (this.props.type === 'teaser' && !this.state.cropped) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const image = reader.result;
          this.setState({
            showCropper: true,
            image,
          });
        });
        reader.readAsDataURL(file);
        reject();
      }
    });
  }

  cropped(cropped) {
    this.setState({ cropped });
  }

  onCancel() {
    this.setState({ image: '', showCropper: false });
  }

  async onOk() {
    // this.state.resolve();
    // this.beforeUpload(this.state.cropped, [this.state.cropped]);
    const res = await addImage(this.state.cropped, {
      relation: 'location',
      relId: this.props.id,
      type: this.props.type
     });

     this.setState({
       image: res,
       showCropper: false
     });
    // this.props.onUploadChange({ file: this.state.cropped, type: this.props.type });
  }

  render() {
    if (this.props.isCreateMode) {
      return null;
    }

    const hasImage = (this.props.image && this.props.image.id) || (this.state.image && this.state.image.id);
    const label = this.props.type === 'logo' ? 'Logo' : 'Teaserbild';

    return (
      <Row style={{ marginBottom: '15px' }}>
        <Col span={17}>
          {hasImage && <div>{label}:</div>}
          <Upload
            data={{
              relation: 'location',
              relId: this.props.id,
              type: this.props.type
            }}
            name="file"
            action={`${config.url.base}${config.url.upload}`}
            headers={{
              Authorization: this.props.token
            }}
            listType="picture"
            defaultFileList={this.getFilesList()}
            onChange={evt => this.onUploadChange(evt)}
            onRemove={evt => this.onImageRemove(evt)}
            beforeUpload={(file, fileList) => this.beforeUpload(file, fileList)}
            openFileDialogOnClick={!this.state.showCropper}
          >
            {this.state.showCropper && (
              <Modal
                visible
                title="Bild ausschneiden"
                onCancel={() => this.onCancel()}
                onOk={() => this.onOk()}
              >
                <Cropper
                  image={this.state.image}
                  cropped={image => this.cropped(image)}
                />
              </Modal>
            )}
            {!hasImage && (
              <Button>
                <Icon type="upload" />
                <span>
                  {label} hochladen
                </span>
              </Button>
            )}
          </Upload>
        </Col>
      </Row>
    );
  }
}

export default FileUpload;
