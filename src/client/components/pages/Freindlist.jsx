import React, { Component } from "react";
import "../css/FriendList.css";
import { Spinner } from "reactstrap";

class FriendList extends Component {
  state = {
    friendlist: [],
    loading: false
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    this.props
      .onGetFriends()
      .then(res => {
        this.setState({ loading: false });
        this.setState({ friendlist: res.data.Friendlist });
      })
      .catch(err => this.setState({ loading: false }));
  };

  getViews = () => {
    const { friendlist } = this.state;

    const view = friendlist.map((friend, index) => {
      return (
        <li tabIndex={index} key={index}>
          <div
            className="list"
            onClick={() => this.props.onSelectFriend(friend.profile)}
          >
            <div className="avatar">
              <img
                className="active"
                src={friend.profile.profilePicture}
                alt="Friend"
              />
              <div className="online" />
            </div>
            <div className="users-list">
              <h6 className="username">{friend.profile.userName}</h6>
              <p className="text">{friend.messages.message}</p>
              <code className="timestamp">{friend.messages.date}</code>
            </div>
          </div>
        </li>
      );
    });
    return view;
  };

  render() {
    const { profilePicture, onFriendSearch, onlogOut } = this.props;
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src={profilePicture} alt="bal" />
          </div>
          <div className="header-control">
            <div className="find-friend" onClick={onFriendSearch}>
              <i className="fas fa-search" />
            </div>
            <div className="log-out" onClick={onlogOut}>
              <i>logOut</i>
            </div>
          </div>
        </header>
        {this.state.loading ? (
          <Spinner type="grow" className="spinner" />
        ) : (
          <ul>{this.getViews()}</ul>
        )}
      </section>
    );
  }
}

export default FriendList;
