import React from 'react';
import SelectAsync from 'react-select/async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';

import graphQLFetch from './graphQL.js';
import withToast from './withToast.jsx';
import { string } from 'prop-types';


class Search extends React.Component {
  
  
  loadOptions = inputValue => {
    return new Promise((resolve, reject) => {
      // using setTimeout to emulate a call to server
      setTimeout(() => {
        resolve(this.loadOption(inputValue));
      }, 1000);
    });
  };
  

  async loadOption(term) {
    if (term.length < 3) 
       return [];
    const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id name}
      }
    }`;
    
    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.name}`, value: issue.id,
    }));
  }


  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  onChangeSelection({ value }) {
    const { history } = this.props;
    history.push(`/edit/${value}`);
  }


  constructor(props) {
    super(props);
    this.state = { inputValue: string };
    this.onChangeSelection = this.onChangeSelection.bind(this);
    //this.loadOptions = this.loadOptions.bind(this);
    
  }
  




  render() {
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: '2px dotted pink',
        color: state.isSelected ? 'red' : 'blue',
        padding: 20,
      }),
      control: () => ({
        // none of react-select's styles are passed to <Control />
        width: 200,
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
    
        return { ...provided, opacity, transition };
      }
    }

    return (    
          <SelectAsync defaultOptions cacheOptions styles={customStyles} filterOption={() => true}  components={{ DropdownIndicator: null }}  value="" loadOptions={this.loadOptions} onInputChange={this.handleInputChange } onChange={this.onChangeSelection} />
    );
  }
}
  //<h1>inputValue: "{this.state.inputValue}"</h1>
export default withRouter(withToast(Search));
