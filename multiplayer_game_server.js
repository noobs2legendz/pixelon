module.exports = MulticlientGameServer;

// This class handles:
// 1) the game's main loop
// 2) passing input from clients to the game
// 3) passing output from game to the clients
// 4) new / leaving clients

function MulticlientGameServer(game){
    // the actual game
    this.game = game;

    // the interval at which the game is computed and clients are updated.
    var self = this;
    setInterval(function(){ self.main_loop() }, game.game_speed);
    // TODO setIntervalIncludingFunctionRuntime ??? via setTimeout and new Date() I mean ???

    // current list of clients, {names: websocket connections}
    this.clients = {}
}

MulticlientGameServer.prototype.main_loop = function(){
    // compute a game tick
    this.game.tick();

    // send the clients their data
    for(var client in this.clients){
        this.update_client(client);  // we could make this only send updates
    }
}

MulticlientGameServer.prototype.new_client = function(connection){
    var self = this;

    var client_name = this.game.new_player(); // TODO move this shortly

    // create links from name to connection and visa versa
    this.clients[client_name] = connection;
    connection.client_name = client_name;

    // client sends us something
    connection.on('message', function(message){
        var input = JSON.stringify(message);
        // TODO move game new client to here, via:
        // if join game in input
        //   name = message['name']
        //   if name taken:
        //      connection.sendUTF8(...)
        //   this.game.new_client
        // else
        self.game.process_input(client_name, input);
    });

    // client leaves ...
    connection.on('close', function(connection){
        self.client_leaves(client_name);
    });

    // give the client an immediate update
    this.update_client(client_name);
}

MulticlientGameServer.prototype.client_leaves = function(connection){
    delete this.clients[connection];
    // let everyone who's still here know, maybe
    for(var client in this.clients){
        //socket = clients[client];
        //socket.sendUTF( names.DISCONNECT + '|' + client ???? ) ???
    }
}

MulticlientGameServer.prototype.update_client = function(client){
    // we call this to send the client the current state of the game
    socket = this.clients[client];
    socket.sendUTF(JSON.stringify(this.game.get_game_state(client)));
}
