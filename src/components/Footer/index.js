import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

const { Footer } = Layout;

const CenteredFooter = styled(Footer)`
  margin: 0 auto;
  padding-top: 0;
`;

const { text, nav } = config.footer;
const renderLink = (label, url) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={url}
    key={label}
  >
    {label}
  </a>
);

class FooterArea extends PureComponent {
  render() {
    return (
      <CenteredFooter>
        <span>{text}</span>
        {
          nav
            .map(({ label, url }) => renderLink(label, url))
            .reduce((prev, curr) => [prev, ' · ', curr])
        }
      </CenteredFooter>
    );
  }
}

export default FooterArea;
