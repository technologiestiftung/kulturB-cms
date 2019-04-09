import React, { PureComponent, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { Button, Input, notification } from 'antd';
import jsonld from './jsonld';

const { TextArea } = Input;

const MarginedButton = styled(Button)`
  margin: 10px;
`;
class MetadataCode extends PureComponent {
  render() {
    return (
      <Fragment>
        <TextArea value={jsonld(this.props.location)} rows={20} readOnly />
        <CopyToClipboard
          text={jsonld(this.props.location)}
          onCopy={() => notification.success({ message: 'In der Zwischenablage Kopiert.' })}
        >
          <MarginedButton type="primary" icon="copy">
            Kopieren
          </MarginedButton>
        </CopyToClipboard>
      </Fragment>
    );
  }
}

export default MetadataCode;
