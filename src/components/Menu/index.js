import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Menu, Container } from 'semantic-ui-react';

const StyledMenu = styled(Menu)`
  &&& {
    border-radius: 0;
    border-top: none;
    box-shadow: none;
    background: #f8f8f8;
  }
`;

class HeaderMenu extends PureComponent {
  render() {
    const { pathname } = this.props.location;
    return (
      <StyledMenu
        stackable
        borderless
      >
        <Container>
          <Menu.Item header>
            <strong>TSB Admin</strong>
          </Menu.Item>

          <Menu.Item active={pathname === '/'}>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>

          <Menu.Item active={pathname === '/standorte'}>
            <NavLink to="/standorte">Standorte</NavLink>
          </Menu.Item>
        </Container>
      </StyledMenu>
    );
  }
}

export default withRouter(HeaderMenu);
