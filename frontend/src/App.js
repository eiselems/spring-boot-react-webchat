import React from 'react';
import './App.css';

function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

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
            <div>
                <h1>
                    It is like {this.state.date.toLocaleTimeString()}.
                </h1>
                <div className="ChatHistory">
                    <p>Abcdef: This is a line of text</p>
                    <p>Abcdef: This is another line of text</p>
                    <p>Cdef: This is another line of text which is very very very very long and the guy likes to talk a
                        lot</p>
                </div>
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
            <button onClick={this.handleChange}>
                {isConnected ? 'Disconnect' : 'Connect'}
            </button>);
    }
}

class UserList extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const userList = this.props.users;
        return (
            <div className="Userlist">
                {userList.map(function (user) {
                    return React.createElement("p", {key: "user" + user}, user);
                })}
            </div>
        );
    }
}

function MessageWindow(props) {

    return (
        <div className={"MessageWindow"}>
            {props.messages.map(function (msg) {
                return React.createElement("p", {key: "msg" + msg.id}, msg.user + ": " + msg.text);
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
                    <input type="text" value={this.state.value} onChange={this.handleUserNameChange}
                           disabled={isDisabled}/>
                </label>
                <input type="submit" value="Set"/>
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
        let message = {
                id: ID(),
                user: this.props.userName,
                text: this.state.text
            };
        this.props.appendNewMessage(message)
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <label>Text:
                    <input type="text" value={this.state.value} onChange={this.handleTextChange}/>
                </label>
                <input type="submit" value="Set"/>
            </form>
        );

    }


}

class App extends React.Component {

    constructor(props) {
        super(props);
        window.app = this;
        this.state = {
            isConnected: false,
            userName: "My Name",
            users: ["Mo", "Moo", "Mooo"],
            messages: [
                {
                    id: 1,
                    user: "testUser",
                    text: "testText124551 12545"
                },
                {
                    id: 2,
                    user: "Mo",
                    text: "I am the one and only!"
                }, {
                    id: 3,
                    user: "Moo",
                    text: "Nah! You write all the bugs!"
                }
            ]
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
        } else {
            console.log("Connecting ...");
        }
        this.setState(prevState => ({
            isConnected: !prevState.isConnected
        }));
    }

    appendNewMessage(message) {

        this.setState(prevState => ({
            messages: prevState.messages.concat(message)
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
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="App-intro">
                    <Clock/>
                    <UserNameField userName={userName} onUserNameChange={this.changeUserName}
                                   connectState={connectState}/>
                    <Welcome name={userName}/>
                    <ConnectButton connectState={connectState} onConnectStateChange={this.changeConnectState}/>
                    <UserList users={users}/>
                    <MessageWindow messages={messages}/>
                    <MessageLine appendNewMessage={this.appendNewMessage} userName={userName}/>
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

export default App;
