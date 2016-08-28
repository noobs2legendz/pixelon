require('repl');
// this server runs the pixelon game
var redisClient = require('redis').createClient(process.env.REDIS_URL);
var Pixelon = require('./server/games/pixelon');
var pixelon_game = new Pixelon();
// create a multiplayer game server, so we can pass it new client connections when we get them
MultiplayerGameServer = require('./server/multiplayer_game_server');
multipler_game_server = new MultiplayerGameServer(pixelon_game);

// create base HTTP server to pass to the websocket server
var http = require('http');
var server = http.createServer(function(request, response) {
    /* we probably don't want anything here, this is a websockets server */ });
server.listen(process.env.PORT || 1337, function() { });

// create websocket server which handles creating a connection and passing it
// to the game, then we sit back and wait for clients
WebSocketServer = require('websocket').server;
websocket_server = new WebSocketServer({ httpServer: server });
websocket_server.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    multipler_game_server.new_client(connection); } )

console.log('Server Has Started!');

// Normal web server
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(process.env.PORT || 8000);
