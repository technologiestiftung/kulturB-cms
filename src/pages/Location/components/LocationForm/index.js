import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import {
  Row, Col, Form
} from 'antd';

import FormItem from '~/components/FormItem';
import Map from '~/pages/Location/components/Map';
import VenuesInput from '~/pages/Location/components/VenuesInput';
import Upload from '~/pages/Location/components/Upload';
import formItems from '~/pages/Location/form-items-config';
import OpeningHoursInput from '../OpeningHoursInput';
import StyledButton from '~/components/Button';

const FlexRow = styled(Row)`
  &&& {
    display: flex;
    margin: 15px 0;
  }
`;

const FlexCol = styled(Col)`
  &&& {
    flex: auto;

    .ant-form-item-label, .ant-form-item-control-wrapper {
      width: 50%;
    }

  }
`;

const FormItemMultiple = styled(FormItem)`
  .ant-form-item-children {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .ant-form-item-label {
      line-height: 1;

      label {
        color: #777;
        font-size: 12px;
      }
    }

    .ant-form-item {
      width: 24%;
      margin-bottom: 5px;
    }
  }
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

    if (item.type === 'label') {
      return (
        <Fragment>
          <h3>{item.label}</h3>
          <FlexRow key={item.label}>
            {item.childrens.map(children => <FlexCol>{this.renderItem(children)}</FlexCol>)}
          </FlexRow>
        </Fragment>
      );
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
          {...this.props.formItemLayout}
        >
          <OpeningHoursInput>
            {getFieldDecorator(item.name, fieldDecoratorOptions)(
              this.props.getInputComponent(item.type)
            )}
          </OpeningHoursInput>
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
          {item.childrens.map((child) => {
            const fieldDecoratorOpts = this.getItemFieldDecoratorOptions(child);

            return (
              <FormItem
                key={child.name}
                label={child.label}
              >
                {getFieldDecorator(child.name, fieldDecoratorOpts)(
                  this.props.getInputComponent(child.type)
                )}
              </FormItem>
            );
          })}
        </FormItemMultiple>
      );
    }

    return (
      <FormItem
        key={item.name}
        label={item.label}
        {...this.props.formItemLayout}
      >
        {getFieldDecorator(item.name, fieldDecoratorOptions)(
          this.props.getInputComponent(item.type)
        )}
      </FormItem>
    );
  }

  render() {
    return (
      <Form onSubmit={evt => this.props.onSubmit(evt)} layout="horizontal">
        <Upload
          token={this.props.token}
          onUploadChange={this.props.onUploadChange}
          onImageRemove={this.props.onImageRemove}
          id={this.props.item.id}
          logo={this.props.item.logo}
          isCreateMode={this.props.isCreateMode}
        />
        {formItems.map(item => this.renderItem(item))}
        {this.props.item.location && (
          <Map
            updatePosition={(lat, lng) => this.props.updatePosition(lat, lng)}
            id={this.props.item.id}
            location={this.props.item.location}
          />
        )}
        <Row style={{ marginTop: '15px' }}>
          <Col span={16} style={{ textAlign: 'right' }}>
            {!this.props.isCreateMode && (
              <StyledButton href={`/metadaten/${this.props.item._id}`}>
                Zum Metadaten Generator
              </StyledButton>
            )}
            <StyledButton type="primary" htmlType="submit">
              Speichern
            </StyledButton>
            {!this.props.isCreateMode && (
              <StyledButton
                type="danger"
                icon="delete"
                onClick={evt => this.props.onOpenModal(evt)}
              >
                Kulturort löschen
              </StyledButton>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

export default LocationForm;
