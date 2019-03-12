import React, { PureComponent } from 'react';
import {
  Table, Button, Popconfirm
} from 'antd';

import EditableCell from './Cell';
import EditableFormRow from './Row';

class EditableTable extends PureComponent {
  constructor(props) {
    super(props);

    this.apiUrl = `${config.url.base}${config.url.tags}`;

    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      editable: true
    }, {
      dataIndex: 'delete',
      width: '5%',
      render: (text, record) => (
        this.props.data.length >= 1
          ? (
            <Popconfirm title="Sind Sie sicher, dass sie den Eintrag löschen wollen ?" onConfirm={() => this.props.handleDelete(record._id)}>
              <Button
                type="danger"
                size="small"
                icon="delete"
                content="Delete"
              />
            </Popconfirm>
          ) : null
      )
    }];
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.props.handleSave
        })
      };
    });
    return (
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        columns={columns}
        dataSource={this.props.data}
        loading={this.props.loading}
        pagination={false}
      />
    );
  }
}

export default EditableTable;
