let player_image;
let gunshot;
let bgm;

function preload() {
    player_image = loadImage('images/player_img.png');
    gunshot=loadSound('sounds/gunshot.wav');
    bgm=createAudio('sounds/bgm.wav');
}

function Player(environment) {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 20;
    this.speed = 4
    this.bullets = []
    this.scale = 0.5;
    this.destructibles = environment.env_collider;
    this.enemies = [];
    this.id;
    this.health = 100;
    this.RenderDist = 300;
    this.offset = 0;
    this.regeneration;
    this.image=player_image;
    this.kills = 0;
    this.bgm=bgm;
    this.username;

    // player body sprite
    this.sprite = createSprite(
        width / 2,
        height / 2,
        100 * this.scale,
        100 * this.scale
    );
    this.sprite.addImage(this.image);
    // healthbar background sprite
    this.healthbarBzckground = createSprite(
        width / 2,
        height / 2 - 50,
        200 * this.scale,
        15 * this.scale
    );
    //healthbar sprite
    this.healthbar = createSprite(
        width / 2,
        height / 2 - 50,
        200 * this.scale,
        10 * this.scale
    );
    //friction of the player
    const FRICTION = 0.23;
    this.sprite.friction = FRICTION;

    //color of the various sprites
    this.sprite.shapeColor = color(random(20, 200), 0, random(200));
    this.healthbarBzckground.shapeColor = color('grey');
    this.healthbar.shapeColor = color(0, 255, 0);

    this.sprite.setCollider("circle");
    //this.sprite.debug = true;

    //update loop for the player
    this.update = function () {
        this.x = this.sprite.position.x;
        this.y = this.sprite.position.y;
        this.healthbar.position.x = this.x + this.offset;
        this.healthbar.position.y = this.y - 50;
        this.healthbarBzckground.position.x = this.x;
        this.healthbarBzckground.position.y = this.y - 50;

        //console.log(this.bullets.length);

        if (keyIsDown(UP_ARROW) || keyDown('w')) {
            // if (this.y + (-1*20) > 0)
            this.moveY(-1);

        }
        if (keyIsDown(DOWN_ARROW) || keyDown('s')) {
            // if (this.y + (1*20) < height)
            this.moveY(1);

        }
        if (keyIsDown(LEFT_ARROW) || keyDown('a')) {
            // if (this.x + (-1*20) > 0)
            this.moveX(-1);

        }
        if (keyIsDown(RIGHT_ARROW) || keyDown('d')) {
            // if (this.x + (1*20) < width)
            this.moveX(1);

        }

        //only for testing will be removed
        if (keyWentDown('v')) {
            this.takeDamage(10);
        }

        for (let i = 0; i < this.bullets.length; i++) {
            this
                .bullets[i]
                .update();
            if (dist(this.bullets[i].x, this.bullets[i].y, this.x, this.y) > this.RenderDist) {
                this.destroy(this.bullets, i)
                break;
            }

            for (let k = 0; k < this.destructibles.length; k++) {
                if (this.bullets[i].bulletsprite.overlap(this.destructibles[k])) {
                    this.destroy(this.bullets, i)
                    break;

                }
            }
            this.enemies.forEach(e => {
                if(this.bullets[i] != undefined) {
                    if(this.bullets[i].bulletsprite.overlap(e.sprite)) {
                        iHitSomeone(e.id);
                        this.destroy(this.bullets, i)
                    }
                }
            })
        }
    }

    this.destroy = function (arr, i) {
        arr[i].bulletsprite.remove();
        arr.splice(i, 1);
    }

    this.moveY = function (number) {
        this.sprite.velocity.y = number * this.speed;
    }
    this.moveX = function (number) {
        this.sprite.velocity.x = number * this.speed;
    }

    this.shoot = function (camera_mouseX, camera_mouseY, camera_position_x, camera_position_y) {
        let new_bullet = new Bullet(camera_mouseX, camera_mouseY, camera_position_x, camera_position_y, this.id)
        // console.log(gunshot);
        this.bullets.push(new_bullet)
        gunshot.play();
    }

    //damage function
    this.takeDamage = function (damage = 10) {
        this.healthbar.width -= damage;
        this.offset -= damage / 2
        this.health -= damage;
        if(this.health <= 0) {
            return false;
        }
        if (this.health > 60) {
            this.healthbar.shapeColor = color(0, 255, 0);
        } else if (this.health > 40 && this.health <= 60) {
            this.healthbar.shapeColor = color('yellow');
        } else {
            this.healthbar.shapeColor = color('red');
        }
        return true;
    }

    //collision detection
    this.collision = function (env) {
        this.sprite.collide(env)
    }
}