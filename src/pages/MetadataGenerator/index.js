import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import { get, getById } from '~/services/locationApi';
import {
  Col, Tabs, Card, Input, Select, Divider, Form, Button, notification
} from 'antd';

const { Meta } = Card;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Item } = Form;

const FullHeightTabs = styled(Tabs)`
  height: 100%;

  .ant-tabs-content {
    height: 100%;
  }
`;

const FullHeightCol = styled(Col)`
  height: 100%;
`;

const StyledContainer = styled(Container)`
  margin: 50px auto;
  background: white;
`;

const GreyTabPane = styled(TabPane)`
  background: #f0f2f5;
  height: 100%;
`;

const StyledCard = styled(Card)`
  margin: 20px !important;
`;

const RowItem = styled(Item)`
  display: flex !important;
  justify-content: center;
`;

const MarginedButton = styled(Button)`
  margin: 10px;
`;

const jsonld = (item) => {
  const res = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    '@id': item._id,
    name: item.name,
    description: item.description,
    url: item.website,
    sameAs: item.website,
    email: item.email,
    telephone: item.telephone
  };

  return JSON.stringify(res, null, 2);
};

class MetadataGenerator extends PureComponent {
  state = {
    locations: [],
    location: {}
  }

  async componentWillMount() {
    const { data: locations } = await get({ limit: 0, fields: ['_id', 'name'] });
    this.setState({ locations });
  }

  async selectLocation(evt) {
    if (!evt) return this.setState({ location: {} });
    const found = this.state.locations.find(loc => loc._id === evt.key);
    const location = await getById(found._id);
    this.setState({ location });
  }

  render() {
    return (
      <StyledContainer>
        <Col span={12}>
          <HeaderArea>
            <h1>Metadata Generator</h1>
          </HeaderArea>
          <p>
            Lorem ipsum dolor. Sit amet morbi nunc posuere mus.
            Ut vestibulum nesciunt ipsum etiam porta maecenas eget nonummy eget diam torquent.
            Augue in tellus quam odio pellentesque.
          </p>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Standort auswählen"
            onChange={(label, evt) => this.selectLocation(evt)}
            notFoundContent=""
            allowClear
          >
            {
              this.state.locations
                .map(location => (
                  <Option key={location._id} value={location.name}>
                    {location.name}
                  </Option>
                ))
            }
          </Select>
          <Divider />
          <Form>
            <RowItem label="Name">
              <Input placeholder="Name eingeben" value={this.state.location.name} />
            </RowItem>
            <RowItem label="Typ">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Typ auswählen"
                value={this.state.location.types}
                mode="multiple"
              >
                {config.types.map(type => (<Option key={type} value={type}>{type}</Option>))}
              </Select>
            </RowItem>
            <RowItem label="Beschreibung">
              <TextArea placeholder="Beschreibung eingeben" value={this.state.location.description} />
            </RowItem>
            <RowItem label="Addresse">
              <Input placeholder="Beschreibung eingeben" value={this.state.location.address} />
            </RowItem>
            <RowItem label="Telefonnummer">
              <Input  placeholder="Telefonnummer eingeben"  value={this.state.location.telephone} />
            </RowItem>
            <RowItem label="Webseite">
              <Input placeholder="Webseite eingeben" value={this.state.location.website} />
            </RowItem>
          </Form>
        </Col>
        <FullHeightCol span={12}>
          <FullHeightTabs defaultActiveKey="1">
            <GreyTabPane tab="Vorschau" key="1">
              <FullHeightCol span={12} offset={6}>
                <StyledCard
                  hoverable
                  cover={this.state.location.logo && (<img alt="logo" src={this.state.location.logo.url} />)}
                >
                  {this.state.location.tags
                    && this.state.location.tags.map(tag => <p>{tag.name}</p>)}
                  <Meta
                    title={this.state.location.name}
                    description={this.state.location.address}
                  />
                  <p>{this.state.location.description}</p>
                  <Divider />
                  <p>Website: {this.state.location.website}</p>
                  <p>Telefonnummer: {this.state.location.telephone}</p>
                  <p>Öffnungszeiten: {this.state.location.openingHours}</p>
                </StyledCard>
              </FullHeightCol>
            </GreyTabPane>
            <GreyTabPane tab="Metadaten" key="2">
              <TextArea value={jsonld(this.state.location)} rows={20} readOnly />
              <CopyToClipboard
                text={jsonld(this.state.location)}
                onCopy={() => notification.success({ message: 'In der Zwischenablage Kopiert.' })}
              >
                <MarginedButton type="primary" icon="copy">
                  Kopieren
                </MarginedButton>
              </CopyToClipboard>
            </GreyTabPane>
          </FullHeightTabs>
        </FullHeightCol>
      </StyledContainer>
    );
  }
}

export default MetadataGenerator;
