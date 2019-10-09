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
import history from '~/history';


const { TabPane } = Tabs;

const FullHeightTabs = styled(Tabs)`
  height: 100%;

  .ant-tabs-content {
    height: 100%;
  }
`;

const FullHeightCol = styled(Col)`
  top: 32px;
  height: 100%;
`;

const GreyTabPane = styled(TabPane)`
  background: #f0f2f5;
  height: 100%;
`;

const FullHeightSpin = styled(Spin)`
  .ant-spin-nested-loading {
    height: 100%;
    .ant-spin-container {
      height: 100%;
    }
  }
`;

class MetadataGenerator extends PureComponent {
  constructor(props) {
    super(props);
    this.form = React.createRef();
  }

  state = {
    locations: [],
    location: {},
    fullLocation: {},
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
    const { data: locations } = await this.props.actions.get({ limit: 0, fields: ['_id', 'name'] });
    this.setState({ locations });
  }

  async selectLocation(selectedLocation) {
    this.setState({ loading: true });
    if (!selectedLocation) {
      history.push('/metadaten/');
      this.form.current.resetFields();
      const location = this.form.current.getFieldsValue();
      return this.setState({
        location,
        fullLocation: location,
        locationName: '',
        loading: false
      });
    }

    let location = await this.props.actions.getById(selectedLocation.value);
    if (location.meta && location.data) {
      const id = location._id;
      location = location.data;
      location._id = id;
    }

    location.tags = location.tags.map(tag => tag.name);
    this.setState({
      location,
      fullLocation: location,
      locationName: location.name,
      loading: false
    });

    history.replace(`/${this.props.config.name}/${location._id}`);
  }

  onValuesChange(changedValues, location, fullLocation) {
    this.setState({ location, fullLocation });
  }

  render() {
    const {
      loading, location, locationName, locations, fullLocation
    } = this.state;

    return (
      <ContainerBg>
        <FullHeightSpin spinning={loading}>
          <Col span={12}>
            <HeaderArea>
              <h1>Metadaten Generator</h1>
            </HeaderArea>
            {locationName && (
              <LocationSelect
                location={location}
                locationName={locationName}
                locations={locations}
                selectLocation={selectedLocation => this.selectLocation(selectedLocation)}
              />
            )}
            <Divider />
            <MetadataForm
              ref={this.form}
              location={fullLocation || location}
              onValuesChange={
                (changedValues, allValues, fullLoc) => this
                  .onValuesChange(changedValues, allValues, fullLoc)
              }
            />
          </Col>
          <FullHeightCol span={12}>
            <FullHeightTabs defaultActiveKey="1">
              <GreyTabPane tab="Vorschau" key="1">
                <MetadataPreview {...location} />
              </GreyTabPane>
              <GreyTabPane tab="Metadaten" key="2">
                <MetadataCode location={fullLocation || location} />
              </GreyTabPane>
            </FullHeightTabs>
          </FullHeightCol>
        </FullHeightSpin>
      </ContainerBg>
    );
  }
}

export default MetadataGenerator;
