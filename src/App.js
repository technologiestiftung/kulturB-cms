import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Switch, Route, Router, Redirect
} from 'react-router-dom';

import Header from '~/components/Header';
import Home from '~/pages/Home';
import Location from '~/pages/Location';
import LocationsOverview from '~/pages/LocationsOverview';
import TagsOverview from '~/pages/TagsOverview';
import Login from '~/pages/Login';
import NoMatch from '~/pages/NoMatch';
import Settings from '~/pages/Settings';
import { Layout } from 'antd';
import history from '~/history';
import { refreshAccessToken } from '~/AppState';

const PrivateRoute = ({ component: Component, token = false, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      token ? <Component {...props} {...rest} token={token} /> : (
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
  componentDidMount() {
    this.props.dispatch(refreshAccessToken());
  }

  render() {
    return (
      <Router history={history}>
        <Layout>
          <Header token={this.props.token} dispatch={this.props.dispatch} />
          <Switch>
            <PrivateRoute token={this.props.token} path="/" exact component={Home} />
            <PrivateRoute token={this.props.token} path="/tags" exact component={TagsOverview} />
            <Route path="/standorte" exact component={() => <LocationsOverview token={this.props.token} />} />
            <PrivateRoute token={this.props.token} path="/standorte/neu" exact isCreateMode component={Location} />
            <PrivateRoute token={this.props.token} path="/standorte/:id" component={Location} />
            <PrivateRoute token={this.props.token} path="/einstellungen" component={Settings} />
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
