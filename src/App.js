import AboutModal from './AboutModal';
import Header from './Header';
import Map from './Map';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Map />
        <AboutModal />
      </div>
    );
  }
}

export default App;
