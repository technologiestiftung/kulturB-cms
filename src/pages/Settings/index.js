import React, { PureComponent } from 'react';
import { Spin, Divider, message } from 'antd';

import { ContainerBg } from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import Import from '~/components/Import';
import Export from '~/components/Export';

class Settings extends PureComponent {
  state = {
    loading: false
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} erfolgreich hochgeladen.`);
      this.setState({ loading: false });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload fehlgeschlagen.`);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <ContainerBg>
        <HeaderArea>
          <h1>Einstellungen</h1>
        </HeaderArea>
        <Spin spinning={this.state.loading}>
          <div>
            <Divider>Exportieren</Divider>
            <p>
              Lorem ipsum dolor. Sit amet morbi nunc posuere mus.
              Ut vestibulum nesciunt ipsum etiam porta maecenas eget nonummy eget diam torquent.
              Augue in tellus quam odio pellentesque. Lectus orci sed.
              In sodales per cursus ut curabitur condimentum aenean eget.
              Nascetur id neque. Erat arcu habitant mattis tempor dapibus omnis vel et.
              Duis imperdiet erat. Suscipit quisque natoque amet elementum ipsum.
            </p>
            <Export />
          </div>
          <div>
            <Divider>Importieren</Divider>
            <p>
              Lorem ipsum dolor. Sit amet morbi nunc posuere mus.
              Ut vestibulum nesciunt ipsum etiam porta maecenas eget nonummy eget diam torquent.
              Augue in tellus quam odio pellentesque.
            </p>
            <Import
              token={this.props.token}
              onChange={info => this.onChange(info)}
              beforeUpload={() => this.setState({ loading: true })}
            />
          </div>
        </Spin>
      </ContainerBg>
    );
  }
}

export default Settings;
