import React from 'react';
import ReactJson from 'react-json-view';

import './Home.css';

export default class Home extends React.Component {

  state = {
    username: "",
    rsApiResponse: null,
    jagexApiResponse: null,
  };

  getRSApiResponse = async() => {
    let response = await fetch("/api/osrs/" + this.state.username);
    let data = await response.json();

    console.log("Here's the RS-API data:", data);
    this.setState({rsApiResponse: data});
  }

  getJagexApiResponse = async() => {
    let response = await fetch("/api/raw/osrs/" + this.state.username);
    console.log("Raw response:", response);
    let data = await response.text();
    let formattedData = await data.toString().replace(/"/g, "").split("\\n");
    
    console.log("Here's the Jagex API data:", formattedData);
    this.setState({jagexApiResponse: formattedData});
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.getJagexApiResponse();
      this.getRSApiResponse();
    }
  }

  handleChange = (event) => {
    this.setState({ username: event.target.value });
    console.log(this.state);
  }

  render = () => {

    const { jagexApiResponse, rsApiResponse } = this.state;

    return (
      <>
        <h2>Why not test both endpoints and decide for yourself?</h2>
        <p>The front-end is still being developed, thank you for your patience.</p>

        <div className="endpoint-test-container">
          <div className="endpoint-container">
            <span className="input-prepend-http">GET</span>
            <span className="input-prepend-endpoint">{`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=`}</span>
            <input className="input-ign" id="jagexApiUsername" type="text" placeholder="In-Game Name" value={this.state.username} maxLength="12" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
          </div>
          
          <div className="endpoint-container">
            <span className="input-prepend-http">GET</span>
            <span className="input-prepend-endpoint stretch-span">{`https://rs-api.cloud/api/osrs/`}</span>
            <input className="input-ign" id="rsApiUsername" type="text" placeholder="In-Game Name" value={this.state.username} maxLength="12" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
          </div>
        </div>

        <div className="compare-responses">
          <div className="api-response left">
            <div className="csv-response">
              {jagexApiResponse && jagexApiResponse.map((line, index) => {
                return <p key={index}>{line}</p>}
              )}
            </div>
          </div>

          <div className="api-response right">
            {rsApiResponse &&
            <ReactJson src={rsApiResponse} collapsed={2} theme={"bright:inverted"} enableClipboard={false} name={false} /> }
          </div>
        </div>
      </>
    );
  }
}