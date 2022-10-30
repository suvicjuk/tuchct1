import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath  } from 'react-router-dom';
import "babel-polyfill"; 
import Page from '../public/menulink.jsx';
import template from './template.js';
import About from '../public/About.jsx';
import store from '../public/store.js';
import SSRProvider from 'react-bootstrap/SSRProvider';
import routes from '../public/routes.js';

async function render(req, res) {
  
  const activeRoute = routes.find(
    route => matchPath(req.path, route),
  );
  let initialData;
  if (activeRoute && activeRoute.component.fetchData) {
    const match = matchPath(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    initialData = await activeRoute.component.fetchData(match, search);
  }
  store.initialData = initialData;
  const context = {};

  const element = (
    <StaticRouter location={req.url} context={context}>
     <SSRProvider>
          <Page />
      </SSRProvider>
    </StaticRouter>
  );
   // context.url will contain the URL to redirect to if a <Redirect> was used
  const body = ReactDOMServer.renderToString(element);

  if (context.url) {
    res.redirect(301, context.url);
    } else {
    res.send(template(body, initialData));
    }
    
    // </SSRProvider>
}

export default render;
