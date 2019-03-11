import React, { PureComponent } from 'react';
import {
  Form, Table, Input, Button, Popconfirm
} from 'antd';
import styled from 'styled-components';

import { getTags, deleteTag } from '~/services/locationApi';
import Container from '~/components/Container';
import { createTag } from '../../services/locationApi';

const StyledButton = styled(Button)`
&&& {
  margin-left: auto;
}
`;

const HeaderArea = styled.div`
display: flex;
align-items: center;

h1 {
  line-height: 1;
}
`;

const FormItem = Form.Item;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends PureComponent {
  state = {
    editing: false
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`
                      }],
                      initialValue: record[dataIndex]
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

/* eslint react/no-multi-comp: 0 */
class EditableTable extends PureComponent {
  constructor(props) {
    super(props);

    this.apiUrl = `${config.url.base}${config.url.tags}`;

    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      editable: true
    }, {
      dataIndex: 'operation',
      width: '5%',
      render: (text, record) => (
        this.state.data.length >= 1
          ? (
            <Popconfirm title="Sind Sie sicher, dass sie den Eintrag löschen wollen ?" onConfirm={() => this.handleDelete(record._id)}>
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

  state = {
    loading: false,
    data: []
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    this.setState({ loading: true });

    const data = await getTags();

    this.setState(() => ({
        loading: false,
        data: data.map((d) => {
          d.key = d._id;
          return d;
        })
      }));
  }

  handleDelete = async (_id) => {
    await deleteTag(_id);
    await this.fetch();
  }

  handleAdd = () => {
    const { count, data } = this.state;
    const newData = {
      key: count,
      name: 'Neu'
    };
    this.setState({
      data: [...data, newData],
      count: count + 1
    });
  }

  handleSave = async (row) => {
    await createTag(row.name);

    await this.fetch();
  }

  render() {
    const { data } = this.state;
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
          handleSave: this.handleSave
        })
      };
    });
    return (
      <Container>
        <HeaderArea>
          <h1>Standorte Übersicht</h1>
          <StyledButton onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Neue Kategorie anlegen
          </StyledButton>
        </HeaderArea>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data}
          columns={columns}
          loading={this.state.loading}
          pagination={false}
        />
      </Container>
    );
  }
}

export default EditableTable;
