import React, { Component } from "react";
import ChatBox from "./ChatBox";
import FriendList from "./Freindlist";
import Cover from "./Cover";
import "../css/Show.css";
import Download from "./Download";
class Show extends Component {
  state = {
    currentDisplay: "Cover"
  };

  componentDidMount = () => {
    const userEmail = sessionStorage.userEmail;
    if (userEmail) {
      this.props.onRefresh(userEmail).then(res => {
        const view = sessionStorage.view;
        if (view) this.setState({ currentDisplay: view });
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

  componentDidUpdate = () => {
    if (this.state.currentDisplay !== "Cover")
      sessionStorage.view = this.state.currentDisplay;
  };

  ChangeDisplayBackward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Chat-box":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Download":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      default:
        return;
    }
  };

  showDisplay = () => {
    const { currentDisplay } = this.state;
    const { user, receiver, messages, onSend, onGetFriends } = this.props;

    switch (currentDisplay) {
      case "Cover":
        return <Cover onRegister={this.onRegister} onLogin={this.onLogin} />;
      case "Friend-list":
        return (
          <FriendList
            onSelectFriend={this.onSelectFriend}
            forward={this.ChangeDisplayForward}
            onGetFriends={onGetFriends}
            profilePicture={user.userProfilePicture}
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
