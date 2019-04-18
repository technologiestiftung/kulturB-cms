import React, { PureComponent } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class ImageCropper extends PureComponent {
  constructor(props) {
    super(props);
    this.cropper = React.createRef();
  }

  _crop() {
    // image in dataUrl
    this.props.cropped(this.cropper.current.getCroppedCanvas().toDataURL());
  }

  render() {
    return (
      <Cropper
        ref={this.cropper}
        src={this.props.image}
        style={{ height: 400, width: '100%' }}
        aspectRatio={16 / 9}
        guides={false}
        crop={() => this._crop()}
      />
    );
  }
}

export default ImageCropper;
