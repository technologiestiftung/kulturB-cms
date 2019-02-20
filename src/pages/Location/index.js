import React, { PureComponent } from 'react';
import Container from '~/components/Container';
import {
  Form, Input, Button, Spin, Select
} from 'antd';

import { createLocation, updateLocation, getTags } from '~/services/locationApi';


const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 }
};

const formItems = [{
  name: 'name',
  label: 'Name',
  rules: [{
    required: true, message: 'Bitte einen Namen angeben'
  }],
  type: 'input',
  getInitialValue: component => component.state.item.name
}, {
  name: 'website',
  label: 'Webseite',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  type: 'input',
  getInitialValue: component => component.state.item.website
}, {
  name: 'address',
  label: 'Adresse',
  rules: [{
    type: 'string', message: 'Bitten eine Adresse ein'
  }],
  type: 'input',
  getInitialValue: component => component.state.item.address
}, {
  name: 'zipcode',
  label: 'PLZ',
  rules: [{
    type: 'string', message: 'Bitten eine gültige PLZ ein', len: 5
  }],
  type: 'input',
  getInitialValue: component => component.state.item.zipcode
}, {
  name: 'city',
  label: 'Stadt',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  type: 'input',
  getInitialValue: component => component.state.item.city
}, {
  name: 'tags',
  label: 'Tags',
  rules: [],
  type: 'tags',
  getInitialValue: component => component.state.item.tags
}];

class Location extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    tags: []
  }

  async componentDidMount() {
    const tags = await getTags();

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, tags });
    }

    this.loadLocation(tags);
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

  getTagInput() {
    const tags = this.state.tags.map(tag => (
      <Select.Option key={tag._id}>{tag.name}</Select.Option>
    ));

    return (
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Tags"
      >
        {tags}
      </Select>
    )
  }

  getInputComponent(type) {
    switch (type) {
      case 'tags': return this.getTagInput();
      default: return <Input />;
    }
  }

  async loadLocation(tags) {
    const { id } = this.props.match.params;
    const res = await fetch(`${config.url.base}${config.url.locations}/${id}`);
    const item = await res.json();

    this.setState({ item, tags, isLoading: false });
  }

  renderItem(item) {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form.Item
        key={item.name}
        label={item.label}
        {...formItemLayout}
      >
        {getFieldDecorator(item.name, {
          rules: item.rules || [],
          initialValue: item.getInitialValue(this)
        })(
          this.getInputComponent(item.type)
        )}
      </Form.Item>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
        {formItems.map(item => this.renderItem(item))}
        <Form.Item
          wrapperCol={{ span: 12, offset: 2 }}
        >
          <Button type="primary" htmlType="submit">
            Abschicken
          </Button>
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
