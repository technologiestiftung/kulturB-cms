import React, { PureComponent } from 'react';
import {
  Form, Input, Button, Spin, Modal, notification, Switch
} from 'antd';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';
import LocationForm from './components/LocationForm';
import getSelectInput from '~/components/SelectInput';
import getAccessibilityInput from './components/AccessibiltyInput';
import formItemLayout from './form-layout-config';

import history from '~/history';
import {
  create, update, remove, locationSearch
} from '~/services/locationApi';
import { getTags } from '~/services/tagsApi';

function renderError() {
  return (
    <Container>
      <h1>Kulturort Fehler</h1>
      Der gesuchte Kulturort konnte nicht gefunden werden.

      <div style={{ marginTop: '15px' }}>
        <Button>
          <Link to="/kulturorte">Zurück zur Übersicht</Link>
        </Button>
      </div>
    </Container>
  );
}

function renderSuccessMessage() {
  return notification.success({
    message: 'Erfolgreich gespeichert.'
  });
}

function renderErrorMessage() {
  return notification.error({
    message: 'Ein Fehler ist aufgetreten. Versuchen Sie erneut.'
  });
}

class Location extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    tags: [],
    isDeleteModalVisible: false,
    isError: false,
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
            if (!res.id) return renderErrorMessage();
            history.replace(`/kulturorte/${res.id}`);
            renderSuccessMessage();
            this.props.form.setFieldsValue(res);
            return this.setState({ item: res });
        }

        const updates = {
          venues: this.state.venueList.map(v => v.id),
          location: this.state.item.location,
          ...values
        };

        const res = await update(this.props.match.params.id, updates);
        if (!res.id) return renderErrorMessage();
        // this.props.form.setFieldsValue(res);
        this.setState({ item: res });
        renderSuccessMessage();
      }
    });
  }

  onUploadChange(done) {
    if (done) {
      // Get this url from response in real world.
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          logo: done.file.response
        },
        isUploading: false
      }));
    }
  }

  onImageRemove() {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        logo: null
      }
    }));
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

    this.setState(prevState => ({
      venueAutoCompleteList: [],
      venuesAutoCompleteValue: '',
      venueList: [...prevState.venueList, { id, name }]
    }));
  }

  onDeleteItem(id) {
    this.setState(prevState => ({
      venueList: prevState.venueList.filter(venue => venue.id !== id)
    }));
  }

  async onOk() {
    await remove(this.props.match.params.id);
    this.closeModal();

    history.push('/kulturorte');
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
      case 'tags': return getSelectInput(this.state.tags);
      case 'types': return getSelectInput(config.types);
      case 'accessibility': return getAccessibilityInput(config.accessibility);
      case 'textarea': return <Input.TextArea autosize={{ minRows: 2, maxRows: 8 }} />;
      case 'switch': return <Switch />;
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
        <HeaderArea>
          <h1>Kulturort {title}</h1>
          <StyledButton href={`/metadaten/${this.state.item._id}`}>
            Zum Metadaten-Generator
          </StyledButton>
        </HeaderArea>
        {this.state.isLoading ? <Spin /> : (
          <LocationForm
            form={this.props.form}
            formItemLayout={formItemLayout}
            onSearchVenue={search => this.onSearchVenue(search)}
            onSelectItem={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
            onDeleteItem={id => this.onDeleteItem(id)}
            getInputComponent={type => this.getInputComponent(type)}
            onSubmit={evt => this.onSubmit(evt)}
            onUploadChange={evt => this.onUploadChange(evt)}
            onImageRemove={() => this.onImageRemove()}
            updatePosition={(lat, lng) => this.updatePosition(lat, lng)}
            onOpenModal={evt => this.onOpenModal(evt)}
            venueList={this.state.venueList}
            venueAutoCompleteList={this.state.venueAutoCompleteList}
            venuesAutoCompleteValue={this.state.venuesAutoCompleteValue}
            token={this.props.token}
            item={this.state.item}
            isCreateMode={this.props.isCreateMode}
          />
        )}
        <Modal
          title="Eintrag löschen"
          visible={this.state.isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag
            <strong> {this.state.item.name} </strong>
            löschen wollen?
          </p>
        </Modal>
      </Container>
    );
  }
}

const WrappedLocation = Form.create({ name: 'location' })(Location);

export default WrappedLocation;
