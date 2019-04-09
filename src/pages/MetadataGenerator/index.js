import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Col, Tabs, Divider, Spin
} from 'antd';

import { ContainerBg } from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import MetadataForm from './components/MetadataForm';
import MetadataPreview from './components/Preview';
import MetadataCode from './components/Code';
import LocationSelect from './components/LocationSelect';
import { get, getById } from '~/services/locationApi';
import history from '~/history';


const { TabPane } = Tabs;

const FullHeightTabs = styled(Tabs)`
  height: 100%;

  .ant-tabs-content {
    height: 100%;
  }
`;

const FullHeightCol = styled(Col)`
  height: 100%;
`;

const GreyTabPane = styled(TabPane)`
  background: #f0f2f5;
  height: 100%;
`;

class MetadataGenerator extends PureComponent {
  state = {
    locations: [],
    location: {},
    locationName: '',
    loading: false
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.selectLocation({ value: id });
    }
  }

  async componentWillMount() {
    const { data: locations } = await get({ limit: 0, fields: ['_id', 'name'] });
    this.setState({ locations });
  }

  async selectLocation(selectedLocation) {
    this.setState({ loading: true });
    if (!selectedLocation) return this.setState({ location: {} });
    const location = await getById(selectedLocation.value);
    location.tags = location.tags.map(tag => tag.name);
    this.setState({ location, locationName: location.name, loading: false });
    history.replace(`/metadaten/${location._id}`);
  }

  onValuesChange(changedValues, allValues) {
    this.setState({ location: allValues });
  }

  render() {
    return (
      <ContainerBg>
        <Spin spinning={this.state.loading}>
          <Col span={12}>
            <HeaderArea>
              <h1>Metadata Generator</h1>
            </HeaderArea>
            <p>
              Lorem ipsum dolor. Sit amet morbi nunc posuere mus.
              Ut vestibulum nesciunt ipsum etiam porta maecenas eget nonummy eget diam torquent.
              Augue in tellus quam odio pellentesque.
            </p>
            <LocationSelect
              location={this.state.location}
              locationName={this.state.locationName}
              locations={this.state.locations}
              selectLocation={selectedLocation => this.selectLocation(selectedLocation)}
            />
            <Divider />
            <MetadataForm
              location={this.state.location}
              onValuesChange={
                (changedValues, allValues) => this.onValuesChange(changedValues, allValues)
              }
            />
          </Col>
          <FullHeightCol span={12}>
            <FullHeightTabs defaultActiveKey="1">
              <GreyTabPane tab="Vorschau" key="1">
                <MetadataPreview {...this.state.location} />
              </GreyTabPane>
              <GreyTabPane tab="Metadaten" key="2">
                <MetadataCode location={this.state.location} />
              </GreyTabPane>
            </FullHeightTabs>
          </FullHeightCol>
        </Spin>
      </ContainerBg>
    );
  }
}

export default MetadataGenerator;
