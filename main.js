var _ = require('lodash');
WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

/////////////////////
// create inital grid
// create ALL THE THINGS
var state = {
	"iteration": 0,
    "grid": {},
	"players": {},
}

console.log("starting");

function render_state_for_player(player){
	// what the server sends to the specified player each tick

	// todo add / remove things the players need to see, such as:
	//	- direction they are going
	//  - their current score
	//  - remove invisible enemies
	return {'grid': state["grid"], 'time': state["iteration"]};
}

function new_player(player, connection){
    player_start_x = 10 + player*5;
    player_start_y = 10 + player*5;
	// new player set up
	state["players"][player] = {}

	player_data = state["players"][player];
	player_data["score"] = 0;
	player_data["position"] = {"x": player_start_x, "y": player_start_y};
	player_data["direction"] = "up";
	player_data["connection"] = connection;

	// add the player to the full grid, or we can do this next tick if we comment this
	state["grid"][player_start_x+'|'+player_start_y] = {'p': player};
}

function game_function(){
	// do something every tick here
	state["iteration"]++;

	for(var player in state["players"]){

		// ignore dead players
		console.log(state);
		player_data = state["players"][player];
		if("dead" in player_data){
			continue;
		}

		// score
		player_data["score"]++;

		// move the player
		player_pos_x = player_data["position"]["x"];
		player_pos_y = player_data["position"]["y"];
		direction = player_data["direction"];
		if(direction == "up"){            // UP
			player_data["position"]["y"] += 1;
		} else if(direction == "down"){   // DOWN
			player_data["position"]["y"] -= 1;
		} else if(direction == "right"){  // RIGHT
			player_data["position"]["x"] += 1;
		} else {                          // LEFT
			player_data["position"]["x"] -= 1;
		}
		state["grid"][player_pos_x + '|' + player_pos_y] = {'p': player, 'old': true};
		state["grid"][player_data["position"]["x"] + '|' + player_data["position"]["y"]] = {'p': player};

		// kill players if they need killing

		// 

	}
}


// MAIN GAME LOOP
setInterval(compute_and_emit, 500);
function compute_and_emit(){
	// compute the tick
	game_function();

	// send clients what they need
	for(var player in state["players"]){
		var player_data = state["players"][player];
		var connection = player_data["connection"];
		connection.sendUTF(JSON.stringify(render_state_for_player(player)));
	}
}

// WebSocket server
var players = 0;
wsServer.on('request', function(request) {
    // someone has connected
    //
	console.log("request function");
    var connection = request.accept(null, request.origin);

	new_player(players, connection);
	connection.player_id = players;
    players++;

    connection.sendUTF('hello');
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    //*
    connection.on('message', function(message) {
        player_data = state["players"][connection.player_id];
		// update player direction
		str_message = JSON.stringify(message);
		console.log('got a message: '+message.utf8Data);
        new_dir = message.utf8Data;
        old_dir = player_data["direction"]
        if(old_dir != new_dir){
            if( (old_dir in ['up', 'down'] && new_dir in ['up', 'down']) || 
                (old_dir in ['left', 'right'] && new_dir in ['left' , 'right'])){
                // don't go back on yourself...
            } else {
                player_data["direction"] = message.utf8Data;
            }
        }
    });
    

    connection.on('close', function(connection) {
        console.log('hello');
    });
    // */
});

