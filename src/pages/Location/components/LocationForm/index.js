import React, { PureComponent } from 'react';
import {
  Row, Col, Button, Form
} from 'antd';

import Map from '~/pages/Location/components/Map';
import VenuesInput from '~/pages/Location/components/VenuesInput';
import Upload from '~/pages/Location/components/Upload';
import formItems from '~/pages/Location/form-items-config';
import OpeningHoursInput from '../OpeningHoursInput';

class LocationForm extends PureComponent {
  renderItem(item) {
    const { getFieldDecorator } = this.props.form;
    const fieldDecoratorOptions = {
      rules: item.rules || []
    };

    if (item.getInitialValue) {
      fieldDecoratorOptions.initialValue = item.getInitialValue(this);
    }

    if (item.valuePropName) {
      fieldDecoratorOptions.valuePropName = item.valuePropName;
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
        <Form.Item
          key={item.name}
          label={item.label}
          {...this.props.formItemLayout}
        >
          <OpeningHoursInput>
            {getFieldDecorator(item.name, fieldDecoratorOptions)(
              this.props.getInputComponent(item.type)
            )}
          </OpeningHoursInput>
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={item.name}
        label={item.label}
        {...this.props.formItemLayout}
      >
        {getFieldDecorator(item.name, fieldDecoratorOptions)(
          this.props.getInputComponent(item.type)
        )}
      </Form.Item>
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
        <Map
          updatePosition={(lat, lng) => this.props.updatePosition(lat, lng)}
          id={this.props.item.id}
          location={this.props.item.location}
        />
        <Row style={{ marginTop: '15px' }}>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Speichern
            </Button>
            {!this.props.isCreateMode && (
              <Button
                type="danger"
                icon="delete"
                onClick={evt => this.props.onOpenModal(evt)}
                style={{ marginLeft: '15px' }}
              >
                Standort löschen
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

export default LocationForm;
