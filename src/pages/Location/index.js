import React, { PureComponent } from 'react';
import {
  Form, Input, Button, Spin, Modal, Switch, Checkbox
} from 'antd';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import LocationForm from './components/LocationForm';
import SelectInput from '~/components/SelectInput';
import formItemLayout from './form-layout-config';

import history from '~/history';
import {
  create, update, remove, locationSearch
} from '~/services/locationApi';
import { getTags } from '~/services/tagsApi';
import { renderSuccessMessage, renderErrorMessage } from '~/services/utils';

function renderError() {
  return (
    <Container>
      <h1>Kulturort Fehler</h1>
      Der gesuchte Kulturort konnte nicht gefunden werden.

      <div style={{ marginTop: '15px' }}>
        <Button>
          <Link to="/">Zurück zur Übersicht</Link>
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
    venueAutoCompleteList: [],
    venuesAutoCompleteValue: '',
    venueList: []
  }

  constructor(props) {
    super();

    this.isCreateMode = props.isCreateMode;
  }

  async componentDidMount() {
    const { data: tags } = await getTags();

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, tags });
    }

    this.loadLocation(tags);
  }

  onSubmit(evt, redirect) {
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

        if (redirect) {
          history.push(redirect);
        }
      }
    });
  }

  onUploadChange(done, type) {
    if (done) {
      // Get this url from response in real world.
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          [type]: done.file.response
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

    history.push('/');
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false
    });
  }

  getInputComponent(type, inputLabel) {
    switch (type) {
      case 'tags': {
        const { tags } = this.state;
        const options = tags.map(({ name: label, _id: value }) => ({ label, value }));
        return <SelectInput options={options} mode="multiple" />;
      }
      case 'types': {
        const { types } = config;
        return <SelectInput options={types} mode="multiple" />;
      }
      case 'accessibility': {
        const { accessibility } = config;
        return <SelectInput options={accessibility} />;
      }
      case 'languages': {
        const languages = config.languages.map(language => ({ label: language, value: language }));
        return <SelectInput options={languages} mode="multiple" />;
      }
      case 'textarea': {
        const { TextArea } = Input;
        return <TextArea autosize={{ minRows: 2, maxRows: 8 }} />;
      }
      case 'checkbox': {
        return <Checkbox>{inputLabel}</Checkbox>;
      }
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
        </HeaderArea>
        {this.state.isLoading ? <Spin /> : (
          <LocationForm
            form={this.props.form}
            formItemLayout={formItemLayout}
            onSearchVenue={search => this.onSearchVenue(search)}
            onSelectItem={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
            onDeleteItem={id => this.onDeleteItem(id)}
            getInputComponent={(type, label) => this.getInputComponent(type, label)}
            onSubmit={(evt, route) => this.onSubmit(evt, route)}
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
