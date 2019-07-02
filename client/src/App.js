import React, { Component } from 'react'
import './App.css'

export default class App extends Component {
  state = {
    playerdata: null,
  }
  
  componentDidMount = () => {

  }

  getOsrsData = async() => {
    let response = await fetch("/api/osrs/dimsimtim");
    let data = await response.json();
    console.log("Data receiveed:", data);
    this.setState({playerdata: data});
  }
  
  render = () => {
    return (
      <div className="App">
        <h1>In the process of implementing a React front-end, brb!</h1>
        <p>Endpoint: http://rs-api.cloud/api/<strong>:game</strong>/<strong>:username</strong></p>
        <p>Example: http://rs-api.cloud/api/osrs/dimsimtim</p>
      </div>
    )
  }
}
