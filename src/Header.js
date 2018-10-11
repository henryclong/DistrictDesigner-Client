import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
      <div className="Header">
        <h1>Header Component</h1>
        {
          this.props.nav.map((item) => (
            <div key={item.id}>
              <button onClick={() => this.props.onToggle(item.id)}>
                {item.label}
              </button>
            </div>
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
