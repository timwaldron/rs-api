import React from 'react'
import Routes from './Routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css'

export default class App extends React.Component {

  render = () => {
    return (
      <div className="app-container">
        <Navbar />

        <div className="content-container">
          <Routes />
        </div>
        
        <Footer />
      </div>
    );
  }
}
