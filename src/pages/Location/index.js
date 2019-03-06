import React, { PureComponent } from 'react';
import {
  Form, Input, Button, Spin, Select, Modal, Col, Row
} from 'antd';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import Map from './components/Map';
import Upload from './components/Upload';
import VenuesInput from './components/VenuesInput';
import getTagInput from './components/TagInput';
import getTypeInput from './components/TypeInput';

import history from '~/history';
import {
  create, update, getTags, remove, locationSearch
} from '~/services/locationApi';
import formItems from './form-items-config';


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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.isCreateMode) {
          this.isCreateMode = false;
            const res = await create(values);
            if (!res.id) return this.setState({ isError: true, isLoading: false });
            history.replace(`/standorte/${res.id}`);
            return this.setState({ item: res });
        }

        const updates = {
          venues: this.state.venueList.map(v => v.id),
          location: this.state.item.location,
          ...values
        };

        const res = await update(this.props.match.params.id, updates);
        this.setState({ item: res });
      }
    });
  }

  onUploadChange(done) {
    if (!done) {
      this.setState({ isUploading: true });
    } else {
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

  updatePosition(lat, lng) {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        location: {
          type: 'Point',
          coordinates: [lat, lng]
        }
      }
    }));
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
      return (
        <VenuesInput
          item={item}
          formItemLayout={formItemLayout}
          venueList={this.state.venueList}
          venueAutoCompleteList={this.state.venueAutoCompleteList}
          venuesAutoCompleteValue={this.state.venuesAutoCompleteValue}
          onSearchVenue={search => this.onSearchVenue(search)}
          onSelectItem={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
          onDeleteItem={id => this.onDeleteItem(id)}
        />
      );
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

  renderForm() {
    return (
      <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
        <Upload
          token={this.props.token}
          onUploadChange={this.onUploadChange}
          onImageRemove={this.onImageRemove}
          {...this.state.item}
        />
        {formItems.map(item => this.renderItem(item))}
        <Map updatePosition={(lat, lng) => this.updatePosition(lat, lng)} {...this.state.item} />
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
