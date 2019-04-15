import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { Layout } from 'antd';

const { Footer } = Layout;

const CenteredFooter = styled(Footer)`
  margin: 0 auto;
  padding-top: 0;
`;

class FooterArea extends PureComponent {
  render() {
    return (
      <CenteredFooter>
        © 2019 Technologiestiftung Berlin
        <span> · </span>
        <a target="_blank" rel="noopener noreferrer" href="https://kultur-b-digital.de/impressum">Impressum</a>
        <span> · </span>
        <a target="_blank" rel="noopener noreferrer" href="https://kultur-b-digital.de/datenschutz">Datenschutz</a>
      </CenteredFooter>
    );
  }
}

export default withRouter(FooterArea);
