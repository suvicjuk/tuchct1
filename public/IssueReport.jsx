import React from 'react';
import { Card, Table } from 'react-bootstrap';

import IssueFilter from './filter.jsx';
import withToast from './withToast.jsx';
import graphQLFetch from './graphQL.js';
import store from './store.js';


const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

//export default function Report() 
class Report extends React.Component {

  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { };
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
    ) {
      issueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ) {
        name New Assigned Fixed Closed
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const stats = store.initialData ? store.initialData.issueCounts : null;
    delete store.initialData;
    this.state = { stats };
  }

  componentDidMount() {
    const { stats } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await Report.fetchData(match, search, showError);
    if (data) {
      this.setState({ stats: data.issueCounts });
    }
  }

  render() {
    
    const { stats } = this.state;
    if (stats == null) return null;

    const headerColumns = (
      statuses.map(status => (
        <th key={status}>{status}</th>
      ))
    );

    const statRows = 
    stats.map(counts => (
      <tr key={counts.name}>
        <td>{counts.name}</td>
          {statuses.map(status => (
            <td key={status}>{counts[status]}</td>
          ))}
      </tr>
    ));
    
    return (
<>
<Card >
      <Card.Header>Filter</Card.Header>
      <Card.Body>
         <IssueFilter urlBase="/report" />
      </Card.Body>
  </Card>


<Table bordered condensed hover responsive>
  <thead>
    <tr>
      <th />
      {headerColumns}
    </tr>
  </thead>
  <tbody>
    {statRows}
  </tbody>
</Table>
</>
    );
  }
}
const IssueReportWithToast = withToast(Report);
IssueReportWithToast.fetchData = Report.fetchData;

export default IssueReportWithToast;

/*
<>       
<Card>
  <Card.Heading>
      Filter
  </Card.Heading>
  <Card.Body >
      <IssueFilter urlBase="/report" />
  </Card.Body>
</Card>
*/



