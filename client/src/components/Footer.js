import React from 'react';
import './Footer.css';

export default class Footer extends React.Component {

  render = () => {
    return (
      <div className="footer-container">

        <div className="social-links">
          <a href="https://github.com/timwaldron" target="_blank" rel="noopener noreferrer">
            <img className="logo-styling" alt="GitHub Logo White" src={process.env.PUBLIC_URL + "/images/github-white.svg"} />
          </a>
          <a href="https://www.linkedin.com/in/timothy-waldron-1b700914b/" target="_blank" rel="noopener noreferrer">
            <img className="logo-styling" alt="LinkedIn Logo White" src={process.env.PUBLIC_URL + "/images/linkedin-white.svg"} />
          </a>
          <a href="https://twitter.com/hi_my_names_tim" target="_blank" rel="noopener noreferrer">
            <img className="logo-styling" alt="Twitter Logo White" src={process.env.PUBLIC_URL + "/images/twitter-white.svg"} />
          </a>
        </div>

        <div className="powered-by">
          <p>Powered By</p>

          <a href="https://nodejs.org/en/about/" target="_blank" rel="noopener noreferrer">
            <img alt="Node.js Logo White" src={process.env.PUBLIC_URL + "/images/nodejs-white.svg"} />
          </a>

          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
            <img alt="React Logo White" src={process.env.PUBLIC_URL + "/images/react-white.svg"} />
          </a>

          <a href="https://www.heroku.com/" target="_blank" rel="noopener noreferrer">
            <img alt="Heroku Logo White" src={process.env.PUBLIC_URL + "/images/heroku-white.svg"} />
          </a>
        </div>
        
      </div>
    );
  }
}