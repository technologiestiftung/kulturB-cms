import React, { PureComponent, Fragment } from 'react';
import { SimpleOpeningHours } from 'simple-opening-hours';
import { Button } from 'antd';
import OpeningHoursPreview from '~/components/OpeningHoursPreview';


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
    const openingHoursTable = new SimpleOpeningHours(openingHours).getTable();

    return (
      <Fragment>
        {this.props.children}
        <p>
          <a rel="noopener noreferrer" target="_blank" href={`http://projets.pavie.info/yohours/?oh=${openingHours}`}>Dieses Tool</a> kann dabei helfen, die Öffnungszeiten zu formattieren
        </p>
        {isPreviewOpen && <OpeningHoursPreview openingHours={openingHoursTable} />}
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
