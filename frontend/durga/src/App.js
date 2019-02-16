import React, { Component } from 'react';
import WebSocketHandler from './components/handlers/WebSocketHandler';

class App extends Component {
  constructor(props) {
    super(props);
    const ws = new WebSocketHandler('ws://localhost:8000/api/host/overview', this.onMessage);
    // ws.send(JSON.stringify({'command': 'open-directory', 'directory': 'test'}));
    // ws.send(JSON.stringify({'command': 'authentication'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'cd Documents/uni/'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'cd intro_vision_and_robotics'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'cat main-complete\(4\)-2.p'}));    
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'cd ..'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'ls'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'cd s1766404'}));
    // ws.send(JSON.stringify({'command': 'run-cmd', 'cmd': 'ls'}));

    // ws.send(JSON.stringify({'command': 'open-directory', 'directory': 'IVR-assignment'}));
    // ws.send(JSON.stringify({'command': 'open-file', 'file': 'main.py'}));
  }

  onMessage(data) {
    console.log(data);
  }

  render() {
    return (
      <div className="App">
        Hello
      </div>
    );
  }
}

export default App;
