import React from 'react';
import ReactDOM from 'react-dom';
import {listen, createTab} from 'core';
import App from './views';

import './assets/app.html';
import './assets/app.css';

listen((state) => {
  ReactDOM.render(
    <App state={state}/>,
    document.getElementById('app'),
  )
});
