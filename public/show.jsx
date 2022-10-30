import React from 'react';
import graphQLFetch from './graphQL.js';
import IssueTable from './table.jsx';
import URLSearchParams from 'url-search-params';
import { Link,NavLink, withRouter } from 'react-router-dom';
import IssueFilter from './filter.jsx';
import Detail from './Detail.jsx';
import { Route } from 'react-router-dom';
import {Form, Button, Pagination} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import store from './store.js';
import withToast from './withToast.jsx';

const SECTION_SIZE = 5;

/*
class IssueFilter extends React.Component {
  render() {
  return (
  <div>
  <Link to="/show">All Issues</Link>##
  <Link to={{ pathname: '/show', search: '?status=New' }}>New Issues</Link>##
  <Link to={{ pathname: '/show', search: '?status=Assigned' }}>Assigned Issues</Link>##
  </div>
  );
  }
 }
*/


/*
//function List ({row}){
const List= withRouter(({ row, location: { search }, closeIssue, index, }) => {
  const selectLocation = { pathname: `/show/${row.id}`, search };
    return(
     <tr>
        <td>{row.id} </td>
        <td>{row.name}</td>
        <td>{new Date(row.date).toDateString()}</td>
        <td>{row.effort}</td>
        <td><Link to={`/edit/${row.id}`}>Edit</Link>{' | '} <NavLink to={selectLocation}>Select</NavLink>{' | '}
            <button type="button" onClick={() =>  closeIssue(index) }>
               Close
            </button>
        </td>
    </tr>
    );
});
//<td><a href={`/#/edit/${row.id}`}>Edit</a></td>
*/
function PageLink({params, page, activePage, children,}) {
  params.set('page', page);
  if (page === 0) 
     return React.cloneElement(children, { disabled: true });
  return (
  <LinkContainer isActive={() => page === activePage} to={{ search: `?${params.toString()}` }}>
      {children}
  </LinkContainer>
  );
 }


class AddList extends React.Component{
constructor() {
 super();
 this.newdata = this.newdata.bind(this);
}

newdata(e) {
  e.preventDefault();
  const tempform= document.forms.add;
 //date push 10 houre
  const tempdata = { name: tempform.name.value, date: new Date((new Date().getTime() + 1000*60*60*24*10)),}
 
  this.props.createtemp(tempdata); 
  tempform.name.value ='';    
} 

render(){
 return(

   <form class="row row-cols-lg-auto g-3 align-items-center" name='add' onSubmit={this.newdata}>
     <Form.Group>
          <Form.Label>Name:</Form.Label>
          {' '}
          <Form.Control type='text' name='name' placeholder="name" />
      </Form.Group>
     {' '}
     <Button bsStyle="primary" type="submit">Add</Button>
   </form>
 );
}
}
/*
function Show (props, closeIssue){

const listx = props.list.map((list,index) => <List key={list.id}  row={list} closeIssue={closeIssue} index={index}/>);
return(
 <table>
    <tr>
       <th>id</th>
       <th>name</th>
       <th>date</th>
       <th>effort</th>
       <th>edit</th>
    </tr>
    <tbody>
    { listx}  
    </tbody>
 </table>

);
}
*/

//export default class Show extends React.Component{

class Show extends React.Component{

constructor(){
super();

//const issues = store.initialData? store.initialData.issueList.issues : null;
//const selectedIssue = store.initialData? store.initialData.issue: null;
//delete store.initialData;

const initialData = store.initialData || { issueList: {} };
const {issueList: { issues, pages }, issue: selectedIssue,} = initialData;
delete store.initialData;

this.state ={issues,selectedIssue,pages,};
this.createtemp = this.createtemp.bind(this);
this.closeIssue = this.closeIssue.bind(this);
this.deleteIssue = this.deleteIssue.bind(this);
//this.location1 = {
 // pathname: "/show",
 // search:'?status=All',
//};
}

async deleteIssue(index) {
  
  const query = `mutation  DeleteList($id: Int!) {
    DeleteList(id: $id)
  }`;

  const { issues } = this.state;
  const { showSuccess, showError } = this.props;
  const { location: { pathname, search }, history } = this.props;
  const { id } = issues[index];
  const data = await graphQLFetch(query, { id },showError);
 
  if (data && data.DeleteList) {
    this.setState((prevState) => {
      const newList = [...prevState.issues];
      if (pathname === `/issues/${id}`) {
        history.push({ pathname: '/issues', search });
      }
      newList.splice(index, 1);
      return { issues: newList };
    });
    const undoMessage = (
      <span>
        {`Deleted issue ${id} successfully.`}
        <Button bsStyle="link" onClick={() => this.restoreIssue(id)}>
          UNDO
        </Button>
      </span>
    );
    showSuccess(undoMessage);
  }else {
       this.loadData();
  }
  

  }

async closeIssue(index) { 
  
  const query = `mutation DeleteList($id: Int!) {
    UpdateList(id: $id, changes: { status: Closed }) {
      id name status 
      effort date description
    }
  }`;
  const { issues } = this.state;
  const { showError } = this.props;
  const data = await graphQLFetch(query, { id: issues[index].id },showError);
  if (data) {
    this.setState((prevState) => {
      const newList = [...prevState.issues];
      newList[index] = data.UpdateList;
      return { issues: newList };
    });
  } else {
    this.loadData();
  }
  
}

async restoreIssue(id) {

     const query = `mutation issueRestore($id: Int!) {
        issueRestore(id: $id)
     }`;
     const { showSuccess, showError } = this.props;
     const data = await graphQLFetch(query, { id }, showError);
        if (data) {
           showSuccess(`Issue ${id} restored successfully.`);
           this.loadData();
       }

}



componentDidMount(){
 const { issues } = this.state;
 if (issues == null) 
     this.loadData();
}

componentDidUpdate(prevProps) {
  //const { location: { search: prevSearch } } = prevProps;
  const {
    location: { search: prevSearch },
    match: { params: { id: prevId } },
  } = prevProps;
  const { location: { search }, match: { params: { id } } } = this.props;
  if (prevSearch !== search || prevId !== id) {
    this.loadData();
  }
}


//async loaddata(){
static async fetchData(match, search,showError) {
       //const { location: { search } } = this.props;
       const params = new URLSearchParams(search);
       const vars = {hasSelection: false, selectedId: 0 };
       if (params.get('status')) vars.status = params.get('status');
       else 
           vars.status = null;

       const effortMin = parseInt(params.get('effortMin'), 10);
       if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
       const effortMax = parseInt(params.get('effortMax'), 10);
       if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
                 
    //const query = `query ListStatus($status: StatusType) {
    //     ListStatus (status: $status) {
    //       id name date effort
    //     }
    //  }`;
    
    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query issueList($status: StatusType $effortMin: Int $effortMax: Int  $hasSelection: Boolean!  $selectedId: Int!  $page: Int) {
        issueList(status: $status effortMin: $effortMin effortMax: $effortMax  page: $page) 
        {issues {
             id name date effort
                }
         pages
        }
      issue(id: $selectedId) @include (if : $hasSelection) {
        id description
      }
    }`;

  
const data = await graphQLFetch(query,vars,showError);
//if (data) {
 //this.setState({  list: data.List  });
// this.setState({  issues: data.ListStatus  };
// }
 return data;
 
}

async loadData() {
  const { location: { search } , match, showError } = this.props;
  const data = await Show.fetchData(match, search,showError);
  if (data) {
    this.setState({ issues: data.ListStatus.issues  , selectedIssue: data.issue ,pages: data.ListStatus.pages, });   
  }
}

async createtemp(issue) {
/*
issue.id = this.state.list.length + 1;
const newIssueList = this.state.list.slice();
newIssueList.push(issue);
this.setState({ list: newIssueList });
*/
const query = `mutation  AddList($issue: IssueInputs!) {
 AddList(issue: $issue) {
    id
 }
}`;
/*
const response = await fetch('/graphql', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json'},
 body: JSON.stringify({ query, variables: { issue } })
});
this.loadData();
*/
const data = await graphQLFetch(query, { issue });
if (data) {
 this.loadData();
}
}



render(){   
  const { issues } = this.state;
  if (issues == null) 
     return null;
 // const { match } = this.props;
  const { selectedIssue, pages } = this.state;
  const { location: { search } } = this.props;

const params = new URLSearchParams(search);
 let page = parseInt(params.get('page'), 10);
 if (Number.isNaN(page))
     page = 1;
 const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
 const endPage = startPage + SECTION_SIZE - 1;
 const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
 const first = 1;
 const last = pages;
 const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;
 const items = [];
 if(prevSection )
    items.push((<Pagination.Ellipsis disabled />));
 for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
     params.set('page', i);
     items.push((<PageLink key={i} params={params} activePage={page} page={i}><Pagination.Item>{i}</Pagination.Item></PageLink>));
 }
 if(nextSection )
       items.push((<Pagination.Ellipsis disabled />));
 return(

    <React.Fragment>
      
<div class="card">
  <div class="card-header">
    filter
  </div>
  <div class="card-body">
    <blockquote class="blockquote mb-0">
        <IssueFilter urlBase="/issues"/>
    </blockquote>
  </div>
</div>

        <IssueTable lists={issues} closeIssue={this.closeIssue}  deleteIssue={this.deleteIssue} />  
        <Detail issue={selectedIssue} />
    
 <Pagination>
   < PageLink params={params} page={first}>
      <Pagination.First />
   </PageLink>
   <PageLink params={params} page={prevSection}>
      <Pagination.Prev />
   </PageLink>
      {items}
    <PageLink params={params} page={nextSection}>
      <Pagination.Next />
    </PageLink>
    < PageLink params={params} page={last}>
        <Pagination.Last />
    </PageLink>
 </Pagination>

    </React.Fragment>
    
 );
}
} 
  //<Route path={`${match.path}/:id`} component={IssueDetail} />   
 // <AddList createtemp={this.createtemp} />  

  const IssueListWithToast = withToast(Show);
  IssueListWithToast.fetchData = Show.fetchData;
  
  export default IssueListWithToast;