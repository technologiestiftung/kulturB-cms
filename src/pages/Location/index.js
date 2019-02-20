import React, { PureComponent } from 'react';
import Container from '~/components/Container';
import {
  Form, Input, Button, Spin
} from 'antd';

import { createLocation, updateLocation } from '~/services/locationApi';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 }
};

class Location extends PureComponent {
  state = {
    data: null,
    isLoading: true
  }

  componentDidMount() {
    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false });
    }

    this.loadLocation();
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.isCreateMode) {
          return createLocation(values);
        }

        updateLocation(this.props.match.params.id, values);
      }
    });
  }

  async loadLocation() {
    const { id } = this.props.match.params;
    this.setState({ isLoading: true });

    const res = await fetch(`${config.url.base}${config.url.organisation}/${id}`);
    const data = await res.json();

    this.setState({ data, isLoading: false });
  }

  renderForm() {
    const {
      getFieldDecorator
    } = this.props.form;

    return (
      <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
        <Form.Item
          label="Name"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Bitte einen Namen angeben'
            }],
            initialValue: this.state.data.name
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="Webseite"
          {...formItemLayout}
        >
          {getFieldDecorator('website', {
            rules: [{
              type: 'string', message: 'Bitten eine gültige URL angeben'
            }],
            initialValue: this.state.data.website
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 12, offset: 2 }}
        >
          <Button type="primary" htmlType="submit">Abschicken</Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { isCreateMode } = this.props;
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';

    return (
      <Container>
        <h1>Standort {title}</h1>
        {this.state.isLoading ? <Spin /> : this.renderForm()}
      </Container>
    );
  }
}

const WrappedLocation = Form.create({ name: 'location' })(Location);

export default WrappedLocation;
