import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'unistore/react';
import 'semantic-ui-css/semantic.min.css';

import Store from '~/state/Store';
import App from '~/App';
import GlobalStyles from '~/styles/Global';

const root = document.createElement('div');

ReactDOM.render(
  <Provider store={Store}>
    <Fragment>
      <GlobalStyles />
      <App />
    </Fragment>
  </Provider>,
  root
);

document.body.appendChild(root);
