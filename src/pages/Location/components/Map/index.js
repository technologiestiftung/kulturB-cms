import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import {
  Map, Marker, TileLayer
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const MapWrapper = styled(Row)`
  &&& {
    height: 250px;
  }

  .leaflet-container,
  > div {
    height: 100%;
  }
`;

class LocationMap extends PureComponent {
  updatePosition(evt) {
    const { lat, lng } = evt.target.getLatLng();
    this.props.updatePosition(lat, lng);
  }

  render() {
    if (!this.props.location) {
      return null;
    }

    return (
      <MapWrapper gutter={16}>
        <Col span={16}>
          <Map center={this.props.location.coordinates} zoom={12}>
            <TileLayer
              url="https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}.png?key=IA1qWrAbZAe6JUuSfLgB"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker
              draggable
              onDragend={evt => this.updatePosition(evt)}
              position={this.props.location.coordinates}
              radius={10}
            />
          </Map>
        </Col>
      </MapWrapper>
    );
  }
}

export default LocationMap;
