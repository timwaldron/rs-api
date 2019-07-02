import React from 'react';

export default class Home extends React.Component {

  state = {
    rsdata: "none",
  };

  testApi = async() => {
    let response = await fetch("/api/osrs/dimsimtim");
    let data = await response.json();
    console.log("Here's the API data:", data);
    this.setState({rsdata: data});
  }

  componentDidMount = () => {
    this.testApi();
  }

  render = () => {
    return (
      <>
        <h1>Hello from the Home component</h1>
        <p>Here's a data from the API: {this.state.rsdata.username ? this.state.rsdata.username : "Loading..."}</p>
      </>
    );
  }
}