import React, { PureComponent } from 'react';
import {
  Form, Button, Row, Col, AutoComplete, List
} from 'antd';

class VenuesInput extends PureComponent {
  render() {
    const { venueList } = this.props;
    const hasVenueList = this.props.venueList && this.props.venueList.length > 0;

    return [
      <Form.Item
        key={this.props.item.name}
        label={this.props.item.label}
        colon=""
        {...this.props.formItemLayout}
      >
        <AutoComplete
          onSearch={search => this.props.onSearchVenue(search)}
          onSelect={(selectedItem, option) => this.props.onSelectItem(selectedItem, option)}
          value={this.props.venuesAutoCompleteValue}
        >
          {this.props.venueAutoCompleteList
            .map(v => (
              <AutoComplete.Option
                disabled={venueList && venueList.find(venue => venue.id === v.id)}
                key={v.id}
              >
                {v.name}
              </AutoComplete.Option>
            ))
          }
        </AutoComplete>
      </Form.Item>,
      hasVenueList && (
        <Row gutter={16} style={{ marginBottom: '15px' }}>
          <Col span={16}>
            <List
              key="venuelist"
              bordered
              dataSource={venueList}
              renderItem={listItem => (
                <List.Item
                  key={listItem.id}
                  actions={[
                    <Button
                      icon="delete"
                      onClick={() => this.props.onDeleteItem(listItem.id)}
                    />
                  ]}
                >
                  {listItem.name}
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )
    ];
  }
}

export default VenuesInput;
