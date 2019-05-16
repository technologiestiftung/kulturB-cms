import React, { PureComponent } from 'react';
import { Modal, TimePicker, Button } from 'antd';
import moment from 'moment';

const parseDay = (day) => {
  switch (day) {
    case 'mo':
     return 'Montag';
    case 'tu':
      return 'Dienstag';
    case 'we':
      return 'Mittwoch';
    case 'th':
      return 'Donnestag';
    case 'fr':
      return 'Freitag';
    case 'sa':
      return 'Samstag';
    case 'su':
      return 'Sonntag';
    case 'ph':
      return 'Feiertage';
    default:
      return '';
  }
};

const initialState = {
  isModalOpen: false,
  openingHours: {
    mo: '',
    tu: '',
    we: '',
    th: '',
    fr: '',
    sa: '',
    su: '',
    ph: '',
  }
};

class OpeningHoursModal extends PureComponent {
  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        isModalOpen: true
      });
    }
  }

  closeModal() {
    this.props.onClose();
    this.setState({
      isModalOpen: false
    });
  }

  onChange(day, isOpening, time, timeString) {
    this.setState(({ openingHours }) => ({
      openingHours: {
        ...openingHours,
        [day]: isOpening ? timeString.concat('-') : openingHours[day].concat(timeString),
      }
    }));
  }

  onOk() {
    const { openingHours } = this.state;
    const res = Object.keys(openingHours)
      .filter(day => openingHours[day] !== '')
      .map(day => `${day} ${openingHours[day]}`)
      .join(';');
    this.props.onChangeOpeningHours(res);
    this.closeModal();
    this.setState(initialState);
  }

  renderTimePicker(day, isOpening, defaultOpenValue) {
    return (
      <TimePicker
        onChange={(time, timeString) => this.onChange(day, isOpening, time, timeString)}
        defaultOpenValue={moment(defaultOpenValue, 'HH:mm')}
        placeholder="geschlossen"
        format="HH:mm"
      />
    );
  }

  checkDaily() {
    this.setState(({ openingHours }) => ({
      openingHours: Object.keys(openingHours)
        .map(day => ({ [day]: openingHours.mo }))
        .reduce((prev, curr) => ({ ...prev, ...curr }))
    }), () => this.onOk());
  }

  render() {
    const { isModalOpen, openingHours } = this.state;

    return (
      <Modal
        visible={isModalOpen}
        onCancel={() => this.closeModal()}
        onOk={() => this.onOk()}
        destroyOnClose
      >
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Öffnet:</th>
              <th>Schließt:</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(openingHours)
              .map(day => (
                <tr key={day}>
                  <td>
                    { parseDay(day) }
                  </td>
                  <td>
                    {this.renderTimePicker(day, true, '08:00')}
                  </td>
                  <td>
                    {this.renderTimePicker(day, false, '18:00')}
                  </td>
                  { day === 'mo' && (
                    <tr>
                      <Button onClick={() => this.checkDaily()}>
                        Für alle übernehmen
                      </Button>
                    </tr>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
      </Modal>
    );
  }
}

export default OpeningHoursModal;
