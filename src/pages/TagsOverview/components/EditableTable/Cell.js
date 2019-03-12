import React, { PureComponent } from 'react';
import {
  Form, Input, Row, Col, Button
} from 'antd';
import { Consumer } from './Context';

const FormItem = Form.Item;

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

    console.log(this.props);

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <Consumer>
            {(form) => {
              this.form = form;
              return (
                editing || record.unsynced ? (
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
                        autoFocus
                      />
                    )}
                  </FormItem>
                ) : (
                  <Row
                    type="flex"
                    justify="space-between"
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                  >
                    <Col>
                      {restProps.children}
                    </Col>
                    <Col>
                      <Button
                        size="small"
                        icon="edit"
                        content="Edit"
                        onClick={this.toggleEdit}
                      />
                    </Col>
                  </Row>
                )
              );
            }}
          </Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

export default EditableCell;
