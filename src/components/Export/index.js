import React, { PureComponent } from 'react';
import StyledButton from '~/components/Button';

class Export extends PureComponent {
  render() {
    const { type } = this.props;

    const apiUrl = `${config.url.base}${config.url[type].base}`;

    return (
      <StyledButton
        icon="export"
        href={`${apiUrl}${config.url[type].export}`}
      >
        Exportieren
      </StyledButton>
    );
  }
}

export default Export;
