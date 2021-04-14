let environment;
let other_players = [];
let size;
let socket;
let player;
let timer = 0;
let gameover = false;


//called whe the player just joins and the data is loaded
function setup() {
    socket = io.connect(window.location.hostname);
    createCanvas(windowWidth, windowHeight);
    environment = new Enviornment();
    socket.on('number_of_players', Spawn_with_players);
    socket.on('updated_player_length', Spawn_new_players);
    socket.on('player_data', RestUpdate);
    socket.on('shoot', other_player_shoot);
    socket.on('left', updatePLayers);
    socket.on('someone_got_hit', updateHitDate);
    socket.on('someone_hit_me', someoneHitMe);
    socket.on('kills_badhao_mera', killsPlusPlus);
    player = new Player(environment);
    player.bgm.loop();
    player.username = userName;
    textAlign(CENTER);
    cursor(CROSS);
    camera.zoom = 2;
}

//whenever there is a decrease in number of players or a player disconnects
function updatePLayers(players_id) {

    for (let i = 0; i < other_players.length; i++) {
        if (other_players[i].id === players_id) {
            for (let j = 0; j < player.enemies.length; j++) {
                if (other_players[i].sprite == player.enemies[j]) {
                    player.enemies.splice(j, 1);
                    break;
                }
            }
            other_players[i].sprite.remove();
            other_players[i].healthbarBzckground.remove();
            other_players[i].healthbar.remove();
            other_players.splice(i, 1);
            break;
        }
    }


}


//whenever a player spawns
function Spawn_with_players(players) {
    player.id = players[players.length - 1];
    // console.log(player.id);
    for (let i = 0; i < players.length - 1; i++) {
        other_players[i] = new Player(environment);
        other_players[i].id = players[i];
        // console.log("player added");
    }
    for (let i = 0; i < other_players.length; i++) {
        player.enemies.push(other_players[i]);
        // console.log("ok_done");
    }
}

//when a new player connects
function Spawn_new_players(players) {
    other_players.push(new Player(environment));
    other_players[other_players.length - 1].id = players[players.length - 1];
    console.log(other_players.length);
    player.enemies.push(other_players[other_players.length - 1]);
}

//rendering loop
function draw() {
    background(0);
    update();
    collision();
    drawSprites();
    // console.log(frameRate());

    // if (player.health !== 100) {
    //     if (millis() >= 1000 + timer) {
    //         player.takeDamage(-1);
    //         timer = millis();
    //     }
    // }
    
    if (gameover) {
        $('#game-over').show();
        $('canvas').hide();
        socket.disconnect();
        fill('yellow');
        textSize(30);
        text('GAME-OVER', player.x, player.y - 100);
        player.bgm.stop();

        $('#play-again').click(playAgain);
        noLoop();
    }
}

function playAgain() {
    location.reload();
}

//collision detection
function collision() {
    player.collision(environment.env_collider);
    for (let i = 0; i < other_players.length; i++) {
        // player.sprite.collide(Players[i].sprite);
        for (let j = 0; j < other_players[i].bullets.length; j++) {
            if (player.sprite.overlap(other_players[i].bullets[j].bulletsprite)) {
                var hit_data = {
                    Player_id: player.id,
                    Enemy_id: other_players[i].id,
                    Bullet_index: j
                }
                socket.emit('Player_got_hit', hit_data);
                //iHitSomeone(other_players[i].id);
                player.takeDamage(10);
                other_players[i].destroy(other_players[i].bullets, j);
                // console.log("hit");
            }
        }
    }
}



function iHitSomeone(oid) {
    hit_data = [oid, player.id];
    socket.emit('i_hit_someone', hit_data);
    // console.log('ouch with sarcasm')
}

function someoneHitMe(hit_data) {
    if (player.id === hit_data[0]) {
        console.log(player.health);
        let pid = hit_data[1];
        if (player.health <= 10) {
            socket.emit('increase_kill_count', pid);
            gameOver();
        }
    }
}

function killsPlusPlus() {
    player.kills++;
    console.log(player.kills)
}

//shoot functionality of the player
function mousePressed() {

    player.shoot(camera.mouseX, camera.mouseY, camera.position.x, camera.position.y);
    let shoot_data = {
        mouse_x: camera.mouseX,
        mouse_y: camera.mouseY,
        camera_x: camera.position.x,
        camera_y: camera.position.y,
        Player_id: player.id
    }
    socket.emit('shoot', shoot_data);
}

//shoot function
function other_player_shoot(shoot_data) {
    other_players.forEach(op => {
        if (op.id === shoot_data.Player_id) {
            op.shoot(shoot_data.mouse_x, shoot_data.mouse_y, shoot_data.camera_x, shoot_data.camera_y);
        }
    })
}

//player update function to send data to the server 
function update() {
    camera.position.x = player.x;
    camera.position.y = player.y;
    fill(255);
    text(player.username, player.x, player.y - 60);
    text('KILLS: ' + player.kills, player.x, player.y - 130);

    player.update();

    let all_data = {
        Player_x: player.sprite.position.x,
        Player_y: player.sprite.position.y,
        Player_id: player.id,
        Player_health: player.health,
        Player_name: player.username,
    }
    //sending the updated player data to the server
    socket.emit('player_data', all_data);

    for (let i = 0; i < other_players.length; i++) {
        fill(255, 0, 0);
        text(other_players[i].username, other_players[i].sprite.position.x, other_players[i].sprite.position.y - 60);
    }
}


//called whenever the client receives the data of the other players
function RestUpdate(all_data) {
    for (let i = 0; i < other_players.length; i++) {
        if (other_players[i].id === all_data.Player_id) {
            other_players[i].sprite.position.x = all_data.Player_x;
            other_players[i].sprite.position.y = all_data.Player_y;
            other_players[i].username = all_data.Player_name;
            if (other_players[i].health !== all_data.Player_health) {
                other_players[i].takeDamage(other_players[i].health - all_data.Player_health);
            }
            other_players[i].update();
        }
    }
}

function updateHitDate(hit_data) {
    for (let i = 0; i < other_players.length; i++) {
        if (other_players[i].id == hit_data.Enemy_id) {
            other_players[i].destroy(other_players[i].bullets, hit_data.Bullet_index);
            // console.log("ok");
        }
    }
}

function gameOver() {
    console.log('game over')
    gameover = true;
}


//resizing the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // console.log(windowHeight);
    // console.log(windowWidth);
}