import React, { Component } from 'react';

class AdminModal extends Component {

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
    this.resetRegister();
    //TODO: Refresh admin panel to show new user
  }

  resetRegister = () => {
    this.setState({
      user: '',
      pass: '',
    });
  }

  render() {
    return (
      <div className="AdminModal">
        <h1>Admin Panel</h1>
        <div>
          <table>
            <tr>
              <th>Username</th>
              <th>Admin Status</th>
              <th>Change Status</th>
              <th>Add/Remove</th>
            </tr>
            {
              this.props.userList.map((user)=>(
                <tr>
                  <td><p>{user.username}</p></td>
                  <td><p>{(user.isAdmin)?'Admin':'User'}</p></td>
                  <td><button className='adminButton'>{(user.isAdmin)?'Remove Admin':'Make Admin'}</button></td>
                  <td>{(user.username === this.props.activeUser.username)?'':<button className='deleteButton'>Delete User</button>}</td>
                </tr>
              ))
            }
            <tr>
              <td><input value={this.state.user} type="text" placeholder="Username" onChange={(e)=>{this.setState({ user: e.target.value })}}/></td>
              <td><input value={this.state.pass} type="password" placeholder="Password" onChange={(e)=>{this.setState({ pass: e.target.value })}}/></td>
              <td><button className='addButton' onClick={this.register}>Add User</button></td>
              <td><button className='deleteButton' onClick={this.resetRegister}>Clear</button></td>
            </tr>
          </table>
        </div>
        <a onClick={this.closeModal}>Close</a>
      </div>
    );
  }
}

AdminModal.defaultProps = {
  userList: [
    {
      username: 'testUser1',
      isAdmin: false,
    },
    {
      username: 'testUser2',
      isAdmin: true,
    },
    {
      username: 'testUser3',
      isAdmin: false,
    }
  ],
}

export default AdminModal;
