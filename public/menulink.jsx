import React  from 'react';
import Contents from './contentlink.jsx';
import {Navbar,Nav,NavDropdown,Container,Row,Col,NavItem,Form} from 'react-bootstrap';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import Search from './Search.jsx';
import SignInNavItemtest from './SignInNavItemtest.jsx';


/*
 <nav>
   <NavLink exact to="/">Home</NavLink>
     {' | '}
   <NavLink to="/show">List</NavLink>
     {' | '}
    <NavLink to="/report">Report</NavLink>
 </nav>
  <IssueAddNavItem />
*/



function NavBarr() {
  return (
  <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="/">Issue Tracker</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto" >
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/issues">List</Nav.Link>
      <Nav.Link href="/report">Report</Nav.Link>
      <Nav.Link href="/about">About</Nav.Link>
        <NavDropdown title="+" id="basic-nav-dropdown">
          <NavDropdown.Divider />
          <IssueAddNavItem />
        </NavDropdown>
      </Nav>
      <Nav className="me-auto">
            <Search />
           <SignInNavItemtest />
      </Nav>
    
    </Navbar.Collapse>
  </Container>
</Navbar>



  );
}




/*
<nav>
<NavLink exact to="/">Home</NavLink>
  {' | '}
<NavLink to="/show">List</NavLink>
  {' | '}
 <NavLink to="/report">Report</NavLink>
</nav>
*/

function Footer() {
  return (
      <small>
      <hr/>
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.com/vasansr/pro-mern-stack-2">
          GitHub repository
        </a>
      </p>  
        </small>
  );
}




export default function menulink (){
 return (
   <div>
     <NavBarr/>
     <Contents/>
     <Footer/>
    </div>
 );
}
