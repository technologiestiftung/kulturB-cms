import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

const StyledContainer = styled(Content)`
  padding: 25px 0;
  flex-grow: 1;
`;

export const ContainerBg = styled(StyledContainer)`
  background: white;
  margin: 40px auto;
  padding: 25px 20px;
`;

export default StyledContainer;
