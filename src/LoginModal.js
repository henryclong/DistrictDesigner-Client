import React, { Component } from 'react';

class LoginModal extends Component {

  closeModal = () => {
    this.props.close();
  }

  render() {
    return (
      <div className="LoginModal">
        <input type="text" placeholder="Username" className="inset"/>
        <input type="password" placeholder="Password" className="inset"/>
        <div className="LoginButtonContainer">
          <button onClick={this.closeModal}>Log In</button>
          <button onClick={this.closeModal}>Register</button>
        </div>
        <a onClick={this.closeModal}>Close</a>
      </div>
    );
  }
}

export default LoginModal;
