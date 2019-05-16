import React, { PureComponent, Fragment } from 'react';
import randomize from 'randomatic';
import {
  Input, Icon
} from 'antd';

import FormItem from '~/components/FormItem';
import formItemLayout from '~/pages/Location/form-layout-config';

class PasswordInput extends PureComponent {
  state = {
    showPassword: false,
    confirmDirty: false,
    password: randomize('Aa0!', 8)
  }

  togglePasswordVisibility() {
    this.setState(({ showPassword }) => ({ showPassword: !showPassword }));
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwörter sind unterschiedlich!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState(prevState => ({ confirmDirty: prevState.confirmDirty || !!value }));
  }

  render() {
    const { form, isCreateMode, required = true } = this.props;
    const { showPassword, password } = this.state;

    return (
      <Fragment>
        <FormItem
          key="password"
          label="Passwort"
          {...formItemLayout}
        >
          {form.getFieldDecorator('password', {
            initialValue: isCreateMode && password,
            rules: [{
              required, message: 'Bitte Passwort eingeben!',
            }, {
              min: 8, message: 'Passwort musst mindestens 8 Zeichen enthalten.'
            }, {
              validator: this.validateToNextPassword
            }]
          })(
            <Input
              type={showPassword ? 'text' : 'password'}
              prefix={<Icon type="eye" onClick={() => this.togglePasswordVisibility()} />}
            />
          )}
        </FormItem>

        <FormItem
          key="confirmPassword"
          label="Passwort wiederholen"
          {...formItemLayout}
        >
          {form.getFieldDecorator('confirmPassword', {
            initialValue: isCreateMode && password,
            rules: [{
              required: form.isFieldTouched('password'), message: 'Bitte Passwort bestätigen!',
            }, {
              validator: this.compareToFirstPassword
            }]
          })(
            <Input
              type={showPassword ? 'text' : 'password'}
              prefix={<Icon type="eye" onClick={() => this.togglePasswordVisibility()} />}
              onBlur={this.handleConfirmBlur}
            />
          )}
        </FormItem>
      </Fragment>
    );
  }
}

export default PasswordInput;
