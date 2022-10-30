import React from 'react';
import {NavItem, Modal, Button, NavDropdown,} from 'react-bootstrap';
import withToast from './withToast.jsx';

/*
import  { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);
*/

 class SigninNavItemtest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabled: true,
      user: { signedIn: false, givenName: '' },
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }




  componentDidMount() {
    /*
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId }).then(() => {
          this.setState({ disabled: false });
        });
      }
    });
    */
   // const clientId = window.ENV.GOOGLE_CLIENT_ID;
   /*
    const clientId ="403367458642-0ps8els670vtbscl35t9nr8283j9nrt2.apps.googleusercontent.com";
    if (!clientId) return;
    useEffect(() => {
      const initClient = () => {
            gapi.client.init({
            clientId: clientId,
            scope: ''
          });
       };
       gapi.load('client:auth2', initClient);
       this.setState({ disabled: false });
   });
*/
    /*
    window.google.accounts.id.initialize({
      client_id: '403367458642-0ps8els670vtbscl35t9nr8283j9nrt2.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });
    window.google.accounts.id.prompt();
*/
  }





  async signIn() {
    this.hideModal();
    /*
    this.setState({ user: { signedIn: true, givenName: 'User1' } });
    const { showError } = this.props;
 try {
 const auth2 = window.gapi.auth2.getAuthInstance();
 const googleUser = await auth2.signIn();
 const givenName = googleUser.getBasicProfile().getGivenName();
 this.setState({ user: { signedIn: true, givenName } });
 } catch (error) {
 showError(`Error authenticating with Google: ${error.error}`);
 }
 */
  }

  signOut() {
    this.setState({ user: { signedIn: false, givenName: '' } });
  }

  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
 const { showError } = this.props;
 if (!clientId) {
 showError('Missing environment variable GOOGLE_CLIENT_ID');
 return;
 }
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { user } = this.state;
    if (user.signedIn) {
      return (
        <NavDropdown title={user.givenName} id="user">
          <NavDropdown.Item onClick={this.signOut}>Sign out</NavDropdown.Item>
        </NavDropdown>
      );
    }
  
    const { showing, disabled } = this.state;
    return (
      <>
        <NavItem onClick={this.showModal}>
          Sign in test
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal} bsSize="sm">
          <Modal.Header closeButton>
            <Modal.Title>Sign in test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Button  block   disabled={disabled}  bsStyle="primary" onClick={this.signIn} >
                 <img src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png" alt="Sign In" />
             </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
          
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withToast(SigninNavItemtest);



//<Button  block disabled={disabled} bsStyle="primary" onClick={this.signIn}>
              
//</Button>

