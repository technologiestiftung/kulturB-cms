import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

import Header from '~/components/Header';
import Home from '~/pages/Home';
import Locations from '~/pages/Locations';
import NoMatch from '~/pages/NoMatch';
import { Layout } from 'antd';

const AppWrapper = styled.div`
  position: relative;
`;

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Layout>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/standorte" component={Locations} />
            <Route component={NoMatch} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
