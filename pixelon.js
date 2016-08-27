module.exports = Pixelon;

// a game class, it needs to implement the following:
//  1) property: game_speed
//  2) method: tick()
//  3) method: process_input(player, input)
//  4) method: new_player()  // TODO player name is parameter, not return value of
//  5) method: get_game_state(player)

function Pixelon(){
    // time interval between game ticks
    this.game_speed = 500;

    // game state
    this.state = {
        grid: {},
        player_info: {},
        iteration: 0,
        // new_events: {}, 
    }

    // TODO remove this I think
    this.size_x = 62;
    this.size_y = 24;

    // TODO remove this damn thing
    this.arbitrary_number_for_names = 0;
}


Pixelon.prototype.new_player = function(){
    var player_name = this.arbitrary_number_for_names++;

    // generate starting square
    var [x, y] = [0, 0];
    var loop_counter = 0;
    do {
        x = Math.floor(Math.random(3, this.size_x-3))
        y = Math.floor(Math.random(3, this.size_y-3))
        if(loop_counter > 100){
            return;  // this will probably make everything fail
        }
    } while(this._grid_spot_taken(x, y));

    // create the players info
    this.state.player_info[player_name] = {
        dir: "up",
        pos: {x: x, y: y},
    };

    return player_name;
}

Pixelon.prototype.process_input = function(player, input){
    //if("direction" in input){
        this.state.player_info[player].dir = input.utf8Data;
    //}
}

Pixelon.prototype.tick = function(){
    // update any blocks that are disappearing first, as we need 
    // don't want to give advantage to the players due to their list order

    // update all not dead players positons, and kill them if they hit anything
    for(var player in this.state.player_info){
        var info = this.state.player_info[player];
        
        // process movement
        var dir = info["dir"];
        var pos = info.pos;
        if(dir == "up"){
            pos.y++;
        } else if(dir == "down"){
            pos.y--;
        } else if(dir == "right"){
            pos.x++;
        } else if(dir == "left"){
            pos.x--;
        }

        // kill the player if their position is bad
        // TODO
    }
}

Pixelon.prototype.get_game_state = function(player){
    return {
        grid: this.state.grid,
        time: this.state.iteration,
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
