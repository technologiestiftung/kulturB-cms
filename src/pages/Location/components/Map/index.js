import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { icon } from 'leaflet';
import { Row, Col } from 'antd';
import {
  Map, Marker, CircleMarker, Tooltip, TileLayer
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import iconUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { get } from '~/services/locationApi';


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
  margin-bottom: 5px;
`;

const FlexCol = styled(Col)`
  &&& {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

class LocationMap extends PureComponent {
  state = {
    locations: []
  }

  componentDidMount() {
    this.fetchLocations();
  }

  async fetchLocations() {
    const { data: locations } = await get({ limit: 0, fields: ['_id', 'name', 'location'] });
    this.setState(() => ({
      locations
    }));
  }

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
            Verschieben Sie den Marker, um die Koordinaten zu korrigieren.
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
            {this.state.locations.map(entry => entry.location
            && entry.location.coordinates
            && (entry._id !== this.props._id)
            && (
              <CircleMarker
                center={entry.location.coordinates}
                radius={5}
                icon={MarkerIcon}
              >
                <Tooltip direction="top">
                  {entry.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </Map>
        </FlexCol>
      </MapWrapper>
    );
  }
}

export default LocationMap;
