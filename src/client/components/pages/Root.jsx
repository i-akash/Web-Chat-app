import React, { Component } from "react";
import axios from "axios";
import getSocket from "../socket/Socket";
import Show from "./Show";
import { getDateTime } from "../util/Date";

class Root extends Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      friendlist: [],
      notifications: null,
      receiver: {
        receiverName: "",
        receiverEmail: "",
        receiverProfilePicture: ""
      },
      user: {
        userName: "",
        userEmail: "",
        userProfilePicture: ""
      }
    };
    this.timer = 10 * 1000;
    this.listRef = React.createRef();
  }

  componentDidMount = () => {
    this.Interval = setInterval(() => this.onGetFriends(), this.timer);
  };

  componentWillMount = () => {
    clearInterval(this.timer);
  };

  onSort = list => {
    list.sort((a, b) => {
      let x = a.profile.userName.toLowerCase();
      let y = b.profile.userName.toLowerCase();
      return x < y ? -1 : 1;
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    let prevFriendList = prevState.friendlist;
    let currFriendList = this.state.friendlist;

    if (
      prevFriendList !== currFriendList &&
      prevFriendList.length === currFriendList.length
    ) {
      this.onSort(prevFriendList);
      this.onSort(currFriendList);

      let length = prevFriendList.length;

      for (let index = 0; index < length; index++) {
        if (
          currFriendList[index].messages.senderEmail !==
            this.state.user.userEmail &&
          prevFriendList[index].messages.message !==
            currFriendList[index].messages.message
        ) {
          let notifications = {};
          notifications.userName = currFriendList[index].profile.userName;
          notifications.message = currFriendList[index].messages.message;

          this.setState({ notifications });
          clearTimeout(this.notfy);
          this.notfy = setTimeout(
            () => this.setState({ notifications: null }),
            10 * 1000
          );
        }
      }
    }
  };

  //initialize
  initSocket = (receiver, sender) => {
    this.socket = getSocket(receiver, sender, this.addMessage);
    this.onListen();
  };

  onListen = () => {
    this.socket.on("responseMessage", msg => {
      this.addMessage(msg, "socket");
      this.socket.emit("received", "received");
    });

    this.socket.on("status", msg => console.log(msg));
  };

  //adding message

  addMessage = (message, from) => {
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.senderEmail = this.state.user.userEmail;
    messageObject.receiverEmail = this.state.receiver.receiverEmail;
    this.socket.emit("requestMessage", messageObject);
    this.addMessage(messageObject, "user");
    // axios
    //   .post("/api/save-message", { data: messageObject })
    //   .catch(error => console.log(error));
  };

  onRegister = RegisterData => {
    return axios.post("/api/register", { data: RegisterData }).then(res => {
      this.setState({
        user: {
          userName: res.data.userName,
          userEmail: res.data.userEmail,
          userProfilePicture: res.data.profilePicture
        }
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  onLogin = loginData => {
    return axios.post("/api/login", { data: loginData }).then(res => {
      this.setState({
        user: {
          userName: res.data.userName,
          userEmail: res.data.userEmail,
          userProfilePicture: res.data.profilePicture
        }
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  onRefresh = userEmail => {
    return axios
      .post("/api/current-user", { data: { userEmail } })
      .then(res => {
        this.setState({
          user: {
            userName: res.data.userName,
            userEmail: res.data.userEmail,
            userProfilePicture: res.data.profilePicture
          }
        });
        return res;
      });
  };

  onAddFriend = userEmail =>
    axios.post("/api/add-friend", {
      data: {
        friendEmail: userEmail,
        myEmail: this.state.user.userEmail,
        date: getDateTime()
      }
    });

  onSelectFriend = friendData => {
    this.setState({
      receiver: {
        receiverName: friendData.userName,
        receiverEmail: friendData.userEmail,
        receiverProfilePicture: friendData.profilePicture
      }
    });

    const receiver = friendData.userEmail;
    const sender = this.state.user.userEmail;
    if (this.socket) this.socket.close();
    this.initSocket(receiver, sender);
    //get last 10 message
    return axios
      .post("/api/get-message", {
        data: {
          receiver,
          sender
        }
      })
      .then(res => {
        this.setState({ messages: res.data.messages });
        return res;
      })
      .catch(error => console.log(error));
  };

  onGetFriends = () =>
    axios
      .post("/api/get-friends", {
        data: { userEmail: this.state.user.userEmail }
      })
      .then(res => {
        this.setState({ friendlist: res.data.Friendlist });
        return res;
      });

  onGetSocket = () => this.socket;
  //render
  render() {
    const { user, receiver, messages, friendlist, notifications } = this.state;

    return (
      <div>
        <Show
          onLogin={this.onLogin}
          onRegister={this.onRegister}
          onSend={this.onSend}
          onSelectFriend={this.onSelectFriend}
          onGetFriends={this.onGetFriends}
          onRefresh={this.onRefresh}
          onAddFriend={this.onAddFriend}
          onGetSocket={this.onGetSocket}
          user={user}
          receiver={receiver}
          messages={messages}
          friendlist={friendlist}
          notifications={notifications}
        />
      </div>
    );
  }
}

export default Root;
