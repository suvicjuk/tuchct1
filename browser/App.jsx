 
//import _ from 'lodash';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
//import PropTypes from 'prop-types';
import {  BrowserRouter as Router  } from 'react-router-dom';
import Menulink from '../public/menulink.jsx';
import store from '../public/store.js';

// eslint-disable-next-line no-underscore-dangle
store.initialData = window.__INITIAL_DATA__;

const element = (
   <Router>
      <Menulink/>
   </Router>
 );


ReactDOM.hydrate(element,document.getElementById('contents'));

if (module.hot) {
   module.hot.accept();
 }