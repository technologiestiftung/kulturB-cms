import React, { PureComponent } from 'react';

import { ContainerBg } from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';

class Home extends PureComponent {
  render() {
    return (
      <ContainerBg>
        <HeaderArea>
          <h1>TSB Admin</h1>
        </HeaderArea>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
      </ContainerBg>
    );
  }
}

export default Home;
