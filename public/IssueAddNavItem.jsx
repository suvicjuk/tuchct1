import React from 'react';
import { withRouter} from 'react-router-dom';
import {NavItem,Modal, Form,Button, ButtonToolbar, Tooltip, OverlayTrigger,NavDropdown,ButtonGroup} from 'react-bootstrap';
import graphQLFetch from './graphQL.js';
import withToast from './withToast.jsx';
  
class IssueAddNavItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textInput = React.createRef();
  }

    showModal() {
      this.setState({ showing: true });
    }
  
    hideModal() {
      this.setState({ showing: false });
    }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    //const form = document.forms.add;
   // alert( this.textInput.current.value);
    const issue = { name: this.textInput.current.value, date: new Date((new Date().getTime() + 1000*60*60*24*10)),};
    const query = `mutation AddList($issue: IssueInputs!) {
      AddList(issue: $issue) {
        id
      }
    }`;
    const { showError } = this.props;
    const data = await graphQLFetch(query, { issue },showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.AddList.id}`);
    }
  }

  render() {
    const { showing } = this.state;
  
    return (
      <React.Fragment>
        <>
        <OverlayTrigger  placement="left" delayShow={1000} overlay={<Tooltip id="create-issue">Create Issue</Tooltip>}>
            <NavDropdown.Item onClick={this.showModal}>plus</NavDropdown.Item>
        </OverlayTrigger>
        
        <Modal show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Form  class="row row-cols-lg-auto g-3 align-items-center" name='add' >
              <Form.Group >
                <Form.Label>Name :</Form.Label>
                <Form.Control type='text' name="name" placeholder="name"   autoFocus   ref={this.textInput} />
              </Form.Group>
             </Form>  
          </Modal.Body>
          <Modal.Footer>
            <ButtonGroup className="me-2" aria-label="First group">
              <Button type="button" bsStyle="primary" onClick={this.handleSubmit} >Add</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
       </>
      </React.Fragment>
    );
  }
}

export default  withToast(withRouter(IssueAddNavItem));
