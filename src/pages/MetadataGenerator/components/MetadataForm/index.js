import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Form, Input
} from 'antd';

import getSelectInput from '~/components/SelectInput';
import { getTags } from '~/services/tagsApi';
import items from './form-items-config';
import formItemLayout from './form-layout-config';

const { TextArea } = Input;
const { Item } = Form;

const RowItem = styled(Item)`
  display: flex !important;
  justify-content: center;
`;

class MetadataForm extends PureComponent {
  state = {
    tags: [],
    types: config.types
  }

  componentDidMount() {
    const fields = items.map(item => item.name);
    this.props.onValuesChange(null, this.props.form.getFieldsValue(fields));
  }

  async componentWillMount() {
    const { data: tags } = await getTags();
    return this.setState({ tags });
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location._id && location._id !== this.props.location._id) {
      this.resetFields();
      this.props.form.setFieldsValue(location);
    }
  }

  getInputComponent(type) {
    switch (type) {
      case 'textarea': return <TextArea />;
      case 'tags': return getSelectInput(this.state.tags);
      case 'types': return getSelectInput(this.state.types);
      default: return <Input />;
    }
  }

  resetFields() {
    const defaultValues = items
      .map(item => ({ [item.name]: item.defaultValue }))
      .reduce((prev, curr) => Object.assign(prev, curr));
    this.props.form.setFieldsValue(defaultValues);
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        {items.map(item => (
          <RowItem {...formItemLayout} label={item.label} key={item.label}>
            {getFieldDecorator(item.name, {
              initialValue: item.initialValue,
              rules: item.rules,
            })(this.getInputComponent(item.type))}
          </RowItem>
        ))}
      </Form>
    );
  }
}

const WrappedMetadata = Form.create({
  name: 'metadata',
  onValuesChange(props, changedValues, allValues) {
    props.onValuesChange(changedValues, allValues);
  },
})(MetadataForm);

export default WrappedMetadata;
