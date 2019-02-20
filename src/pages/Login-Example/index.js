import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Container from '~/components/Container';
import { login } from '~/AppState';

class Login extends PureComponent {
  onSubmit() {
    this.props.dispatch(login());
  }

  render() {
    if (this.props.token) {
      return <Redirect to="/" />;
    }
    return (
      <Container>
        <h1>TSB Login</h1>
        <p>Login Form</p>
        <button onClick={() => this.onSubmit()}>Login!</button>
      </Container>
    );
  }
}

export default connect(state => ({
  token: state.AppState.token
}))(Login);
