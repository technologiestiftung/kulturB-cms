import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Logo = styled.div`
  float: left;
  margin-right: 10px;
  color: white;
`;

class HeaderMenu extends PureComponent {
  render() {
    const { pathname } = this.props.location;

    return (
      <Header
        style={{ padding: '0 20px' }}
      >

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          style={{
            lineHeight: '64px',
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          <Logo>TSB Logo</Logo>
          <Menu.Item key="/">
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="/standorte">
            <NavLink to="/standorte">Standorte</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderMenu);
