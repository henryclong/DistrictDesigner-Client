import LoginModal from './LoginModal';
import Header from './Header';
import Map from './Map';
import Modal from 'react-modal';
import React, { Component } from 'react';
import './App.scss';
import { authUser, logOut, createAccount } from './helpers/district-designer';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

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
      Alert.error('User: '+user+' Not Found', {
        position: 'bottom-left',
        effect: 'scale',
        onShow: function () {
            console.log('aye!')
        },
        beep: false,
        timeout: 1000,
        offset: 20
    });
    } else {
      console.log('user_found');
      Alert.success('Logged in as: '+user, {
        position: 'bottom-left',
        effect: 'scale',
        onShow: function () {
            console.log('aye!')
        },
        beep: false,
        timeout: 1000,
        offset: 20
      });
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
    Alert.error('Logged Out', {
      position: 'bottom-left',
      effect: 'scale',
      onShow: function () {
          console.log('aye!')
      },
      beep: false,
      timeout: 2000,
      offset: 20
  });
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
        <Map
          user={this.state.activeUser}
        />
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
        <Alert stack={{limit: 3, spacing: 10}} />
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
