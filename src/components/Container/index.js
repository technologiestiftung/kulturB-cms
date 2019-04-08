import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

const StyledContainer = styled(Content)`
  padding: 25px 20px;
  max-width: 1300px;
  width: 100%;
  margin:0 auto;
  flex-grow: 1;
`;

export const ContainerBg = styled(StyledContainer)`
  background: white;
  margin: 40px auto;
`;

export default StyledContainer;
