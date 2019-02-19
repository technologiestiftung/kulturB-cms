import React, { PureComponent } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

class Home extends PureComponent {
  render() {
    return (
      <Content style={{ padding: '0 24px' }}>
        <h1>TSB Admin</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Content>
    );
  }
}

export default Home;
