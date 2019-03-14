import React, { PureComponent } from 'react';
import {
  Form, Input, Button, Spin, Modal
} from 'antd';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import LocationForm from './components/LocationForm';
import getTagInput from './components/TagInput';
import getTypeInput from './components/TypeInput';
import formItemLayout from './form-layout-config';

import history from '~/history';
import {
  create, update, remove, locationSearch
} from '~/services/locationApi';
import { getTags } from '~/services/tagsApi';

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
    const { data } = await getTags();

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, tags: data });
    }

    this.loadLocation(data);
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
      const res = await fetch(`${config.url.base}${config.url.locations.base}/${id}`);

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

  render() {
    const { isCreateMode } = this.props;
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';

    if (this.state.isError) {
      return renderError();
    }

    return (
      <Container>
        <h1>Standort {title}</h1>
        {this.state.isLoading ? <Spin /> : (
          <LocationForm
            form={this.props.form}
            formItemLayout={formItemLayout}
            onSearchVenue={search => this.onSearchVenue(search)}
            onSelectItem={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
            onDeleteItem={id => this.onDeleteItem(id)}
            getInputComponent={type => this.getInputComponent(type)}
            onSubmit={evt => this.onSubmit(evt)}
            onUploadChange={this.onUploadChange}
            onImageRemove={this.onImageRemove}
            updatePosition={(lat, lng) => this.updatePosition(lat, lng)}
            onOpenModal={evt => this.onOpenModal(evt)}
            {...this.props}
            {...this.state}
          />
        )}
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
