import React, { PureComponent, Fragment } from 'react';
import {
  Button
} from 'antd';
import { SimpleOpeningHours } from 'simple-opening-hours';

const renderTable = openingHoursTable => (
  <table>
    <tr>
      <td>Montag</td>
      <td>{openingHoursTable.mo}</td>
    </tr>
    <tr>
      <td>Dienstag</td>
      <td>{openingHoursTable.tu}</td>
    </tr>
    <tr>
      <td>Mittwoch</td>
      <td>{openingHoursTable.we}</td>
    </tr>
    <tr>
      <td>Donnestag</td>
      <td>{openingHoursTable.th}</td>
    </tr>
    <tr>
      <td>Freitag</td>
      <td>{openingHoursTable.fr}</td>
    </tr>
    <tr>
      <td>Samstag</td>
      <td>{openingHoursTable.sa}</td>
    </tr>
    <tr>
      <td>Sonntag</td>
      <td>{openingHoursTable.su}</td>
    </tr>
  </table>
);

class OpeningHoursInput extends PureComponent {
  state = {
    isPreviewOpen: false
  }

  togglePreview() {
    this.setState(prevState => ({ isPreviewOpen: !prevState.isPreviewOpen }));
  }

  render() {
    const openingHours = this.props.children.props.value || '';
    const { isPreviewOpen } = this.state;

    return (
      <Fragment>
        {this.props.children}
        <p>
          <a rel="noopener noreferrer" target="_blank" href={`http://projets.pavie.info/yohours/?oh=${openingHours}`}>Dieses Tool</a> kann dabei helfen, die Öffnungszeiten zu formattieren
        </p>
        {isPreviewOpen && renderTable(new SimpleOpeningHours(openingHours).getTable())}
        <Button onClick={() => this.togglePreview()}>
          <span>
            Vorschau {isPreviewOpen ? 'ausblenden' : 'anzeigen'}
          </span>
        </Button>
      </Fragment>
    );
  }
}

export default OpeningHoursInput;
