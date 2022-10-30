import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import {Button, Tooltip, OverlayTrigger, Image,Table} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
 


//function List ({row}){
    const List= withRouter(({ row, location: { search }, closeIssue, index,deleteIssue, }) => {
        const selectLocation = { pathname: `/issues/${row.id}`, search };
        const editTooltip = (<Tooltip id="close-tooltip" placement="top">Edit Issue</Tooltip>);
       const closeTooltip = (<Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>);
       const deleteTooltip = (<Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>);

        function onClose(e) {
           e.preventDefault();
           closeIssue(index);
        }

        function onDelete(e) {
           e.preventDefault();
           deleteIssue(index);
        }

      

        const tableRow = (
           <tr>
              <td>{row.id} </td>
              <td>{row.name}</td>
              <td>{new Date(row.date).toDateString()}</td>
              <td>{row.effort}</td>
              <td>
                 <Link to={`/edit/${row.id}`}>Edit</Link>
                 {' | '}
                 <LinkContainer to={ `/edit/${row.id}` }>
                     <OverlayTrigger delayShow={1000} overlay={editTooltip}>
                     <Button bsSize="xsmall" >
                        Edit
                        < Image src=''   />
                     </Button>
                     </OverlayTrigger>              
                  </LinkContainer>
                  
                  {' | '}
                 <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
                   <Button bsSize="xsmall" onClick={onClose}>
                       remove
                       < Image src=''   />
                  </Button>
                 </OverlayTrigger>
                 {' | '}
                 <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
                   <Button bsSize="xsmall" onClick={onDelete}>
                     Recycle Bin
                     < Image src=''   />
                   </Button>
                 </OverlayTrigger> 
              </td>
          </tr>
          );

     return(
       <LinkContainer to={selectLocation}>
          {tableRow}
        </LinkContainer>
      );
   });
      

export default function IssueTable ({lists, closeIssue, deleteIssue}){

    const listx = lists.map((list,index) => (
                 <List key={list.id}  
                       row={list} 
                       closeIssue={closeIssue} 
                       index={index} 
                       deleteIssue={deleteIssue} />
                       ));
    return(
      <Table striped bordered hover>
        <thead>
        <tr>
           <th>id</th>
           <th>name</th>
           <th>date</th>
           <th>effort</th>
           <th>edit</th>
        </tr>
        </thead>
        <tbody>
         { listx} 
        </tbody>
      </Table>
    
    );
    }

    //