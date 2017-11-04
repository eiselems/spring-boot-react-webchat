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
                    <input type="text" value={this.state.value} onChange={this.handleUserNameChange} disabled={isDisabled} />
                </label>
                <input type="submit" value="Set"/>
            </form>
        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            userName: "My Name"
        };

        this.changeConnectState = this.changeConnectState.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
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

    render() {
        const connectState = this.state.isConnected;
        const userName = this.state.userName;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    <Clock/>
                    <UserNameField userName={userName} onUserNameChange={this.changeUserName} connectState={connectState}/>
                    <Welcome name={userName}/>
                    <ConnectButton connectState={connectState} onConnectStateChange={this.changeConnectState}/>
                </p>
            </div>
        );
    }
}


export default App;
