import AboutModal from './AboutModal';
import LoginModal from './LoginModal';
import Header from './Header';
import Map from './Map';
import Modal from 'react-modal';
import React, { Component } from 'react';
import './App.scss';
import { authUser, logOut, createAccount } from './helpers/district-designer';

class App extends Component {
  state = {
    faq: {
      isActive: false,
    },
    login: {
      isActive: false,
    },
    activeUser: this.props.user,
  };

  login = (user, pass) => {
    let loginResponse = authUser(user, pass);
    console.log('logged in: '+loginResponse);
    if(!loginResponse || loginResponse['USER_LOGGED_IN'] === false) {
      this.setState({ activeUser: this.props.user });
      console.log('user_not_found');
    } else {
      console.log('user_found');
      this.setState({ activeUser:
        {
          isLoggedIn: true,
          username: user,
          isAdmin: false,
        }
      });
    }
  }

  logout = () => {
    this.setState({ activeUser: this.props.user });
    logOut();
  }

  register = (user, pass) => {
    createAccount(user, pass);
    this.login(user, pass);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  onToggle = (id) => {
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
          user={this.state.activeUser}
          logout={this.logout}
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
          <LoginModal
            close={() => this.onToggle('login')}
            login={this.login}
            register={this.register}
          />
        </Modal>
      </div>
    );
  }
}

App.defaultProps = {
  user: {
    isLoggedIn: false,
    username: '',
    isAdmin: false,
  },
}

export default App;
