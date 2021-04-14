const express = require('express');
const app = express();
const server = app.listen(2000);
const socket = require('socket.io');
const io = socket(server);

let players = 0;
let player_id = [];

app.use(express.urlencoded({extended: true}));

// routes
app.use('/', express.static(__dirname + '/public'));
console.log('app is running on 2000')

//socket initialization
// io.pingInterval=100;

io.on('connection', newConnection);

//function whenever a new cnnection is made
function newConnection(socket) {
    console.log('Connnected: ' + socket.id);
    player_id.push(socket.id);
    players++;
    //function if this socket ever disconnects
    socket.on("disconnect", (reason) => {

        console.log(reason);
        Disconnect(socket);

    });
    socket.emit('number_of_players', player_id);
    socket.broadcast.emit('updated_player_length', player_id);
    socket.on('player_data', playerdata);
    socket.on('shoot', Shoot);
    socket.on('Player_got_hit',PlayerHit);
    socket.on('i_hit_someone', hit)
    socket.on('increase_kill_count', increaseKillCount);

    function Shoot(shoot_data) {
        socket.broadcast.emit('shoot', shoot_data);
        //console.log(shoot_data);
    }

    function playerdata(all_data) {
        socket.broadcast.emit('player_data', all_data);
        //console.log(all_data);
    }

    function PlayerHit(hit_data){
        socket.broadcast.emit('someone_got_hit',hit_data);
    }

    function increaseKillCount(pid) {
        socket.to(pid).emit('kills_badhao_mera');
    }

    function hit(hit_data) {
        //console.log(hit_data[0])
        socket.broadcast.emit('someone_hit_me',hit_data);
    }
}

//whenever one of the player dissonects
function Disconnect(socket) {
    players--;
    console.log("Disconnected:  " + socket.id);
    for (let i = 0; i < player_id.length; i++) {
        if (player_id[i] === socket.id) {
            socket.broadcast.emit('left', player_id[i]);
            player_id.splice(i, 1);
            break;
        }
    }

}