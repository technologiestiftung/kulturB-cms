
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

import Button from '~/components/Button';

export default ({
  label, isCreateMode, item, onSubmit,
  onOpenModal, formItemLayout,
  isAdmin, isOwnOrganisation
}) => (
  <Row style={{ marginTop: '15px' }}>
    <Col {...formItemLayout.colLayout} style={{ textAlign: 'right' }}>
      {!isCreateMode && (isAdmin || isOwnOrganisation) && (
        <Button
          htmlType="submit"
          onClick={evt => onSubmit(evt, `/metadaten/${item.id}`)}
        >
          Zum Metadaten Generator
        </Button>
      )}
      {!isCreateMode && !(isAdmin || isOwnOrganisation) && (
        <Button>
          <Link to={`/metadaten/${item.id}`}>
            Zum Metadaten Generator
          </Link>
        </Button>
      )}
      <Button type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
        {(isAdmin || isOwnOrganisation) ? `${label} speichern` : 'Korrektur einreichen' }
      </Button>
      {!isCreateMode && isAdmin && (
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
