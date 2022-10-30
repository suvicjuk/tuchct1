import React from 'react';

export default function Detail({ issue }) {
  if (issue) {
    return (
      <div>
        <h3>Description</h3>
        <pre>{issue.description}</pre>
      </div>
    );
  }
  return null;
}


/*
import graphQLFetch from './graphQL.js';

export default class Detail extends React.Component {
  constructor() {
    super();
    this.state = { issue: {} };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { match: { params: { id } } } = this.props;

    
    const query = `query issue($id: Int!) {
      issue (id: $id) {
        id description
      }
    }`;
    const x={};
    x.id=parseInt(this.props.match.params.id,10);
    const data = await graphQLFetch(query, x);
    if (data) {
      this.setState({ issue: data.issue });
    } else {
      this.setState({ issue: {} });
    }
  }
  render() {
    const { issue: { description } } = this.state;
    return (
      <div>
        <h3>Description</h3>
        <pre>{description}</pre>
      </div>
    );
  }
}
*/