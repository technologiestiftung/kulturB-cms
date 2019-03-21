import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { icon } from 'leaflet';
import { Row, Col } from 'antd';
import {
  Map, Marker, TileLayer
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import iconUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const MarkerIcon = icon({
  iconUrl,
  shadowUrl,
  iconAnchor: [12.5, 41],
  iconSize: [25, 41]
});

const MapWrapper = styled(Row)`
  &&& {
    height: 250px;
  }

  .leaflet-container {
    flex-grow: 1;
  }
`;

const Hint = styled.div`
  text-align: center;
`;

const FlexCol = styled(Col)`
  &&& {
    display: flex;
    flex-direction: column;
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
        <FlexCol span={16}>
          <Hint>
            Verschieben Sie den Marker, um die Koordinaten zu berichtigen.
          </Hint>
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
              icon={MarkerIcon}
            />
          </Map>
        </FlexCol>
      </MapWrapper>
    );
  }
}

export default LocationMap;
