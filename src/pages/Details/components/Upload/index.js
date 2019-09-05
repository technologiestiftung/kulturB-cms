import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import {
  Row, Col, Button, Icon, Upload, Modal
} from 'antd';

import Cropper from '../Cropper';
import { addImage, removeImage } from '~/services/locationApi';
import formItemLayout from '~/pages/Details/form-layout-config';

const Wrapper = styled(Row)`
  .ant-upload.ant-upload-select {
    display: ${props => (props.showUpload ? 'inline-block' : 'none')};
  }
`;

const StyledUpload = styled(Upload)`
  .ant-upload-list-picture .ant-upload-list-item-thumbnail img {
    height: 100%;
    width: auto;
  }
`;

const InfoText = styled.div`
  font-size: 12px;
  color: #888;
`;

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
      this.setState({
        image: file.response,
        fileList: [{ ...file.response, uid: file.response.id }]
      });
      this.props.onUploadChange({ file, type: this.props.type });
    }
  }

  async onImageRemove() {
    await removeImage(this.state.image.id);
    this.props.onImageRemove();
    this.setState({
      image: {},
      fileList: [],
      cropped: null
    });
  }

  getFilesList() {
    if (!this.props.image) {
      return [];
    }

    this.props.image.uid = this.props.image.id;
    this.props.image.thumbUrl = this.props.image.url;

    return [this.props.image];
  }

  beforeUpload(file) {
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
    this.setState({
      cropped: null,
      image: {},
      showCropper: false,
      fileList: []
    });
  }

  async onOk() {
    const { cropped } = this.state;
    const res = await addImage(cropped, {
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

    const hasImage = this.state.image && this.state.image.id;
    const label = this.props.type === 'logo' ? 'Logo' : 'Teaserbild';

    const uploadProps = {
      name: 'file',
      data: {
        relation: 'location',
        relId: this.props.id,
        type: this.props.type
      },
      action: `${config.url.base}${config.url.upload}`,
      headers: {
        Authorization: this.props.token
      },
      listType: 'picture',
      onChange: evt => this.onUploadChange(evt),
      onRemove: evt => this.onImageRemove(evt),
      beforeUpload: (file, fileList) => this.beforeUpload(file, fileList),
      openFileDialogOnClick: !this.state.showCropper
    };

    if (this.props.type === 'teaser') {
      uploadProps.fileList = this.state.fileList;
    } else {
      uploadProps.defaultFileList = this.getFilesList();
    }

    return (
      <Wrapper style={{ marginBottom: '15px' }} showUpload={!hasImage}>
        <Col {...formItemLayout.colLayout}>
          {hasImage && <div>{label}:</div>}
          <StyledUpload {...uploadProps}>
            {this.state.showCropper && (
              <Modal
                visible
                title="Bild ausschneiden"
                onCancel={() => this.onCancel()}
                onOk={() => this.onOk()}
                width={600}
              >
                <Cropper
                  image={this.state.image}
                  cropped={image => this.cropped(image)}
                />
              </Modal>
            )}
            {!hasImage && (
              <Fragment>
                <Button>
                  <Icon type="upload" />
                  <span>
                    {label} hochladen
                  </span>
                </Button>
                <InfoText>Bitte nur Bilder bis max. 2 MB hochladen</InfoText>
              </Fragment>
            )}
          </StyledUpload>
        </Col>
      </Wrapper>
    );
  }
}

export default FileUpload;
