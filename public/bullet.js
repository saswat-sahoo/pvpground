function Bullet(X, Y, PX, PY) {
    this.speed = 20;
    this.x = PX;
    this.y = PY;
    this.z = 0;
    this.r = 5;
    this.speed = 10;

    //creating the bullet sprite with the meta data
    this.bulletsprite = createSprite(
        this.x,
        this.y,
        10,
        10
    );
    this.bulletsprite.shapeColor = color(255, 0, 0);

    //setting up the travel vector
    let end = createVector(X - this.x, Y - this.y);
    this.bulletsprite.setCollider("rectangle");
    //updating the position of the bullet
    this.update = function () {
        end.setMag(this.speed);
        this.x += end.x;
        this.y += end.y;
        this.bulletsprite.position.x = this.x;
        this.bulletsprite.position.y = this.y;
        //this.bulletsprite.debug = true;
    }
}