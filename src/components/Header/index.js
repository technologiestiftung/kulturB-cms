import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

class HeaderMenu extends PureComponent {
  render() {
    const { pathname } = this.props.location;
    console.log(pathname);
    return (
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/"><NavLink to="/">Home</NavLink></Menu.Item>
          <Menu.Item key="/standorte"><NavLink to="/standorte">Standorte</NavLink></Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderMenu);
