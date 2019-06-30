import React from 'react';
import axios from 'axios';
import './App.css';

const __ = window.wp.i18n.__;

export default class App extends React.Component{

  constructor (props){
    super(props);
    this.axios = axios.create({
      baseURL: window.example_rest_object.rest_url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.example_rest_object.nonce
      }
    });
  }  
  
  state = {
    options: {
      bla: '' 
    }
  }

  componentDidMount(){
    this.axios.get('/')
      .then(res=>{
        const options = res.data.value;
        this.setState({options});
      })
      .catch(error=>{
        console.log(error);
      });
  }

  handleChange = event => {
    this.setState({ bla: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const options = {
      bla: this.state.options.bla
    };

    this.axios.post('/', { options })
      .then(res => {
        
      });
  }

  render(){
    return(
      <section className="settings-form">
        <form onSubmit={this.handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                <label>{__('Bla:', 'am-boilerplate-plugin')}</label>
                </th>
                <td><input className="regular-text" type="text" name="bla" value={ this.state.options.bla } onChange={this.handleChange} /></td>              
              </tr>              
            </tbody>
          </table>
          <p className="submit"><button className="button button-primary" type="submit">Save</button></p>
        </form>
      </section>
    )
  }
}
