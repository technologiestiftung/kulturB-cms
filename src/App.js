import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Switch, Route, Router, Redirect
} from 'react-router-dom';

import Header from '~/components/Header';
import Home from '~/pages/Home';
import Location from '~/pages/Location';
import LocationsOverview from '~/pages/LocationsOverview';
import Login from '~/pages/Login';
import NoMatch from '~/pages/NoMatch';
import { Layout } from 'antd';
import history from '~/history';

const PrivateRoute = ({ component: Component, token = false, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      token ? <Component {...props} {...rest} /> : (
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
          <Header token={this.props.token} dispatch={this.props.dispatch} />
          <Switch>
            <PrivateRoute token={this.props.token} path="/" exact component={Home} />
            <PrivateRoute token={this.props.token} path="/standorte" exact component={LocationsOverview} />
            <PrivateRoute token={this.props.token} path="/standort-anlegen" exact isCreateMode component={Location} />
            <PrivateRoute token={this.props.token} path="/standorte/:id" component={Location} />
            <Route path="/login" component={Login} />
            <PrivateRoute token={this.props.token} path="*" component={NoMatch} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default connect(state => ({
  token: state.AppState.token
}))(App);
