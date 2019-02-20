import styledNormalize from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  ${styledNormalize}

  * {
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
    position: relative;
  }

  html {
    overflow-y: scroll;
  }

  #app {
    display: flex;
  }

  .ant-layout {
    flex-grow: 1;
  }

  html,
  body,
  #app {
    min-height: 100%;
  }
`;
