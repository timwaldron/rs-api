import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default class Navbar extends React.Component {

  render = () => {
    return (
      <div className="navbar-container">
        <Link className="custom-link" to="/">Home</Link>
        <Link className="custom-link" to="/docs">Docs</Link>
        <Link className="custom-link" to="/examples">Examples</Link>
        <Link className="custom-link" to="/contact">Contact</Link>
      </div>
    );
  }
}