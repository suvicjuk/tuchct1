import Show from './show.jsx';
import Report from './IssueReport.jsx';
import Edit from './edit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/issues/:id?', component: Show },
  { path: '/edit/:id', component: Edit },
  { path: '/report', component: Report },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
