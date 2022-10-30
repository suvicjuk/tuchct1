import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import graphQL from './graphQL.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import {Form,ButtonToolbar, Button,Card,Col,Row} from 'react-bootstrap';
import withToast from './withToast.jsx';
import store from './store.js';

//export default function Edit({ match })  {
 class Edit  extends React.Component {
  // const { id } = match.params;
  static async fetchData(match, search,showError) {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id name status effort date description
      }
      }`;    
    //const { params: { id } } = match;
    const x={};
    x.id=parseInt(match.params.id,10);
    const result = await graphQL(query,x,showError);
    return result;
    }


  constructor() {
   super();
   const issue = store.initialData ? store.initialData.issue : null;
   delete store.initialData;

   this.state = {issue: {},invalidFields: {},};
   this.onChange = this.onChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.onValidityChange = this.onValidityChange.bind(this);
   }

   onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
    const invalidFields = { ...prevState.invalidFields, [name]: !valid };
    if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

   componentDidMount() {
      this.loadData();
   }

   componentDidUpdate(prevProps) {
      const { match: { params: { id: prevId } } } = prevProps;
      const { match: { params: { id } } } = this.props;
      if (id !== prevId) {
      this.loadData();
      }
   }

   onChange(event, naturalValue) {
      const { name, value: textValue } = event.target;
      const value = naturalValue == undefined ? textValue : naturalValue;

      this.setState(prevState => ({issue: { ...prevState.issue, [name]: value },}));
   }

   async handleSubmit(e) {
      e.preventDefault();
      const { issue, invalidFields } = this.state;
      if (Object.keys(invalidFields).length !== 0) return;
  
      const effort = parseInt(issue.effort, 10);
      if (!Number.isNaN(effort)) issue.effort = effort;
      else issue.effort = 0;
      const query = `mutation  UpdateList($id: Int! $changes: IssueUpdateInputs!) {
        UpdateList(id: $id changes: $changes) {
          id name status 
          effort  date description
        }
      }`;
  
      const { id, created, ...changes } = issue;
      const { showSuccess, showError } = this.props;
      const data = await graphQL(query, { changes, id });
      if (data) {
        this.setState({ issue: data.UpdateList });
        //alert('Updated issue successfully'); // eslint-disable-line no-alert
        showSuccess('Updated issue successfully');
      }
   }


   async loadData() {

    const { match ,showError  } = this.props;
    const data = await Edit.fetchData(match, null,showError);
    //  const query = `query issue($id: Int!) {
    //  issue(id: $id) {
    //    id name status effort date description
    //  }
    //  }`;
     // const { match: { params: { id } } } = this.props;
    //  const x={};
    //  x.id=parseInt(this.props.match.params.id,10);

   //   const data = await graphQL(query, x);
     // if (data) {
       // const { issue } = data;
       // issue.date = issue.date ? issue.date.toDateString() :'';
       // issue.effort = issue.effort != null ? issue.effort.toString()  :'';
       // issue.description = issue.description != null ? issue.description :'';
       // this.setState({ issue : data.issue   });
      //} else {
      //  this.setState({ issue:   {} });
     // }
     this.setState({ issue: data.issue ? data.issue : {}, invalidFields: {} });
   }

   render() {
    const { issue } = this.state;
    if (issue == null) return null;

   const { issue: { id } } = this.state;
   const { match: { params: { id: propsId } } } = this.props;
   if (id == null) {
     if (propsId != null) {
       return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
     }
     return null;
   }

   const { invalidFields } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting.
        </div>
      );
    }

 const { issue: { name, status } } = this.state;
 const { issue: { effort, description } } = this.state;
 const { issue: { date} } = this.state;
/*
<Card >
     <Card.Header>Edit</Card.Header>
     <Card.Body>
       <Card.Title>{`Editing issue: ${id}`}</Card.Title>
       <Card.Text>Test Edit</Card.Text>  
   <Form horizontal onSubmit={this.handleSubmit}>
   <Form.Group className="mb-3">
   <Form.Label column sm={3}>Created:</Form.Label>
   <Form.Col sm={9}>  
   <Form.Control size="lg" type="text" ref={DateInput} placeholder="Large text"   name="date" value={new Date(date).toDateString()} 
                 onChange={this.onChange}
                 onValidityChange={this.onValidityChange}
                 key={id}  />
   </Form.Col>
   </Form.Group>
   <Form.Group className="mb-3">
   <Form.Label column sm={3}>Status:</Form.Label>
   <Form.Col sm={9}>  
      <Form.Select aria-label="Default select example" name="status" value={status} onChange={this.onChange}>
                 <option value="New">New</option>
                 <option value="Assigned">Assigned</option>
                 <option value="Fixed">Fixed</option>
                 <option value="Closed">Closed</option>
       </Form.Select>
   </Form.Col>
   </Form.Group>
   <Form.Group className="mb-3">
   <Form.Label column sm={3}>Effort:</Form.Label>
   <Form.Col sm={9}> 
   <Form.Control size="lg" type="text" ref={NumInput} placeholder="Large text" value={effort} onChange={this.onChange} key={id} />
    </Form.Col>
   </Form.Group>
   <Form.Group className="mb-3">
   <Form.Label column sm={3}>Title:</Form.Label>
   <Form.Col sm={9}>  
   <Form.Control size="lg" type="text" ref={TextInput} placeholder="Large text"  name="name" value={name} onChange={this.onChange} key={id} />
   </Form.Col>
   </Form.Group>
   <Form.Group className="mb-3">
   <Form.Label column sm={3}>Description:</Form.Label>
   <Form.Col sm={9}>  
      <Form.Control as="textarea" ref={TextInput} rows={8} cols={50} name="description" value={description} onChange={this.onChange} key={id} />
   </Form.Col>
   </Form.Group>
   <Form.Group className="mb-3">
   <Form.Col smOffset={3} sm={6}>  
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to="/show">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
   </Form.Col>
   </Form.Group>
      </Form>

     {validationMessage}
     </Card.Body>
     <Card.Footer className="text-muted">
       <Link to={`/edit/${id - 1}`}>Prev</Link>
       {' | '}
       <Link to={`/edit/${id + 1}`}>Next</Link>
     </Card.Footer>
   </Card>
    */

 return (

   <Card >
     <Card.Header>Edit</Card.Header>
     <Card.Body>
       <Card.Title>{`Editing issue: ${id}`}</Card.Title>
       <Card.Text>Test Edit</Card.Text>  
   <Form horizontal onSubmit={this.handleSubmit}>
   <Form.Group as={Row} className="mb-3">
   <Form.Label column sm={3}>Created:</Form.Label>
   <Col sm={9}>  
   <Form.Control size="lg" type="text"   className={DateInput} placeholder="Large text"   name="date" value={new Date(date).toDateString()} 
                 onChange={this.onChange}
                 onValidityChange={this.onValidityChange}
                 key={id}  />
   </Col>
   </Form.Group>
   <Form.Group as={Row} className="mb-3">
   <Form.Label column sm={3}>Status:</Form.Label>
   <Col sm={9}>  
   <Form.Select aria-label="Default select example" name="status" value={status} onChange={this.onChange}>
                 <option value="New">New</option>
                 <option value="Assigned">Assigned</option>
                 <option value="Fixed">Fixed</option>
                 <option value="Closed">Closed</option>
       </Form.Select>
   </Col>
   </Form.Group>
   <Form.Group as={Row} className="mb-3">
   <Form.Label column sm={3}>Effort:</Form.Label>
   <Col sm={9}> 
   <Form.Control size="lg" type="text"   placeholder="Integer Number" name="effort"  value={effort} onChange={this.onChange} key={id} />
    </Col>
   </Form.Group>
   <Form.Group as={Row} className="mb-3">
   <Form.Label column sm={3}>Title:</Form.Label>
   <Col sm={9}>  
   <Form.Control size="lg" type="text"   className={TextInput} placeholder="Large text"  name="name" value={name} onChange={this.onChange} key={id} />
   </Col>
   </Form.Group>
   <Form.Group as={Row} className="mb-3">
   <Form.Label column sm={3}>Description:</Form.Label>
   <Col sm={9}>  
   <Form.Control as="textarea"   className={TextInput} rows={8} cols={50} name="description" value={description} onChange={this.onChange} key={id} />
   </Col>
   </Form.Group>
   <Form.Group as={Row} className="mb-3">
   <Col smOffset={3} sm={6}>  
   <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
    </ButtonToolbar>
   </Col>
   </Form.Group>
      </Form>

     {validationMessage}
     </Card.Body>
     <Card.Footer className="text-muted">
       <Link to={`/edit/${id - 1}`}>Prev</Link>
       {' | '}
       <Link to={`/edit/${id + 1}`}>Next</Link>
     </Card.Footer>
   </Card>
  
       );
}
}

const IssueEditWithToast = withToast(Edit);
IssueEditWithToast.fetchData = Edit.fetchData;
export default IssueEditWithToast;