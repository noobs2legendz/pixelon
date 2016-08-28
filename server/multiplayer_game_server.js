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
    setInterval(() => { this.main_loop() }, game.game_speed);
    // TODO setIntervalIncludingFunctionRuntime ??? via setTimeout and new Date() I mean ???

    // current list of clients, {names: websocket connections}
    this.client_connections = {}
    this.client_player_names = {}
    //this.player_client_names = {}

    // arbitrary numbering of clients
    this.arbitrary_client_number = 0;
}

MulticlientGameServer.prototype.main_loop = function(){
    // compute a game tick
    this.game.tick();

    // send the clients their data
    for(var client in this.client_player_names){
        this.update_client(client);  // we could make this only send updates
    }
}

MulticlientGameServer.prototype.new_client = function(connection){
    // create links from name to connection and visa versa
    var client_name = this.arbitrary_client_number++;
    this.client_connections[client_name] = connection;
    connection.client_name = client_name;

    console.log('server -- new client ' + client_name + ' at ' + connection.remoteAddress);

    // client sends us something
    connection.on('message', (message) => {
        console.log('server -- recieved message: ', message);
        var input = JSON.parse(message.utf8Data);
        if(!('type' in input)){
            console.log('server -- bad message :(');
            return;
        } else {
            if(input.type == 'start'){
                // start a new game with the given name
                this.game.new_player(client_name); // TODO move this shortly
                this.client_player_names[client_name] = input.name;
                //this.player_client_names[input.name] = client_name
                //console.log('robin', this.client_player_names);
                
                // give the client an immediate update
                this.update_client(client_name);
            } else {
                if(!(client_name in this.client_player_names)){
                    // can't send anything without first starting
                } else {
                    //var player_name = this.client_player_names[client_name];
                    var player_name = client_name;
                    // TODO remove this from server code
                    dir = input.direction;
                    
                    // if it's not a server input, pass it to the game
                    this.game.process_input(player_name, input.direction);
                }
            }
        }
    });

    // client leaves ...
    connection.on('close', (connection) => {
        this.client_leaves(connection);
    });

}

MulticlientGameServer.prototype.client_leaves = function(connection){
    delete this.client_player_names[connection.client_name];
    delete this.client_connections[connection.client_name];
    // let everyone who's still here know, maybe
    for(var client in this.clients){
        //socket = clients[client];
        //socket.sendUTF( names.DISCONNECT + '|' + client ???? ) ???
    }
}

MulticlientGameServer.prototype.update_client = function(client){
    //console.log('update_client');
    // we call this to send the client the current state of the game
    var socket = this.client_connections[client];
    var player_name = client; //this.client_player_names[client];
    var game_data = this.game.get_game_state(player_name);

    // THIS IS
    game_data.player = client;

    // TODO HAX ARE HERE
    /*
    for(var grid_spot in game_data.grid){
        var grid_thing = game_data.grid[grid_spot];
        grid_thing.p = this.player_client_names[player_name];
    }
    if(game_data.events.length){
        for(var i in game_data.events){
            the_event = game_data.events[i];
            if('death' in the_event){ // is actually death event
                the_event.death = client;
            }
        }
    }
    console.log(game_data);
    */

    socket.sendUTF(JSON.stringify(game_data));
}
