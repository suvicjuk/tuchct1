import URLSearchParams from 'url-search-params';
import React from 'react';
import { withRouter } from "react-router-dom";
import {ButtonGroup, Button, Form, InputGroup} from 'react-bootstrap';

class IssueFilter extends React.Component {

  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
     status: params.get('status') ||'',
     effortMin: params.get('effortMin') || '',
     effortMax: params.get('effortMax') || '',
     changed: false,
    };
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
  }

  applyFilter() {
    const { status ,effortMin, effortMax} = this.state;
    const { history , urlBase} = this.props;
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);
    const search = params.toString() ? `?${params.toString()}` :'';
    history.push({ pathname: urlBase, search });
    }

    componentDidUpdate(prevProps) {
      const { location: { search: prevSearch } } = prevProps;
      const { location: { search } } = this.props;
      if (prevSearch !== search) {
      this.showOriginalFilter();
      }
      }

      showOriginalFilter() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        this.setState({
        status: params.get('status') || '',changed: false,effortMin: params.get('effortMin') ||'',
        effortMax: params.get('effortMax') || '',
        });
      }

      onChangeEffortMin(e) {
        const effortString = e.target.value;
        if (effortString.match(/^\d*$/)) {
        this.setState({ effortMin: e.target.value, changed: true });
        }
        }

        onChangeEffortMax(e) {
          const effortString = e.target.value;
          if (effortString.match(/^\d*$/)) {
          this.setState({ effortMax: e.target.value, changed: true });
          }
          }

  onChangeStatus(e) {
    this.setState({ status: e.target.value ,changed: true});
  }

  render() {
     const { status, changed} = this.state;
     const { effortMin, effortMax } = this.state;
    return (
      <div>
      <div class="container">
      <div class="row">
      <div class="col-6 col-sm-4  col-md-3 col-lg-2">
      <Form.Group className="mb-3">
        <Form.Label>Status:</Form.Label>
        <Form.Select aria-label="Default select example" value={status} onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </Form.Select>
      </Form.Group>
      </div>
      <div class="col-6 col-sm-4  col-md-3 col-lg-2">
      <Form.Group className="mb-3" >
         <Form.Label>Effort between:</Form.Label>
         <InputGroup className="mb-3">
            <Form.Control value={effortMin} onChange={this.onChangeEffortMin} />
            <InputGroup.Text id="basic-addon1">-</InputGroup.Text>
            <Form.Control value={effortMax} onChange={this.onChangeEffortMax} />
         </InputGroup>
      </Form.Group>
      </div>
      <div class="col-6 col-sm-4  col-md-3 col-lg-2">
      <Form.Group className="mb-3" >
      <Form.Label>&nbsp;</Form.Label>
      <ButtonGroup aria-label="Basic example">
          <Button bsStyle="primary" type="button" onClick={this.applyFilter}>Apply</Button>
          <Button type="button" onClick={this.showOriginalFilter} disabled={!changed}>Reset</Button>
      </ButtonGroup>
      </Form.Group>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withRouter(IssueFilter);
