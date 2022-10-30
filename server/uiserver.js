
//import dotenv from 'dotenv';
//dotenv.config({path: './sample.env'});
//import express from 'express';
//import serveStatic from 'serve-static';
//import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: './sample.env'});
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import proxy from 'http-proxy-middleware';
import render from './render.jsx';

import express from 'express';
const app = express();



const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

if (enableHMR && (process.env.NODE_ENV !== 'production')) {
  console.log('Adding dev middlware, enabling HMR');
  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config.js')[0];
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}










app.use(express.static('src'));
//const express = require('express');
//const app = express();
//app.use(express.static('public'));

//const apiProxyTarget = process.env.API_PROXY_TARGET;
//if (apiProxyTarget) {
// app.use('/graphql', createProxyMiddleware({ target: apiProxyTarget , changeOrigin: true}));
//}

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
  //app.use('/auth', proxy({ target: apiProxyTarget }));
}

if (!process.env.UI_API_ENDPOINT) {
  process.env.UI_API_ENDPOINT = 'http://localhost:7000/graphql';
}

if (!process.env.UI_SERVER_API_ENDPOINT) {
  process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}

//if (!process.env.UI_AUTH_ENDPOINT) {
//  process.env.UI_AUTH_ENDPOINT = 'http://localhost:7000/auth';
//}

app.get('/env.js', function(req, res) {
  const env = { UI_API_ENDPOINT: process.env.UI_API_ENDPOINT, 
                 GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, };
  res.send(`window.ENV = ${JSON.stringify(env)}`)
})

//app.get('/about', render);
//app.get('/about', (req, res, next) => {
app.get('*', (req, res, next) => {
  render(req, res, next);
});


//app.get('*', (req, res) => {
//  res.sendFile(path.resolve('src/index.html'));
// });

const port = process.env.PORT || 2000;
app.listen(port, function () {
 console.log(`UI started on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./render.jsx');
}