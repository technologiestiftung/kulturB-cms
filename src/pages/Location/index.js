import React, { PureComponent } from 'react';
import Container from '~/components/Container';

class Location extends PureComponent {
  render() {
    const { id } = this.props.match.params;
    const { isCreateMode } = this.props;

    return (
      <Container>
        <h1>Standort {isCreateMode ? 'neu anlegen' : id}</h1>
        <p>
          create / edit form
        </p>
      </Container>
    );
  }
}

export default Location;
