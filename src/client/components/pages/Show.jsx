import React, { Component } from "react";
import ChatBox from "./ChatBox";
import FriendList from "./Freindlist";
import Cover from "./Cover";
import "../css/Show.css";
import Download from "./Download";
import FindNewFriend from "./FindNewFriend";
class Show extends Component {
  state = {
    currentDisplay: "Cover"
  };

  componentDidMount = () => {
    const userEmail = sessionStorage.userEmail;
    if (userEmail) {
      this.props.onRefresh(userEmail).then(res => {
        this.setState({ currentDisplay: "Friend-list" });
      });
    }
  };

  onLogin = loginData => {
    return this.props.onLogin(loginData).then(res => {
      this.ChangeDisplayForward();

      return res;
    });
  };

  onSelectFriend = friendData => {
    this.props
      .onSelectFriend(friendData)
      .then(res => this.ChangeDisplayForward());
  };
  onRegister = RegisterData => {
    return this.props.onRegister(RegisterData).then(res => {
      this.ChangeDisplayForward();
      return res;
    });
  };

  onAddFriendScreen = () => {
    this.setState({ currentDisplay: "Add-friend" });
  };

  onAddFriend = userEmail => {
    return this.props.onAddFriend(userEmail);
  };

  onlogOut = () => {
    sessionStorage.removeItem("userEmail");
    this.ChangeDisplayBackward();
  };

  ChangeDisplayForward = () => {
    const { currentDisplay } = this.state;

    switch (currentDisplay) {
      case "Cover":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Friend-list":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      case "Chat-box":
        this.setState({ currentDisplay: "Download" });
        return;
      default:
        return;
    }
  };

  ChangeDisplayBackward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Chat-box":
      case "Add-friend":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Download":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      case "Friend-list":
        this.setState({ currentDisplay: "Cover" });
        return;
      default:
        return;
    }
  };

  showDisplay = () => {
    const { currentDisplay } = this.state;
    const {
      user,
      receiver,
      messages,
      onSend,
      onGetFriends,
      onGetSocket
    } = this.props;

    switch (currentDisplay) {
      case "Cover":
        return <Cover onRegister={this.onRegister} onLogin={this.onLogin} />;
      case "Friend-list":
        return (
          <FriendList
            onSelectFriend={this.onSelectFriend}
            forward={this.ChangeDisplayForward}
            onGetFriends={onGetFriends}
            onAddFriend={this.onAddFriendScreen}
            onlogOut={this.onlogOut}
            profilePicture={user.userProfilePicture}
          />
        );
      case "Add-friend":
        return (
          <FindNewFriend
            backward={this.ChangeDisplayBackward}
            onAddFriend={this.onAddFriend}
          />
        );
      case "Chat-box":
        return (
          <ChatBox
            user={user}
            receiver={receiver}
            messages={messages}
            onSend={onSend}
            forward={this.ChangeDisplayForward}
            backward={this.ChangeDisplayBackward}
            onGetSocket={onGetSocket}
          />
        );
      case "Download":
        return (
          <Download
            backward={this.ChangeDisplayBackward}
            sender={user.userEmail}
            receiver={receiver}
          />
        );
      default:
        return <div>Sorry not found</div>;
    }
  };

  render() {
    return (
      <div className="full-screen">
        <section className="app-screen">{this.showDisplay()}</section>
      </div>
    );
  }
}

export default Show;
