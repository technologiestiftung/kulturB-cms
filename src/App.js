import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Switch, Route, Router, Redirect
} from 'react-router-dom';

import Header from '~/components/Header';
import Home from '~/pages/Home';
import Locations from '~/pages/Locations';
import Login from '~/pages/Login-Example';
import NoMatch from '~/pages/NoMatch';
import { Layout } from 'antd';
import history from '~/history';

const PrivateRoute = ({ component: Component, token = false, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      token ? <Component {...props} /> : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      ))
    }
  />
);

class App extends PureComponent {
  render() {
    return (
      <Router history={history}>
        <Layout>
          <Header token={this.props.token} />
          <Switch>
            <PrivateRoute token={this.props.token} path="/" exact component={Home} />
            <PrivateRoute token={this.props.token} path="/standorte" component={Locations} />
            <Route path="/login" component={Login} />
            <Route component={NoMatch} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default connect(state => ({
  token: state.AppState.token
}))(App);
