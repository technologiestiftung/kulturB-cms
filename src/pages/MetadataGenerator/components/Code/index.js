import React, { PureComponent, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import {
  Button, Input, notification
} from 'antd';

const { TextArea } = Input;

const MarginedButton = styled(Button)`
  margin: 10px;
`;

const jsonld = (item) => {
  const {
    _id,
    type,
    name,
    description,
    website,
    email,
    telephone
  } = item;

  const res = {
    '@context': 'http://schema.org',
    '@type': type,
    '@id': _id,
    name
  };

  if (description) res.description = description;
  if (website) res.url = res.website = res.sameAs = website;
  if (email) res.email = email;
  if (telephone) res.telephone = telephone;

  return JSON.stringify(res, null, 2);
};

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
