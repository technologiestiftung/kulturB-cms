import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Container from '~/components/Container';
import {
  Form, Input, Button, Spin, Select
} from 'antd';
import {
  Map, CircleMarker, TileLayer
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import history from '~/history';
import { create, update, getTags } from '~/services/locationApi';

const MapWrapper = styled.div`
  width: 100%;
  height: 250px;

  .leaflet-container {
    height: 100%;
  }
`;

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
  getInitialValue: component => component.state.item.name
}, {
  name: 'types',
  label: 'Typ',
  rules: [{
    required: true, message: 'Bitte einen Typen auswählen angeben'
  }],
  type: 'types',
  getInitialValue: component => component.state.item.types
}, {
  name: 'website',
  label: 'Webseite',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.state.item.website
}, {
  name: 'address',
  label: 'Adresse',
  rules: [{
    type: 'string', message: 'Bitten eine Adresse ein'
  }],
  getInitialValue: component => component.state.item.address
}, {
  name: 'zipcode',
  label: 'PLZ',
  rules: [{
    type: 'string', message: 'Bitten eine gültige PLZ ein', len: 5
  }],
  getInitialValue: component => component.state.item.zipcode
}, {
  name: 'city',
  label: 'Stadt',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.state.item.city
}, {
  name: 'tags',
  label: 'Kategorien',
  rules: [],
  type: 'tags',
  getInitialValue: component => (component.state.item.tags ? component.state.item.tags.map(t => t._id) : undefined)
}];

function getTagInput(tags) {
  const options = tags.map(tag => (
    <Select.Option key={tag._id}>
      {tag.name}
    </Select.Option>
  ));

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Kategorien angeben"
    >
      {options}
    </Select>
  );
}

function getTypeInput(types) {
  const options = types.map(type => (
    <Select.Option key={type}>
      {type}
    </Select.Option>
  ));

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Typen festlegen"
    >
      {options}
    </Select>
  );
}

class Location extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    tags: []
  }

  constructor(props) {
    super();

    this.isCreateMode = props.isCreateMode;
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
        if (this.isCreateMode) {
          this.isCreateMode = false;
          return create(values).then(res => history.push(`/standorte/${res.id}`));
        }

        update(this.props.match.params.id, values);
      }
    });
  }

  getInputComponent(type) {
    switch (type) {
      case 'tags': return getTagInput(this.state.tags);
      case 'types': return getTypeInput(config.types);
      default: return <Input />;
    }
  }

  async loadLocation(tags) {
    const { id } = this.props.match.params;
    const res = await fetch(`${config.url.base}${config.url.locations}/${id}`);
    const item = await res.json();

    this.setState({ item, tags, isLoading: false });
  }

  renderMap() {
    if (!this.state.item.location) {
      return null;
    }

    return (
      <MapWrapper>
        <Map center={this.state.item.location.coordinates} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <CircleMarker center={this.state.item.location.coordinates} radius={10} />
        </Map>
      </MapWrapper>
    );
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
        {this.renderMap()}
        <Form.Item
          wrapperCol={{ span: 12, offset: 2 }}
        >
          <Button type="primary" htmlType="submit">
            Speichern
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
