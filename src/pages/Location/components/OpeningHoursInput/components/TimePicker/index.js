import React, { PureComponent } from 'react';
import { Modal, TimePicker } from 'antd';
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

class OpeningHoursModal extends PureComponent {
  state = {
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
        [day]: isOpening ? timeString.concat('-').concat(openingHours[day]) : openingHours[day].concat(timeString),
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

  render() {
    return (
      <Modal
        visible={this.state.isModalOpen}
        onCancel={() => this.closeModal()}
        onOk={() => this.onOk()}
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
            {Object.keys(this.state.openingHours)
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
