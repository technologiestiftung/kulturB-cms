import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Switch, Route, Router, Redirect
} from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'antd';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Details from '~/pages/Details';
import Overview from '~/pages/Overview';
import TagsOverview from '~/pages/TagsOverview';
import UsersOverview from '~/pages/UsersOverview';
import User from '~/pages/User';
import Login from '~/pages/Login';
import NoMatch from '~/pages/NoMatch';
import Settings from '~/pages/Settings';
import MetadataGenerator from '~/pages/MetadataGenerator';
import history from '~/history';
import { refreshAccessToken } from '~/AppState';

import locationApi from '~/services/locationApi';
import changesApi from '~/services/changesApi';
import submissionsApi from '~/services/submissionsApi';

const { tables } = config;

const PrivateRoute = ({
  component: Component,
  render,
  token = false,
  ...rest
}) => {
  let renderComponent = props => (
    <Redirect
      to={{ pathname: '/login', state: { from: props.location } }}
    />
  );

  if (token && render) {
    renderComponent = render;
  }

  if (token && Component) {
    renderComponent = props => <Component {...props} {...rest} token={token} />;
  }

  return (
    <Route
      {...rest}
      render={renderComponent}
    />
  );
};

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
    const api = {
      locations: locationApi,
      changes: changesApi,
      submissions: submissionsApi,
    };

    const { locations, changes } = tables;

    return (
      <Router history={history}>
        <Layout>
          <Header {...this.props} dispatch={this.props.dispatch} />
          <Content>
            <Switch>
              <Route path="/" exact render={() => <Overview actions={api.locations} config={locations} />} />
              <Route path="/login" component={Login} />
              <Route path="/metadaten/:id" render={props => <MetadataGenerator actions={api.locations} config={{ name: 'metadaten' }} {...props} {...this.props} />} />
              <Route path="/metadaten" component={MetadataGenerator} />
              <Route path="/kulturorte/neu" exact render={() => <Details actions={api} config={{ locations }} {...this.props} isCreateMode />} />
              <Route path="/kulturorte/:id" render={props => <Details actions={api} config={{ locations }} {...props} {...this.props} />} />
              <PrivateRoute token={this.props.token} path="/tags" exact component={TagsOverview} />
              <PrivateRoute {...this.props} path="/einstellungen" component={Settings} />
              <PrivateRoute token={this.props.token} path="/nutzer/neu" exact isCreateMode component={User} />
              <PrivateRoute token={this.props.token} path="/nutzer/:id" component={User} />
              <PrivateRoute {...this.props} path="/nutzer" component={UsersOverview} />
              <PrivateRoute {...this.props} path="/korrekturen/:id" component={props => <Details actions={api} config={{ changes }} {...props} {...this.props} />} />
              <PrivateRoute {...this.props} path="/korrekturen" render={() => <Overview {...this.props} actions={api.changes} config={changes} />} />
              <PrivateRoute {...this.props} path="/einreichungen/:id" component={props => <Details actions={api} config={{ changes }} {...props} {...this.props} />} />
              <PrivateRoute {...this.props} path="/einreichungen" component={() => <Overview {...this.props} actions={api.submissions} config={changes} />} />
              <PrivateRoute {...this.props} path="/vorschau/:id" component={props => <MetadataGenerator actions={api.changes} config={{ name: 'vorschau' }} {...props} {...this.props} />} />
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
