import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Card, Divider, Icon, Row, Col
} from 'antd';
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

const renderRow = (label, value) => (
  <Row>
    <Col span={12}>
      {label}
    </Col>
    <Col>
      {value}
    </Col>
  </Row>
);

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
      <Row>
        <div
          onClick={() => this.toggleOpeningHoursPreview()}
          onKeyPress={() => this.toggleOpeningHoursPreview()}
          role="button"
          tabIndex={-1}
        >
          {renderRow('Geöffnet:', <div>{ label } <Icon type={this.state.openingHoursPreview ? 'up' : 'down'} /></div>)}
        </div>
        <Col span={12} style={{ float: 'right' }}>
          {this.state.openingHoursPreview
            && <OpeningHoursPreview openingHours={openingHours.getTable()} />
          }
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <StyledCard
        hoverable
        cover={this.props.logo && this.props.logo.url && (<img alt="logo" src={this.props.logo.url} />)}
      >
        <Meta
          title={this.props.name}
          description={[this.props.address, this.props.zipcode, this.props.city].join(' ')}
        />
        {this.props.description && <Row style={{ marginTop: 8 }}>{this.props.description}</Row>}
        <Divider />
        {this.props.website && renderRow('Website:', <a href={this.props.website} target="_blank" rel="noopener noreferrer">{this.props.website}</a>)}
        {this.props.telephone && renderRow('Telefonnummer:', this.props.telephone)}
        {this.props.openingHours && this.renderOpeningHours(this.props.openingHours)}
      </StyledCard>
    );
  }
}

export default MetadataPreview;
