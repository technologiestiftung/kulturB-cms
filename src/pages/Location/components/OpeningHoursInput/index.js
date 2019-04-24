import React, { PureComponent, Fragment } from 'react';
import { SimpleOpeningHours } from 'simple-opening-hours';
import { Button } from 'antd';
import OpeningHoursPreview from '~/components/OpeningHoursPreview';
import OpeningHoursTimePicker from './components/TimePicker';


class OpeningHoursInput extends PureComponent {
  state = {
    isPreviewOpen: false,
    isPickerOpen: false,
    openingHours: ''
  }

  togglePreview() {
    this.setState(({ isPreviewOpen }) => ({ isPreviewOpen: !isPreviewOpen }));
  }

  togglePicker() {
    this.setState(({ isPickerOpen }) => ({ isPickerOpen: !isPickerOpen }));
  }

  onChangeOpeningHours(openingHours) {
    this.setState({ openingHours });
  }

  render() {
    const { isPreviewOpen, isPickerOpen, openingHours } = this.state;
    const openingHoursValues = this.props.children.props.value || openingHours;
    const openingHoursTable = new SimpleOpeningHours(openingHoursValues).getTable();

    const children = React.Children
      .map(this.props.children, child => React.cloneElement(child, { item: { openingHours } }));

    return (
      <Fragment>
        {children}
        <Button onClick={() => this.togglePicker()}>
          Hilfe
        </Button>
        <OpeningHoursTimePicker
          visible={isPickerOpen}
          onChangeOpeningHours={res => this.onChangeOpeningHours(res)}
          onClose={() => this.togglePicker()}
        />
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
