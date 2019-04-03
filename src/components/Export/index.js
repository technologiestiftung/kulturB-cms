import React, { PureComponent } from 'react';
import StyledButton from '~/components/Button';

class Export extends PureComponent {
  render() {
    const apiUrl = `${config.url.base}${config.url.locations.base}`;

    return (
      <StyledButton
        icon="export"
        href={`${apiUrl}${config.url.locations.export}`}
      >
        Exportieren
      </StyledButton>
    );
  }
}

export default Export;
