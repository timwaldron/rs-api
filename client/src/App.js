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
        {this.state.playerdata && this.state.playerdata.toString() }

        <input type="button" value="Get DimSimTim" onClick={this.getOsrsData} />
      </div>
    )
  }
}
