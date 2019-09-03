
import React from 'react';
import { Row, Col } from 'antd';

import Button from '~/components/Button';

export default ({
  label, isCreateMode, item, onSubmit, onOpenModal, formItemLayout, token
}) => (
  <Row style={{ marginTop: '15px' }}>
    <Col {...formItemLayout.colLayout} style={{ textAlign: 'right' }}>
      {!isCreateMode && (
        <Button
          htmlType="submit"
          onClick={evt => onSubmit(evt, `/metadaten/${item.id}`)}
        >
          Zum Metadaten Generator
        </Button>
      )}
      <Button type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
        {token ? `${label} speichern` : 'Änderungsvorschlag einreichen' }
      </Button>
      {!isCreateMode && token && (
        <Button
          type="danger"
          icon="delete"
          onClick={evt => onOpenModal(evt)}
          style={{ marginLeft: '5px' }}
        >
          <span>{label} löschen</span>
        </Button>
      )}
    </Col>
  </Row>
);
