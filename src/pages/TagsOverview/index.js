import React, { PureComponent } from 'react';

import {
  createTag, updateTag, getTags, deleteTag
} from '~/services/locationApi';
import EditableTable from './components/EditableTable';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import StyledButton from '~/components/Button';

class Tags extends PureComponent {
  state = {
    loading: false,
    data: []
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    this.setState({ loading: true });

    const { data, count } = await getTags();

    this.setState(() => ({
        loading: false,
        count,
        data: data.map((d) => {
          d.key = d._id;
          return d;
        })
      }));
  }

  handleDelete = async (_id) => {
    if (_id) {
      await deleteTag(_id);
    }
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
    if (row._id) {
      await updateTag(row._id, row.name);
    } else {
      await createTag(row.name);
    }

    await this.fetch();
  }

  render() {
    const { data, loading } = this.state;

    return (
      <Container>
        <HeaderArea>
          <h1>Kategorien Übersicht</h1>
          <StyledButton onClick={this.handleAdd} type="primary">
            Neue Kategorie anlegen
          </StyledButton>
        </HeaderArea>
        <EditableTable
          data={data}
          loading={loading}
          handleSave={this.handleSave}
          handleDelete={this.handleDelete}
        />
      </Container>
    );
  }
}

export default Tags;
