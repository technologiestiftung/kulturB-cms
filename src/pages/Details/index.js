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

import { getTags } from '~/services/tagsApi';
import { renderSuccessMessage, renderErrorMessage } from '~/services/utils';
import SubmissionControls from './components/SubmissionControls';

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

const create = async (createEntry, createSubmission, data, token) => {
  let res;
  if (token) {
    res = await createEntry(data);
  } else {
    res = await createSubmission({ data });
  }
  if (!res.id) return renderErrorMessage();

  renderSuccessMessage();
  return res;
};

const update = async (updateEntry, createChange, data, venueList, item, id, token) => {
  const updates = {
    venues: venueList.map(v => v.id),
    location: item.location,
    ...data
  };

  let res;
  if (token) {
    res = await updateEntry(id, updates);
  } else {
    res = await createChange({
      meta: { organisation: item.id },
      data
    });
  }
  if (!res.id) return renderErrorMessage();

  renderSuccessMessage();
  return res;
};

class Details extends PureComponent {
  state = {
    item: {},
    meta: {},
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

  componentDidMount() {
    this.loadFullDetails();
  }

  async loadFullDetails() {
    this.setState({ isLoading: true });
    const { data: tags } = await getTags();

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, tags });
    }

    this.loadDetails(tags);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.loadFullDetails();
    }
  }

  onSubmit(evt, redirect) {
    evt.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {
          actions, token, form, match, config, role,
        } = this.props;
        const [type] = Object.keys(config);

        if (this.isCreateMode) {
          this.isCreateMode = false;
          const res = await create(actions[type].create, actions.submissions.create, values, token);
          form.setFieldsValue(res);
          return this.setState({ item: res });
        }

        const { item, meta, venueList } = this.state;
        if (type === 'changes' && role === 'ADMIN') {
          if (meta && meta.organisation && meta.organisation.id) {
            const res = await update(
              actions.locations.update, actions.locations.create,
              values,
              venueList, item,
              meta.organisation.id, token
            );

            await actions.changes.remove(match.params.id);
            return this.setState({ item: res });
          }

          const res = await create(
            actions.locations.create,
            actions.submissions.create,
            values,
            token
          );
          await actions.submissions.remove(item.id);
          return this.setState({ item: res });
        }
        const res = await update(
          actions[type].update, actions.changes.create,
          values,
          venueList, item,
          match.params.id, token
        );
        this.setState({ item: res });

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

  async onSearchVenue(searchTerm) {
    this.setState({
      venuesAutoCompleteValue: searchTerm
    });
    if (searchTerm.length < 3) {
      return null;
    }

    const { data } = await this.props.actions.locations.search(searchTerm);

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
    const { actions, config, match } = this.props;
    const [type] = Object.keys(config);
    await actions[type].remove(match.params.id);
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

  async loadDetails(tags) {
    try {
      const { actions, config, match } = this.props;
      const { id } = match.params;
      const [type] = Object.keys(config);
      let item = await actions[type].getById(id);
      if (item.meta && item.data) {
        this.setState({ meta: item.meta });
        item = item.data;
      }

      if (item.statusCode && item.statusCode.startsWith(4)) {
        return this.setState({ isError: true, isLoading: false });
      }

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
    const {
      isCreateMode,
      config: tableConfig,
      form,
      role,
      organisation,
      token
    } = this.props;
    const {
      item,
      venueList,
      venueAutoCompleteList,
      venuesAutoCompleteValue
    } = this.state;

    const [typeName] = Object.keys(tableConfig);
    const { label } = tableConfig[typeName];
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';
    const entry = item.data ? item.data : item;

    if (this.state.isError) {
      return renderError();
    }

    const isAdmin = role === 'ADMIN';
    const isOwnOrganisation = entry._id === organisation;

    return (
      <Container>
        <HeaderArea>
          <h1>{label} {title}</h1>
        </HeaderArea>
        {this.state.isLoading ? <Spin /> : (
          <>
            <LocationForm
              form={form}
              formItemLayout={formItemLayout}
              onSearchVenue={searchTerm => this.onSearchVenue(searchTerm)}
              onSelectItem={(selectedItem, option) => this.onSelectItem(selectedItem, option)}
              onDeleteItem={id => this.onDeleteItem(id)}
              getInputComponent={(type, name) => this.getInputComponent(type, name)}
              onSubmit={(evt, route) => this.onSubmit(evt, route)}
              onUploadChange={evt => this.onUploadChange(evt)}
              onImageRemove={() => this.onImageRemove()}
              updatePosition={(lat, lng) => this.updatePosition(lat, lng)}
              venueList={venueList}
              venueAutoCompleteList={venueAutoCompleteList}
              venuesAutoCompleteValue={venuesAutoCompleteValue}
              token={token}
              item={entry}
              isCreateMode={isCreateMode}
              controls={(
                <SubmissionControls
                  label={label}
                  isCreateMode={isCreateMode}
                  item={item}
                  onSubmit={(evt, route) => this.onSubmit(evt, route)}
                  onOpenModal={evt => this.onOpenModal(evt)}
                  formItemLayout={formItemLayout}
                  isAdmin={isAdmin}
                  isOwnOrganisation={isOwnOrganisation}
                />
              )}
            />
          </>
        )}
        <Modal
          title="Eintrag löschen"
          visible={this.state.isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag
            <strong> {entry.name} </strong>
            löschen wollen?
          </p>
        </Modal>
      </Container>
    );
  }
}

const WrappedDetails = Form.create({ name: 'details' })(Details);

export default WrappedDetails;
