import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Layout, Menu } from 'antd';

import { logout } from '~/AppState';
import logoSrc from '../../../public/images/tsb-logo.svg';

const { Header } = Layout;

const Logo = styled.img`
  color: white;
  width: 50px;
`;

class HeaderMenu extends PureComponent {
  render() {
    const { location, token, dispatch } = this.props;

    return (
      <Header
        style={{ padding: 0 }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{
            lineHeight: '64px',
            maxWidth: '1300px',
            width: '100%',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          <Menu.Item>
            <Logo src={logoSrc} />
          </Menu.Item>
          {token && (
            <Menu.Item key="/">
              <NavLink to="/">Home</NavLink>
            </Menu.Item>
          )}
          <Menu.Item key="/standorte">
            <NavLink to="/standorte">Standorte</NavLink>
          </Menu.Item>
          {token && (
            <Menu.Item key="/tags">
              <NavLink to="/tags">Kategorien</NavLink>
            </Menu.Item>
          )}
          {token && (
            <Menu.Item key="/einstellungen">
              <NavLink to="/einstellungen">Einstellungen</NavLink>
            </Menu.Item>
          )}
          <Menu.Item style={{ float: 'right' }}>
            {token ? (
              <div
                onClick={() => dispatch(logout())}
                onKeyPress={() => dispatch(logout())}
                role="button"
                tabIndex={0}
              >
                Logout
              </div>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderMenu);
