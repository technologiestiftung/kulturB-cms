import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Switch, Route, Router, Redirect
} from 'react-router-dom';
import styled from 'styled-components';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Location from '~/pages/Location';
import LocationsOverview from '~/pages/LocationsOverview';
import TagsOverview from '~/pages/TagsOverview';
import UsersOverview from '~/pages/UsersOverview';
import User from '~/pages/User';
import Login from '~/pages/Login';
import NoMatch from '~/pages/NoMatch';
import Settings from '~/pages/Settings';
import MetadataGenerator from './pages/MetadataGenerator';
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

const Content = styled.div`
  padding: 0 16px;
  display: flex;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
`;

class App extends PureComponent {
  componentDidMount() {
    this.props.dispatch(refreshAccessToken());
  }

  render() {
    return (
      <Router history={history}>
        <Layout>
          <Header {...this.props} dispatch={this.props.dispatch} />
          <Content>
            <Switch>
              <Route path="/" exact component={() => <LocationsOverview {...this.props} />} />
              <Route path="/login" component={Login} />
              <Route path="/metadaten/:id" component={MetadataGenerator} />
              <Route path="/metadaten" component={MetadataGenerator} />
              <PrivateRoute token={this.props.token} path="/kulturorte/neu" exact isCreateMode component={Location} />
              <PrivateRoute {...this.props} path="/kulturorte/:id" component={Location} />
              <PrivateRoute token={this.props.token} path="/tags" exact component={TagsOverview} />
              <PrivateRoute token={this.props.token} path="/einstellungen" component={Settings} />
              <PrivateRoute token={this.props.token} path="/nutzer/neu" exact isCreateMode component={User} />
              <PrivateRoute token={this.props.token} path="/nutzer/:id" component={User} />
              <PrivateRoute token={this.props.token} path="/nutzer" component={UsersOverview} />
              <PrivateRoute token={this.props.token} path="*" component={NoMatch} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Router>
    );
  }
}

export default connect(state => state.AppState)(App);
