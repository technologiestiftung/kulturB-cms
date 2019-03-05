import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Form, Input, Button, Spin, Select, Modal, Col, Row, Upload, Icon, AutoComplete, List
} from 'antd';
import {
  Map, CircleMarker, TileLayer
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import history from '~/history';
import {
  create, update, getTags, remove, removeImage, locationSearch
} from '~/services/locationApi';
import formItems from './form-items-config';

const MapWrapper = styled(Row)`
  &&& {
    height: 250px;
  }

  .leaflet-container,
  > div {
    height: 100%;
  }
`;

const formItemLayout = {
  labelCol: {
    sm: {
      span: 4
    },
    md: {
      span: 3
    }
  },
  wrapperCol: {
    sm: {
      span: 10
    },
    md: {
      span: 13
    }
   }
};

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

function renderError() {
  return (
    <Container>
      <h1>Standort Fehler</h1>
      Der gesuchte Standort konnte nicht gefunden werden.

      <div style={{ marginTop: '15px' }}>
        <Button>
          <Link to="/standorte">Zurück zur Übersicht</Link>
        </Button>
      </div>
    </Container>
  );
}

class Location extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    tags: [],
    isDeleteModalVisible: false,
    isError: false,
    isUploading: false,
    venueAutoCompleteList: [],
    venuesAutoCompleteValue: '',
    venueList: []
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

        const updates = { venues: this.state.venueList.map(v => v.id), ...values };
        update(this.props.match.params.id, updates);
      }
    });
  }

  onUploadChange({ file }) {
    if (file.status === 'uploading') {
      this.setState({ isUploading: true });
    }

    if (file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        item: {
          ...this.state.item,
          logo: file.response
        },
        isUploading: false
      });
    }
  }

  async onImageRemove() {
    const res = await removeImage(this.state.item.logo.id);
    this.setState({
      item: {
        ...this.state.item,
        logo: null
      }
    });
  }

  onOpenModal(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.setState({
      isDeleteModalVisible: true
    });
  }

  async onSearchVenue(search) {
    this.setState({
      venuesAutoCompleteValue: search
    });
    if (search.length < 3) {
      return null;
    }

    const { data } = await locationSearch(search);

    this.setState({ venueAutoCompleteList: data });
  }

  onSelectItem(id, option) {
    const name = option.props.children;

    this.setState({
      venueAutoCompleteList: [],
      venuesAutoCompleteValue: '',
      venueList: [...this.state.venueList, { id, name }]
    });
  }

  onDeleteItem(id) {
    this.setState(prevState => ({
      venueList: prevState.venueList.filter(venue => venue.id !== id)
    }));
  }

  async onOk() {
    await remove(this.props.match.params.id);
    this.closeModal();

    history.push('/standorte');
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false
    });
  }

  getInputComponent(type) {
    switch (type) {
      case 'tags': return getTagInput(this.state.tags);
      case 'types': return getTypeInput(config.types);
      case 'textarea': return <Input.TextArea autosize={{ minRows: 2, maxRows: 8 }} />;
      default: return <Input />;
    }
  }

  async loadLocation(tags) {
    try {
      const { id } = this.props.match.params;
      const res = await fetch(`${config.url.base}${config.url.locations}/${id}`);

      if (res.status !== 200) {
        return this.setState({ isError: true, isLoading: false });
      }

      const item = await res.json();
      this.setState({
        item,
        tags,
        isLoading: false,
        venueList: item.venues
      });
    } catch (e) {
      this.setState({ isError: true, isLoading: false });
    }
  }

  renderMap() {
    if (!this.state.item.location) {
      return null;
    }

    return (
      <MapWrapper gutter={16}>
        <Col span={16}>
          <Map center={this.state.item.location.coordinates} zoom={12}>
            <TileLayer
              url="https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}.png?key=IA1qWrAbZAe6JUuSfLgB"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <CircleMarker center={this.state.item.location.coordinates} radius={10} />
          </Map>
        </Col>
      </MapWrapper>
    );
  }

  getVenuesInput(item) {
    const { venueList } = this.state;
    const hasVenueList = this.state.venueList && this.state.venueList.length > 0;

    return [
      <Form.Item
        key={item.name}
        label={item.label}
        {...formItemLayout}
      >
        <AutoComplete
          onSearch={search => this.onSearchVenue(search)}
          onSelect={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
          value={this.state.venuesAutoCompleteValue}
        >
          {this.state.venueAutoCompleteList
            .map(v => (
              <AutoComplete.Option
                disabled={venueList && venueList.find(venue => venue.id === v.id)}
                key={v.id}
              >
                {v.name}
              </AutoComplete.Option>
            ))
          }
        </AutoComplete>
      </Form.Item>,
      hasVenueList && (
        <Row gutter={16} style={{ marginBottom: '15px' }}>
          <Col span={16}>
            <List
              key="venuelist"
              bordered
              dataSource={venueList}
              renderItem={listItem => (
                <List.Item
                  key={listItem.id}
                  actions={[
                    <Button
                      icon="delete"
                      onClick={() => this.onDeleteItem(listItem.id)}
                    />
                  ]}
                >
                  {listItem.name}
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )
    ];
  }

  renderItem(item) {
    const { getFieldDecorator } = this.props.form;
    const fieldDecoratorOptions = {
      rules: item.rules || []
    };

    if (item.getInitialValue) {
      fieldDecoratorOptions.initialValue = item.getInitialValue(this);
    }

    if (item.type === 'venues') {
      return this.getVenuesInput(item);
    }

    return (
      <Form.Item
        key={item.name}
        label={item.label}
        {...formItemLayout}
      >
        {getFieldDecorator(item.name, fieldDecoratorOptions)(
          this.getInputComponent(item.type)
        )}
      </Form.Item>
    );
  }

  getFilesList() {
    if (!this.state.item.logo) {
      return [];
    }

    this.state.item.logo.uid = this.state.item.logo.id;
    this.state.item.logo.thumbUrl = this.state.item.logo.url;

    return [this.state.item.logo];
  }

  renderUpload() {
    if (this.props.isCreateMode) {
      return null;
    }

    const hasImage = this.state.item.logo && this.state.item.logo.id;

    return (
      <Row style={{ marginBottom: '15px' }}>
        <Col span={16}>
          {hasImage && <div>Logo:</div>}
          <Upload
            data={{
              relation: 'location',
              relId: this.state.item.id,
              type: 'logo'
            }}
            name="file"
            action={`${config.url.base}${config.url.upload}`}
            headers={{
              Authorization: this.props.token
            }}
            listType="picture"
            defaultFileList={this.getFilesList()}
            multiple
            onChange={evt => this.onUploadChange(evt)}
            onRemove={evt => this.onImageRemove(evt)}
          >
            {!hasImage && (
              <Button>
                <Icon type="upload" /> Logo hochladen
              </Button>
            )}
          </Upload>
        </Col>
      </Row>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
        {this.renderUpload()}
        {formItems.map(item => this.renderItem(item))}
        {this.renderMap()}
        <Row style={{ marginTop: '15px' }}>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Speichern
            </Button>
            {!this.props.isCreateMode && (
              <Button
                type="danger"
                icon="delete"
                onClick={evt => this.onOpenModal(evt)}
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

  render() {
    const { isCreateMode } = this.props;
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';

    if (this.state.isError) {
      return renderError();
    }

    return (
      <Container>
        <h1>Standort {title}</h1>
        {this.state.isLoading ? <Spin /> : this.renderForm()}
        <Modal
          title="Eintrag löschen"
          visible={this.state.isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag <strong>{this.state.item.name}</strong> löschen wollen?
          </p>
        </Modal>
      </Container>
    );
  }
}

const WrappedLocation = Form.create({ name: 'location' })(Location);

export default WrappedLocation;
