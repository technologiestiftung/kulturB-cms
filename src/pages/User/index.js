import React, { PureComponent } from 'react';
import {
  Form, Input, Row, Col, Button, Spin, Modal
} from 'antd';
import Select from 'react-select';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import FormItem from '~/components/FormItem';
import StyledButton from '~/components/Button';
import PasswordInput from '~/components/PasswordInput';

import history from '~/history';
import {
  findById, create, update, remove
} from '~/services/userApi';
import { get } from '~/services/locationApi';
import { renderSuccessMessage, renderErrorMessage } from '~/services/utils';
import formItemLayout from '~/pages/Details/form-layout-config';

function renderError() {
  return (
    <Container>
      <h1>Nutzer Fehler</h1>
      Der gesuchte Nutzer konnte nicht gefunden werden.

      <div style={{ marginTop: '15px' }}>
        <Button>
          <Link to="/">Zurück zur Übersicht</Link>
        </Button>
      </div>
    </Container>
  );
}

class User extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    isDeleteModalVisible: false,
    isError: false,
    locations: []
  }

  constructor(props) {
    super();

    this.isCreateMode = props.isCreateMode;
  }

  async componentDidMount() {
    const { data: locations } = await get({ limit: 0, fields: ['_id', 'name'] });

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, locations });
    }

    const { id } = this.props.match.params;
    const item = await findById(id);

    if (!item) {
      return this.setState({ isError: true, isLoading: false });
    }

    this.setState({
      item,
      isLoading: false,
      locations
    });
  }

  onSubmit(evt) {
    const { form, match } = this.props;
    evt.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        const { confirmPassword, ...updates } = values;

        if (this.isCreateMode) {
          const res = await create(updates);
          if (!res.id) return renderErrorMessage(res);

          this.isCreateMode = false;
          history.replace(`/nutzer/${res.id}`);
          renderSuccessMessage();
          form.setFieldsValue({ ...res, password: '', confirmPassword: '' });
          return this.setState({ item: res });
        }

        const res = await update(match.params.id, updates);
        if (!res.id) return renderErrorMessage();
        this.setState({ item: res });
        renderSuccessMessage();
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

  async onOk() {
    await remove(this.props.match.params.id);
    this.closeModal();

    history.push('/nutzer');
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false
    });
  }

  async selectLocation(organisation) {
    this.setState(({ item }) => ({
      item: {
        organisation,
        ...item
      }
    }));
  }

  render() {
    const { isCreateMode, form } = this.props;
    const {
      isLoading,
      item,
      locations,
      isDeleteModalVisible,
    } = this.state;
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';

    if (this.state.isError) {
      return renderError();
    }

    return (
      <Container>
        <HeaderArea>
          <h1>Nutzer {title}</h1>
        </HeaderArea>
        {isLoading ? <Spin /> : (
          <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
            <FormItem
              key="email"
              label="E-Mail"
              {...formItemLayout}
            >
              {form.getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'Ungültige E-Mail Addresse',
                }, {
                  required: true, message: 'E-Mail ist erforderlich',
                }],
                initialValue: item.email
              })(
                <Input />
              )}
            </FormItem>

            <PasswordInput
              form={form}
              isCreateMode={isCreateMode}
            />

            <FormItem
              key="organisation"
              label="Kulturort"
              {...formItemLayout}
            >
              {form.getFieldDecorator('organisation', {
                initialValue: item.organisation
                && { _id: item.organisation.id, name: item.organisation.name },
                rules: [{
                  required: true, message: 'Bitte ein Kulturort auswählen'
                }]
              })(
                <Select
                  placeholder="Kulturort auswählen..."
                  noOptionsMessage={() => 'Keinen Kulturort gefunden'}
                  onChange={({ value }) => this.selectLocation(value)}
                  options={locations}
                  getOptionValue={option => option.id}
                  getOptionLabel={option => option.name}
                  defaultValue={
                    item.organisation
                    && { _id: item.organisation.id, name: item.organisation.name }
                  }
                  isClearable={!!item.organisation}
                  isSearchable
                />
              )}
            </FormItem>

            <Row style={{ marginTop: '15px' }}>
              <Col {...formItemLayout.colLayout} style={{ textAlign: 'right' }}>
                <StyledButton type="primary" htmlType="submit">
                  Speichern
                </StyledButton>
                {!isCreateMode && (
                  <StyledButton
                    type="danger"
                    icon="delete"
                    onClick={evt => this.onOpenModal(evt)}
                    style={{ marginLeft: '5px' }}
                  >
                    Nutzer löschen
                  </StyledButton>
                )}
              </Col>
            </Row>
          </Form>
        )}
        <Modal
          title="Eintrag löschen"
          visible={isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag
            <strong> {item.name} </strong>
            löschen wollen?
          </p>
        </Modal>
      </Container>
    );
  }
}

const WrappedUser = Form.create({ name: 'user' })(User);

export default WrappedUser;
