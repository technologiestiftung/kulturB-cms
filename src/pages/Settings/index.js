import React, { PureComponent, Fragment } from 'react';
import {
  Row, Col, Button, Form, Spin, Divider, message
} from 'antd';

import { ContainerBg } from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import Import from '~/components/Import';
import Export from '~/components/Export';
import PasswordInput from '~/components/PasswordInput';
import { update } from '~/services/userApi';
import { renderSuccessMessage, renderErrorMessage } from '~/services/utils';

class Settings extends PureComponent {
  state = {
    loading: false,
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} erfolgreich hochgeladen.`);
      this.setState({ loading: false });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload fehlgeschlagen.`);
      this.setState({ loading: false });
    }
  }

  onChangeUsers(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} erfolgreich hochgeladen.`);
      const link = document.createElement('a');
      link.download = 'neue_nutzer.csv';
      link.href = `data:text/csv; charset=UTF-8, ${encodeURIComponent(info.file.response)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.setState({ loading: false });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload fehlgeschlagen.`);
      this.setState({ loading: false });
    }
  }

  onSubmit(evt) {
    const { form, userId } = this.props;
    evt.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        const { confirmPassword, ...updates } = values;
        const res = await update(userId, updates);
        if (!res.id) return renderErrorMessage();
        renderSuccessMessage();
      }
    });
  }

  render() {
    const { form, role } = this.props;
    const isAdmin = role === 'ADMIN';
    return (
      <ContainerBg>
        <HeaderArea>
          <h1>Einstellungen</h1>
        </HeaderArea>
        <p>
          Hier können Sie Ihre Einstellungen ändern.
        </p>
        <Spin spinning={this.state.loading}>
          <Divider>Kulturorte Importieren/Exportieren</Divider>
          <p>
            Hier können Sie eine Liste aller Kulturorte herunterladen.
            {isAdmin && ` Administratoren können die Liste anpassen und
            erneut hochladen um mehrere Änderungen gleichzeitig durchzuführen.
            Falls in einer Zeile Änderungen vorkommen, wird der Kulturort mit
            der entsprechenden ID (aus der _id Spalte) angepasst.
            Falls die Spalte _id leer bleibt, wird dafür ein neuer Kulturort angelegt.`}
          </p>
          <Export type="locations" />
          {isAdmin && (
            <Import
              type="locations"
              token={this.props.token}
              onChange={info => this.onChange(info)}
              beforeUpload={() => this.setState({ loading: true })}
            />
          )}
          {isAdmin && (
            <Fragment>
              <Divider>Nutzer Importieren/Exportieren</Divider>
              <p>
                Hier können Sie eine Liste aller Nutzer/innen herunterladen.
                Sie können die Liste anpassen und erneut hochladen um mehrere
                Änderungen gleichzeitig durchzuführen. Falls in einer Zeile
                Änderungen vorkommen, wird der/die Nutzer/in mit der entsprechenden
                ID (aus der _id Spalte) angepasst.
              </p>
              <p>
              Um mehrere Nutzer/innen anzulegen, können Sie die Liste herunterladen
              und für die jeweiligen Kulturorte eine E-Mail Adresse (in der email Spalte)
              angeben. Wenn Sie die Liste erneut hochladen, werden neue Nutzer/innen angelegt
              und ein Kennwort vergeben. Die Liste mit den neuen Nutzer/innen und den
              jeweiligen Kennwörtern wird automatisch herunterladen.
              </p>
              <p>
                Achten Sie darauf, dass die Datei als Semikolon getrennt CSV Datei gespeichert wird.
              </p>
              <p>
                Um neue Nutzern anzulegen:
              </p>
              <ol>
                <li> Nutzerliste exportieren </li>
                <li> Spalten email, verified und organisation (_id) ausfüllen </li>
                <li> Geänderte Nutzerliste importieren </li>
                <li> Nutzerkennworter aus dem generierte File kopieren </li>
              </ol>
              <p>
                Um bestehende Nutzern zu bearbeiten:
              </p>
              <ol>
                <li> Nutzerliste exportieren </li>
                <li> Betroffene Zeile ändern </li>
                <li>
                  Geänderte Liste (am besten bestehend
                  aus nur die geänderte Zeilen) importieren
                </li>
              </ol>
              <Export type="user" />
              <Import
                type="user"
                token={this.props.token}
                onChange={info => this.onChangeUsers(info)}
                beforeUpload={() => this.setState({ loading: true })}
              />
            </Fragment>
          )}
          <Divider>Kennwort ändern</Divider>
          <p>
            Geben Sie hier Ihr neues Kennwort ein und drücken Sie auf Speichern
            um Ihr Kennwort zu ändern.
          </p>
          <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
            <PasswordInput
              form={form}
              required={false}
            />
            <Row style={{ marginTop: '15px' }}>
              <Col style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
                  Speichern
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </ContainerBg>
    );
  }
}

const WrappedSettings = Form.create({ name: 'settings' })(Settings);

export default WrappedSettings;
