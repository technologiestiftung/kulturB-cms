import styled from 'styled-components';
import { Form } from 'antd';

export default styled(Form.Item).attrs({
  colon: false
})`
  &&& {
    margin-bottom: 12px;
  }
`;
