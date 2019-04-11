import React, { PureComponent } from 'react';

class openingHoursPreview extends PureComponent {
  render() {
    const closedLabel = 'geschlossen';
    const { openingHours } = this.props;

    Object.keys(openingHours).forEach((day) => {
      if (openingHours[day].length === 0) {
        openingHours[day] = closedLabel;
      }
    });

    return (
      <table>
        <tbody>
          <tr>
            <td>Montag</td>
            <td>{openingHours.mo || closedLabel}</td>
          </tr>
          <tr>
            <td>Dienstag</td>
            <td>{openingHours.tu || closedLabel}</td>
          </tr>
          <tr>
            <td>Mittwoch</td>
            <td>{openingHours.we || closedLabel}</td>
          </tr>
          <tr>
            <td>Donnerstag</td>
            <td>{openingHours.th || closedLabel}</td>
          </tr>
          <tr>
            <td>Freitag</td>
            <td>{openingHours.fr || closedLabel}</td>
          </tr>
          <tr>
            <td>Samstag</td>
            <td>{openingHours.sa || closedLabel}</td>
          </tr>
          <tr>
            <td>Sonntag</td>
            <td>{openingHours.su || closedLabel}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default openingHoursPreview;
