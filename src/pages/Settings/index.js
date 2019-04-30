import React, { PureComponent } from 'react';
import {
  Row, Col, Button, Form, Input, Icon, Spin, Divider, message
} from 'antd';

import { ContainerBg } from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import Import from '~/components/Import';
import Export from '~/components/Export';
import FormItem from '~/components/FormItem';
import { update } from '~/services/userApi';
import { renderSuccessMessage, renderErrorMessage, compareToFirstPassword } from '~/services/utils';

class Settings extends PureComponent {
  state = {
    loading: false,
    showPassword: false,
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} erfolgreich hochgeladen.`);
      this.setState({ loading: false });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload fehlgeschlagen.`);
      this.setState({ loading: false });
    }
  }

  onSubmit(evt) {
    const { form, userId } = this.props;
    evt.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        if (values.confirmPassword) {
          delete values.confirmPassword;
        }

        const res = await update(userId, values);
        if (!res.id) return renderErrorMessage();
        renderSuccessMessage();
      }
    });
  }

  togglePasswordVisibility() {
    this.setState(({ showPassword }) => ({ showPassword: !showPassword }));
  }

  render() {
    const { form, formItemLayout, role } = this.props;
    const { showPassword } = this.state;
    const isAdmin = role === 'ADMIN';
    return (
      <ContainerBg>
        <HeaderArea>
          <h1>Einstellungen</h1>
        </HeaderArea>
        <p>Lorem ipsum dolor sit amet fusce risus orci maecenas.
          Ligula curabitur malesuada. Fames dis luctus.
          Sed donec neque. Ac ipsum id justo aptent nunc tristique viverra metus justo enim porttitor.
        </p>
        <Spin spinning={this.state.loading}>
          <Divider>Importieren/Exportieren</Divider>
          <Export />
          {isAdmin && (
            <Import
              token={this.props.token}
              onChange={info => this.onChange(info)}
              beforeUpload={() => this.setState({ loading: true })}
            />
          )}
          <Divider>Passwort ändern</Divider>
          <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
            <FormItem
              key="password"
              label="Passwort"
              {...formItemLayout}
            >
              {form.getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Bitte Passwort eingeben!',
                }, {
                  min: 8, message: 'Passwort musst mindestens 8 Zeichen enthalten.'
                }, {
                  validator: (rule, value, cb) => compareToFirstPassword(form.getFieldValue('password'), form.getFieldValue('confirmPassword'), cb),
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
                rules: [{
                  required: form.isFieldTouched('password'), message: 'Bitte Passwort bestätigen!',
                }, {
                  validator: (rule, value, cb) => compareToFirstPassword(form.getFieldValue('password'), form.getFieldValue('confirmPassword'), cb),
                }]
              })(
                <Input
                  type={showPassword ? 'text' : 'password'}
                  prefix={<Icon type="eye" onClick={() => this.togglePasswordVisibility()} />}
                />
              )}
            </FormItem>

            <Row style={{ marginTop: '15px' }}>
              <Col style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
                  Speichern
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </ContainerBg>
    );
  }
}

const WrappedSettings = Form.create({ name: 'settings' })(Settings);

export default WrappedSettings;
