module.exports = Pixelon;
// import clone from 'lodash/clone';

// a game class, it needs to implement the following:
//  1) property: game_speed
//  2) method: tick()
//  3) method: process_input(player, input)
//  4) method: new_player()  // TODO player name is parameter, not return value of
//  5) method: get_game_state(player)

debugging = false;
for(var i=2; i<process.argv.length; i++){
    var arg = process.argv[i];
    if(arg.indexOf('debugging') > -1){
        debugging = true;
    }
}

function debug(...args){
    if(debugging == true){
        console.log(args);
    }
}

function Pixelon(){
    // time interval between game ticks
    this.game_speed = process.env.GAME_SPEED || 200;

    // game state
    this.state = {
        grid: {},
        player_info: {},
        iteration: 0,
        events: [],
        // new_events: {}, 
    }

    // TODO remove this I think
    this.size_x = 78;
    this.size_y = 20;

    // TODO remove this damn thing
    //this.arbitrary_number_for_names = 0;
}


Pixelon.prototype.new_player = function(player_name){
    //var player_name = this.arbitrary_number_for_names++;
    console.log('game -- created new player name ' + player_name + ' with real name: ' + player_name);

    // generate starting square
    var x = Math.floor(3+Math.random()*this.size_x-3);
    var y = Math.floor(3+Math.random()*this.size_y-3);
    var loop_counter = 0;
    do {
        x = Math.floor(3+Math.random()*this.size_x-3);
        y = Math.floor(3+Math.random()*this.size_y-3);

        // don't go forever looking for a position, fail sometime
        loop_counter++;
        if(loop_counter > 100){
            console.log('game -- failed to find a valid starting position');
            return;  // this will probably make everything fail
        }
    } while(this._grid_spot_taken(x, y));

    // create the players info
    this.state.player_info[player_name] = {
        previous_dir: false,
        dir: false,
        pos: {x: x, y: y},
        previous_pos: [{x: x, y: y}],
    };

    //console.log('game -- created new player with info: ', this.state.player_info[player_name]);
    return player_name;
}

Pixelon.prototype.process_input = function(player, input){
    console.log('game -- recieved input from player ' + player + ': ', input);
    var info = this.state.player_info[player];
    //if("direction" in input){  ??? 
    if(player in this.state.player_info){
        var new_dir = input;
        // don't go back on yourself
        //console.log(info.previous_dir);
        //console.log(new_dir);
        if(info.previous_dir != new_dir){
            var ud = ["up", "down"];
            var lr = ["left", "right"];
            var backwards = ud.indexOf(info.previous_dir) >= 0  && ud.indexOf(new_dir) >= 0;
            backwards = backwards || (lr.indexOf(info.previous_dir) >= 0 && lr.indexOf(new_dir) >= 0);
            if( backwards ){
                // don't go back on yourself
                //console.log('back on yourself...');
            } else {
                info.dir = new_dir;
            }
        }
    } else {
        // dead player has no input
    }
}

Pixelon.prototype.tick = function(){
    //console.log('game -- tick');
    this.state.events = [];
    // update any blocks that are disappearing first, as we need 
    // don't want to give advantage to the players due to their list order
    
    //console.log('robin');
    // update the grid
    //  1) for old player locations
    for(var player in this.state.player_info){
        var info = this.state.player_info[player];
        // only update if player is moving
        if(info.dir){
            var pos = info.pos;
            //console.log(pos);
            var grid = this.state.grid;
            grid[pos.x + '|' + pos.y] = {p: player, old: true};
        }
    }

    // update all not dead players positons
    for(var player in this.state.player_info){
        var info = this.state.player_info[player];

        info.previous_dir = info.dir;
        
        // process movement
        var dir = info.dir;
        var pos = info.pos;
        if(dir == "up"){
            pos.y--;
        } else if(dir == "down"){
            pos.y++;
        } else if(dir == "right"){
            pos.x++;
        } else if(dir == "left"){
            pos.x--;
        }
    }
    //console.log('c', pos);

    // process player deaths if their position is bad or whatever
    for(var player in this.state.player_info){
        var dead = false;

        var info = this.state.player_info[player];
        var pos = info.pos;
        var grid = this.state.grid;

        // is position is taken in the grid, dead
        //console.log(pos.x < 0 || pos.x >= this.size_x || pos.y < 0 || pos.x >= this.size_y);
        //console.log('fuck', pos.y, this.size_y);
        if(pos.x < 0 || pos.x >= this.size_x || pos.y < 0 || pos.y >= this.size_y){
            //console.log('robin1');
            dead = true;
        } else if((pos.x+'|'+pos.y) in grid){
            //console.log('robin2');
            //console.log('a', grid[pos.x+'|'+pos.y]);
            if(grid[pos.x+'|'+pos.y].p == player && !('old' in grid[pos.x+'|'+pos.y])){
                // we can't kill ourselves with our own head
            } else {
                dead = true;
            }
        }
        //console.log('b', grid[pos.x+'|'+pos.y]);

        if(dead){
            info.dead = true;
        }
    }

    // update the grid and positions
    //  1) remove dead players
    var dead_players = []
    for(var player in this.state.player_info){
        //console.log('checking if player '+player+' is dead');
        var info = this.state.player_info[player];
        if('dead' in info){
            //console.log('they are');
            dead_players.push(player);
        }
    }
    //console.log(dead_players);
    dead_players.forEach((dead_player) => {
        var info = this.state.player_info[dead_player];

        console.log('game -- player ' + dead_player + ' has died!');
        var grid = this.state.grid;

        // TODO add event to only relevent players
        var death_event = {'death': dead_player, 'pos': info.previous_pos};
        //console.log('death: ', death_event);
        this.state.events.push(death_event);

        for(var gridspot in grid){
            if(grid[gridspot].p == dead_player){
                delete grid[gridspot];
            }
        }
        delete this.state.player_info[dead_player];
    });
    //  2) new player locations
    for(var player in this.state.player_info){
        var info = this.state.player_info[player];
        var pos = info.pos;
        var grid = this.state.grid;
        // don't add a new position to the list if it's the same as the last
        if(!this._points_equal(pos, info.previous_pos[info.previous_pos.length-1])){
            info.previous_pos.push({x: pos.x, y: pos.y});
        }
        grid[pos.x + '|' + pos.y] = {p: player};
    }

    //console.log('game -- current state: ', this.state);
}

Pixelon.prototype.get_game_state = function(player){
    return {
        player: player,
        grid: this.state.grid,
        time: this.state.iteration,
        events: this.state.events
    }
}


////////////////////////
// Private functions

Pixelon.prototype._grid_spot_taken = function(x, y){
    // wtf there's no range function in nodejs
    for(var i in [-2, -1, 0, 1, 2]){
        for(var j in [-2, -1, 0, 1, 2]){
            if((x+i)+'|'+(y+j) in this.state.grid){
                return true;
            }
        }
    }
    return false;
}

Pixelon.prototype._points_equal = function(p, q){
    return(p.x == q.x && p.y == q.y);
}
