import React, { PureComponent } from 'react';
import {
  Row, Col, Button, Icon, Upload, Modal
} from 'antd';

import Cropper from '../Cropper';
import { addImage, removeImage } from '~/services/locationApi';

class FileUpload extends PureComponent {
  state = {
    image: {},
    fileList: [],
    showCropper: false,
    cropped: null
  }

  componentDidMount() {
    if (this.props.image) {
      this.setState({
        image: this.props.image,
        fileList: [{ ...this.props.image, uid: this.props.image.id }]
      });
    }
  }

  onUploadChange({ file }) {
    if (file.status === 'uploading') {
      this.props.onUploadChange(false);
    }

    if (file.status === 'done') {
      this.props.onUploadChange({ file, type: this.props.type });
      this.setState({
        image: file,
        fileList: [{ ...file, uid: file.uid }]
      });
    }
  }

  async onImageRemove() {
    await removeImage(this.props.image.id);
    this.props.onImageRemove();
    this.setState({
      fileList: []
    });
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
    this.setState({
      fileList: []
    });

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
      return false;
    }
    return true;
  }

  cropped(cropped) {
    this.setState({ cropped });
  }

  onCancel() {
    this.setState({ image: {}, showCropper: false, fileList: [] });
  }

  async onOk() {
    const res = await addImage(this.state.cropped, {
      relation: 'location',
      relId: this.props.id,
      type: this.props.type
     });

    this.setState({
      image: res,
      showCropper: false,
      fileList: [{ ...res, uid: res.id }]
    });
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
            fileList={this.state.fileList}
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
