import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
      <div className="Header">
        <img src={'/DDLogo_slanted.svg'} alt=""></img>
        {
          this.props.nav.map((item) => (
              <button key={item.id} onClick={() => this.props.onToggle(item.id)}>
                {item.label}
              </button>
          ))
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
      id: 'faq',
      label: 'FAQ'
    },
  ],
};

export default Header;
