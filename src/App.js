import AboutModal from './AboutModal';
import LoginModal from './LoginModal';
import Header from './Header';
import Map from './Map';
import Modal from 'react-modal';
import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  state = {
    faq: {
      isActive: false,
    },
    login: {
      isActive: false,
    },
  };

  componentWillMount() {
    Modal.setAppElement('body');
  }

  onToggle = (id) => {
    console.log(id, ' ', this.state[id].isActive)
    this.setState({
      [id]: {
        isActive: !this.state[id].isActive,
      },
    })
  };

  render() {
    return (
      <div className="App">
        <Header 
          onToggle={this.onToggle}
        />
        <Map />
        <Modal
          className="Popup"
          overlayClassName="PopupOverlay"
          isOpen={this.state.faq.isActive}
          onRequestClose={() => this.onToggle('faq')}
        >
          <AboutModal />
        </Modal>
        <Modal
          className="Popup"
          overlayClassName="PopupOverlay"
          isOpen={this.state.login.isActive}
          onRequestClose={() => this.onToggle('login')}
        >
          <LoginModal close={() => this.onToggle('login')}/>
        </Modal>
      </div>
    );
  }
}

export default App;
