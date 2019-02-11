import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

import Menu from '~/components/Menu';
import Home from '~/pages/Home';
import Locations from '~/pages/Locations';
import NoMatch from '~/pages/NoMatch';

const AppWrapper = styled.div`
  position: relative;
`;

class App extends PureComponent {
  render() {
    return (
      <Router>
        <AppWrapper>
          <Menu />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/standorte" component={Locations} />
            <Route component={NoMatch} />
          </Switch>
        </AppWrapper>
      </Router>
    );
  }
}

export default App;
