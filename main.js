/*function connect_to_websocket() {
    document.write('start as well');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://10.0.73.141:1337');

    connection.onopen = function () {
        // connection is opened and ready to use
        document.write('ok then');
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
        document.write('error, man!!!');
        document.write(error);
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            document.write(message.data);
            //var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
    };
};
connect_to_websocket(); */