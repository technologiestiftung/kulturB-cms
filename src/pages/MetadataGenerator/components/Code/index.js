import React, { PureComponent, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { Button, Input, notification } from 'antd';
import jsonld from './jsonld';

const { TextArea } = Input;

const MarginedButton = styled(Button)`
  margin: 10px;
`;

const InstructionsBox = styled.p`
  padding-bottom: 15px;
  margin-bottom: 0;
  background-color: white;
`;

const Instructions = () => (
  <InstructionsBox>
    Um die Metadaten nutzen zu können,
    müssen Sie diese in den Head-Bereich
    Ihrer Webseite kopieren.
  </InstructionsBox>
);

class MetadataCode extends PureComponent {
  render() {
    return (
      <Fragment>
        <Instructions />
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
