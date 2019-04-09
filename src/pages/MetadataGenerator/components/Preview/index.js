import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { Card, Divider, Icon } from 'antd';
import { SimpleOpeningHours } from 'simple-opening-hours';
import OpeningHoursPreview from '~/components/OpeningHoursPreview';

const { Meta } = Card;

const StyledCard = styled(Card)`
  &&& {
    max-width: 75%;
    margin: 20px auto;
  }

  .ant-card-cover {
    background: #ddd;

    img {
      max-width: 70%;
      margin: 0 auto;
    }
  }
`;

class MetadataPreview extends PureComponent {
  state = {
    openingHoursPreview: false,
  }

  toggleOpeningHoursPreview() {
    this.setState(({ openingHoursPreview }) => ({ openingHoursPreview: !openingHoursPreview }));
  }

  renderOpeningHours() {
    const openingHours = new SimpleOpeningHours(this.props.openingHours);

    let label = (<span style={{ color: 'red' }}>Nein</span>);
    if (openingHours.isOpenNow()) {
      label = (<span>Ja</span>);
    }

    return (
      <Fragment>
        <div
          onClick={() => this.toggleOpeningHoursPreview()}
          onKeyPress={() => this.toggleOpeningHoursPreview()}
          role="button"
          tabIndex={-1}
        >
          Geöffnet: {label}
          <Icon type={this.state.openingHoursPreview ? 'up' : 'down'} />
        </div>
        {this.state.openingHoursPreview
          && <OpeningHoursPreview openingHours={openingHours.getTable()} />
        }
      </Fragment>
    );
  }

  render() {
    return (
      <StyledCard
        hoverable
        cover={this.props.logo && this.props.logo.url && (<img alt="logo" src={this.props.logo.url} />)}
      >
        {this.props.tags
          && this.props.tags.map(tag => <p key={tag._id}>{tag.name}</p>)}
        <Meta
          title={this.props.name}
          description={[this.props.address, this.props.zipcode, this.props.city].join(' ')}
        />
        {this.props.description && <p>{this.props.description}</p>}
        <Divider />
        {this.props.website
            && <div>Website: <a href={this.props.website}>{this.props.website}</a></div>
        }
        {this.props.telephone && <div>Telefonnummer: {this.props.telephone}</div>}
        {this.props.openingHours && this.renderOpeningHours(this.props.openingHours)}
      </StyledCard>
    );
  }
}

export default MetadataPreview;
