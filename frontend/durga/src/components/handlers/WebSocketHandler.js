export default class WebSocketHandler {
    constructor(url, callback) {
       this.socket = new WebSocket(url);
       this.callback = callback;
       this.isConnected = false;
       this.queue = [];
       this.setupConnection();
    }

    setupConnection() {
       this.socket.addEventListener('open', this.onConnect.bind(this));
       this.socket.addEventListener('close', this.onDisconnect.bind(this));
       this.socket.addEventListener('message', this.onMessage.bind(this));
    }

    onConnect() {
        this.isConnected = true;
        this.sendCommandsInQueue();
    }

    sendCommandsInQueue() {
        this.queue.forEach(item => this.send(item));
        this.queue = [];
    }

    send(data) {
        if(this.isConnected) {
            this.socket.send(data);
        } else {
            this.queue.push(data);
        }
    }

    onMessage(message) {
        this.callback(message.data);
    }

    onDisconnect() {
        this.isConnected = false;
    }
}