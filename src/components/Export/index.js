import React, { PureComponent } from 'react';
import StyledButton from '~/components/Button';
import users from '~/services/userApi';

class Export extends PureComponent {
  render() {
    const { type } = this.props;

    const apiUrl = `${config.url.base}${config.url[type].base}`;

    if (type === 'user') {
      return (
        <StyledButton
          icon="export"
          onClick={() => users.exportUsers()}
        >
          Exportieren
        </StyledButton>
      );
    }

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
