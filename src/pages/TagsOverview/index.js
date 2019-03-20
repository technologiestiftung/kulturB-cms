import React, { PureComponent } from 'react';

import {
  createTag, updateTag, getTags, deleteTag
} from '~/services/tagsApi';
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

    const { data, count } = await getTags(0, 'createdAt', 'descend');

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
      name: '',
      unsynced: true
    };
    this.setState({
      data: [newData, ...data],
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
    const hasUnsyncedData = data.find(d => d.unsynced);

    return (
      <Container>
        <HeaderArea>
          <h1>Kategorien Übersicht</h1>
          <StyledButton
            disabled={hasUnsyncedData}
            onClick={this.handleAdd}
            type="primary"
            icon="plus"
          >
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
