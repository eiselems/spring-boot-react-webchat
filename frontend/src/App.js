import React from 'react';
import SockJS from 'sockjs-client'
import './App.css';

class Clock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div className="Clock">
                {this.state.date.toLocaleTimeString()}
            </div>
        )
    };
}

class ConnectButton extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onConnectStateChange();
    }

    render() {
        const isConnected = this.props.connectState;
        return (
            <button className="Button" onClick={this.handleChange}>
                {isConnected ? 'Disconnect' : 'Connect'}
            </button>);
    }
}

function UserList(props) {
    return (
        <div className="Userlist">
            {props.users.map(function (user) {
                return <p key={ID()}>{user}</p>;
            })}
        </div>
    );
}

function MessageWindow(props) {

    return (
        <div className={"MessageWindow"}>
            {props.messages.map(function (msg) {
                console.log(msg);
                return <p key={ID()}>{msg.reference}: {msg.content}</p>;
            })}
        </div>
    );
}

class UserNameField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: this.props.userName};

        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onUserNameChange(this.state.value);
    }

    handleUserNameChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const isDisabled = this.props.connectState;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Username:

                </label>
                <input type="text" value={this.state.value} onChange={this.handleUserNameChange}
                       disabled={isDisabled}/>
                <input type="submit" value="Set Name" hidden={isDisabled}/>
            </form>
        );
    }
}

class MessageLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ""};
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.appendNewMessage(ID(), this.props.userName, this.state.text);
        this.props.sock.send(createMessage("sendText", this.state.userName, this.state.text));
        this.setState({text: ""})
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    render() {
        const isDisabled = !this.props.connectState;
        return (
            <form onSubmit={this.onSubmit}>
                <textarea className="TextLine" value={this.state.text} onChange={this.handleTextChange}
                          disabled={isDisabled}/>
                <input className="Button" type="submit" value="Send" disabled={isDisabled}/>
            </form>
        );

    }


}

class App extends React.Component {

    constructor(props) {
        super(props);
        window.app = this;
        this.sock = null;

        this.state = {
            isConnected: false,
            userName: "My Name",
            users: [],
            messages: []
        };

        this.changeConnectState = this.changeConnectState.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
        this.appendNewMessage = this.appendNewMessage.bind(this);
    }


    changeUserName(userName) {
        this.setState(prevState => ({
            userName: userName
        }))
    }

    changeConnectState() {


        if (this.state.isConnected) {
            console.log("Disconnecting ...");
            this.setState(prevState => ({
                isConnected: false,
                users: []
            }));
            this.sock.close();
        } else {
            this.setState(prevState => ({
                isConnected: true
            }));

            this.sock = new SockJS('http://' + window.location.hostname + ':8080/gs-guide-websocket')


            this.sock.onopen = function () {
                console.log('open');
                console.log(this.state);
                this.sock.send(createMessage("connect", this.state.userName, null));
            };
            this.sock.onmessage = function (e) {
                console.log(e);
                let json = JSON.parse(e.data);
                console.log('message', json);

                if (json.messageType === "connect") {
                    this.appendNewMessage(ID(), "SYS", json.reference + " has connected.");
                    this.setState(prevState => ({
                        users: prevState.users.concat(json.reference)
                    }));
                } else if (json.messageType ==="disconnect") {
                    this.appendNewMessage(ID(), "SYS", json.reference + " has left.");
                    var users = this.state.users.filter(function(user) { return user !== json.reference });
                    this.setState(prevState => ({
                        users: users
                    }));
                } else if (json.messageType === "text") {
                    this.appendNewMessage(ID(), json.reference, json.content);
                } else if (json.messageType === "userList") {
                    console.log(json);
                    this.setState(prevState => ({
                        users: prevState.users.concat(JSON.parse(json.content))
                    }));
                }

            };
            this.sock.onclose = function () {
                console.log('close');
            };

            this.sock.onopen = this.sock.onopen.bind(this);
            this.sock.onmessage = this.sock.onmessage.bind(this);


            //this.sock.onopen = this.sock.onmessage.bind(this);


        }
    }

    appendNewMessage(id, userName, message) {
        let msg = {};
        msg.id = id;
        msg.reference = userName;
        msg.content = message;
        console.log("appending new message");
        this.setState(prevState => ({
            messages: prevState.messages.concat(msg)
        }));
    }

    render() {
        const connectState = this.state.isConnected;
        const userName = this.state.userName;
        const users = this.state.users;
        const messages = this.state.messages;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Mo Chat</h1>
                    <Clock/>
                </header>
                <div className="Settings">
                    <UserNameField userName={userName} onUserNameChange={this.changeUserName}
                                   connectState={connectState}/>
                    <ConnectButton connectState={connectState} onConnectStateChange={this.changeConnectState}/>
                </div>
                <div className="Center">
                    <MessageWindow messages={messages}/>
                    <UserList users={users}/>
                </div>
                <div className="Footer">
                    <MessageLine appendNewMessage={this.appendNewMessage} sock={this.sock} userName={userName}
                                 connectState={connectState}/>
                </div>
            </div>
        );
    }
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

var createMessage = function (messageType, reference, content) {
    let msg = {};
    msg.messageType = messageType;
    msg.reference = reference;
    msg.content = content;
    return JSON.stringify(msg);
};

export default App;
