import React, { Component } from 'react';

class LoginModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
    };
  }

  closeModal = () => {
    this.props.close();
  }

  register = () => {
    this.props.register(this.state.user, this.state.pass);
    this.closeModal()
  }

  logIn = () => {
    this.props.login(this.state.user, this.state.pass);
    this.closeModal()
  }

  render() {
    return (
      <div className="LoginModal">
        <input type="text"      onChange={(e)=>{this.setState({ user: e.target.value })}} placeholder="Username"  className="inset"/>
        <input type="password"  onChange={(e)=>{this.setState({ pass: e.target.value })}} placeholder="Password"  className="inset"/>
        <div className="LoginButtonContainer">
          <button onClick={()=>{this.logIn()}}>Log In</button>
          <button onClick={()=>{this.register()}}>Register</button>
        </div>
        <a onClick={this.closeModal}>Close</a>
      </div>
    );
  }
}

export default LoginModal;
