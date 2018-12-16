import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
      <div className="Header">
        <img src={'/DDLogo_slanted.svg'} alt=""></img>
        {
          <button key='login' onClick=
            {(!this.props.user.isLoggedIn)?() => {this.props.onToggle('login')}:() => {this.props.logout()}}
          >
            {(!this.props.user.isLoggedIn)?'Log-in / Sign-Up':'Log Out, ' + this.props.user.username}
          </button>
        }
        {
          (this.props.user.isLoggedIn)?//TODO: Only allow user to access adminpanel if isAdmin is true
          <button key='admin' onClick={()=>this.props.onToggle('admin')}>
            Admin Panel
          </button>:<div/>
        }
      </div>
    );
  }
}

Header.defaultProps = {
  nav: [
    {
      id: 'login',
      label: 'Log-in / Sign-Up'
    },
    {
      id: 'admin',
      label: 'Admin Panel'
    },
  ],
};

export default Header;
