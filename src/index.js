import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Store from '~/store';
import App from '~/App';
import GlobalStyles from '~/styles/Global';

const root = document.createElement('div');
root.id = 'app';

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
