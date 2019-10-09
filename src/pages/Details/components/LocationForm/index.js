import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Form, Divider
} from 'antd';

import FormItem from '~/components/FormItem';
import Map from '~/pages/Details/components/Map';
import VenuesInput from '~/pages/Details/components/VenuesInput';
import Upload from '~/pages/Details/components/Upload';
import formItems from '~/pages/Details/form-items-config';
import OpeningHoursInput from '../OpeningHoursInput';

const FormItemMultiple = styled(FormItem)`
  .ant-form-item-children {
    display: flex;
    flex-wrap: wrap;

    .ant-select-selection,
    input {
      width: 95%;
    }

    &:after {
      content: '';
      flex: auto;
    }

    .ant-form-item-label {
      line-height: 1;

      label {
        color: #777;
        font-size: 12px;
      }
    }

    .ant-form-item {
      width: 25%;
      min-width: 25%;
      margin-bottom: 5px;
    }
  }
`;

const FormMultipleChildrenLabel = styled.div`
  width: 100%;
  line-height: 1.4;
`;

class LocationForm extends PureComponent {
  getItemFieldDecoratorOptions(item) {
    const fieldDecoratorOptions = {
      rules: item.rules || []
    };

    if (item.getInitialValue) {
      fieldDecoratorOptions.initialValue = item.getInitialValue(this);
    }

    if (item.valuePropName) {
      fieldDecoratorOptions.valuePropName = item.valuePropName;
    }

    return fieldDecoratorOptions;
  }

  renderItem(item) {
    const { getFieldDecorator } = this.props.form;
    const fieldDecoratorOptions = this.getItemFieldDecoratorOptions(item);

    const { diff } = this.props;
    let validateStatus;
    if (diff) {
      if (item.type === 'multipleinput') {
        item.children.map((child) => {
          const res = child;
          if (diff.find(d => d.path === `/${child.name.replace(/\./g, '/')}`)) {
            res.validateStatus = 'warning';
          }
          return res;
        });
      }
      const found = diff.find(d => d.path.includes(item.name));
      if (found) {
        validateStatus = 'warning';
      }
    }

    if (item.type === 'venues') {
      return (
        <VenuesInput
          key={item.name}
          item={item}
          formItemLayout={this.props.formItemLayout}
          venueList={this.props.venueList}
          venueAutoCompleteList={this.props.venueAutoCompleteList}
          venuesAutoCompleteValue={this.props.venuesAutoCompleteValue}
          onSearchVenue={search => this.props.onSearchVenue(search)}
          onSelectItem={(selectedItem, option) => this.props.onSelectItem(selectedItem, option)}
          onDeleteItem={id => this.props.onDeleteItem(id)}
        />
      );
    }

    if (item.type === 'openingHours') {
      return (
        <FormItem
          key={item.name}
          label={item.label}
          validateStatus={validateStatus}
          {...this.props.formItemLayout}
        >
          <OpeningHoursInput
            form={this.props.form}
            initialValue={fieldDecoratorOptions.initialValue}
          />
        </FormItem>
      );
    }

    if (item.type === 'multipleinput') {
      return (
        <FormItemMultiple
          key={item.name}
          label={item.label}
          {...this.props.formItemLayout}
        >
          {
            item.childrenLabel
            && <FormMultipleChildrenLabel>{item.childrenLabel}</FormMultipleChildrenLabel>
          }
          {item.children.map((child) => {
            const fieldDecoratorOpts = this.getItemFieldDecoratorOptions(child);
            const props = {
              key: child.name,
              style: child.style ? child.style : {}
            };

            if (child.type !== 'checkbox') {
              props.label = child.label;
            }

            return (
              <FormItem {...props} validateStatus={child.validateStatus}>
                {getFieldDecorator(child.name, fieldDecoratorOpts)(
                  this.props.getInputComponent(child.type, child.label)
                )}
              </FormItem>
            );
          })}
          <Divider />
        </FormItemMultiple>
      );
    }

    return (
      <FormItem
        key={item.name}
        label={item.label}
        validateStatus={validateStatus}
        {...this.props.formItemLayout}
      >
        {getFieldDecorator(item.name, fieldDecoratorOptions)(
          this.props.getInputComponent(item.type)
        )}
      </FormItem>
    );
  }

  componentWillMount() {
    const { token } = this.props;
    if (!token) {
      formItems.unshift({
        name: 'meta.email',
        label: 'Email',
        rules: [{
          required: true,
          message: 'Bitte Email angeben',
          whitespace: true,
          type: 'email'
        }]
      });
    }
  }

  render() {
    const {
      onSubmit,
      onUploadChange,
      onImageRemove,
      item,
      token,
      isCreateMode,
      controls,
    } = this.props;

    return (
      <Form onSubmit={evt => onSubmit(evt)} layout="horizontal">
        <Upload
          token={token}
          onUploadChange={onUploadChange}
          onImageRemove={onImageRemove}
          id={item.id}
          image={item.logo}
          isCreateMode={isCreateMode}
          type="logo"
        />
        <Upload
          token={token}
          onUploadChange={onUploadChange}
          onImageRemove={onImageRemove}
          id={item.id}
          image={item.teaser}
          isCreateMode={isCreateMode}
          type="teaser"
        />
        {formItems.map(i => this.renderItem(i))}
        {item.location && (
          <Map
            updatePosition={(lat, lng) => this.props.updatePosition(lat, lng)}
            id={item.id}
            location={item.location}
          />
        )}
        {controls}
      </Form>
    );
  }
}

export default LocationForm;
