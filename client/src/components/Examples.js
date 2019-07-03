import React from 'react';
import './Examples.css';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { rainbow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default class Examples extends React.Component {

  constructor() {
    super();
    this.state = {
      language: "ruby",
      code: this.rubyCode(),
    };
  }

  rubyCode = () => {
    return (
`require 'net/http'
require 'json'

@endpoint = 'https://rs-api.cloud/api/osrs/'

def get_osrs_data(username)
  response = Net::HTTP.get(URI(@endpoint + username))
  JSON.parse(response)
end

osrs_data = get_osrs_data 'dimsimtim'

puts osrs_data['username']
# => dimsimtim

puts osrs_data['skills']['cooking']
# => {"rank"=>916944, "level"=>58, "experience"=>244950}

puts osrs_data['skills']['cooking']['level']
# => 58
      `);
  }

  nodeCode = () => {
    return (
      `const fetch = require('node-fetch');

const getOsrsData = async(username) => {
  const URL = "https://rs-api.cloud/api/osrs/" + username;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

const handleRequest = async() => {
  const hiscoreData = await getOsrsData("zezima");

  console.log("Username:\\t", hiscoreData.username);
  // => Username:        zezima

  console.log("Combat Level:\\t", hiscoreData.combat_level);
  // => Combat Level:    93

  console.log("Overall XP:\\t", hiscoreData.skills.overall.experience);
  // => Overall XP:      27957906

  console.log("Cooking Rank:\\t", hiscoreData.skills.cooking.rank);
  // => Cooking Rank:    298973
}

handleRequest();
      `
    );
  }

  setCode = (target) => {
    switch(target) {

      case "node":
        return this.nodeCode();

      case "ruby":
      default:
        return this.rubyCode();
    }
  }

  handleClick = (event) => {
    const lang = event.target.id;
    
    this.setState({
      language: lang,
      code: this.setCode(lang),
    })
  }

  render = () => {
    console.log("State:", this.state);
    return (
      <>
        <div className="examples-tab-container">
          <div id="ruby" className="nav-button start" type="button" onClick={this.handleClick}>Ruby</div>
          <div id="node" className="nav-button" type="button" onClick={this.handleClick}>Node.js</div>
          <div id="python" className="nav-button" type="button" onClick={this.handleClick}>Python</div>
          <div id="csharp" className="nav-button" type="button" onClick={this.handleClick}>C#</div>
          <div id="golang" className="nav-button end" type="button" onClick={this.handleClick}>GoLang</div>
        </div>

        <SyntaxHighlighter language={this.state.language} style={rainbow}>
          {this.state.code}
        </SyntaxHighlighter>
      </>
    );
  }
}