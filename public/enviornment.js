function Enviornment() {
  this.env_collider = new Group;
  this.color = color(255);
  this.thickness = 10;
  this.boundaries = [];
  this.obstacles = [];
  var height = 578;
  var width = 1280;
  var offset = 100;
  var obstacles = 5;

  //setting  the enviornment boundaries
  for (let i = 0; i < 2; i++) {
    this.boundaries[i] = []
    for (let j = 0; j < 2; j++) {
      this.boundaries[i][j] = []
      this.boundaries[i][j] = createSprite();
      this.boundaries[i][j].shapeColor = this.color;
      if (i == 0 && j == 0) {
        this.boundaries[i][j].width = width;
        this.boundaries[i][j].height = this.thickness;
        this.boundaries[i][j].position = createVector(width / 2, 0);
      }
      if (i == 0 && j == 1) {
        this.boundaries[i][j].width = width;
        this.boundaries[i][j].height = this.thickness;
        this.boundaries[i][j].position = createVector(width / 2, height);
      }

      if (i == 1 && j == 0) {
        this.boundaries[i][j].width = this.thickness;
        this.boundaries[i][j].height = height;
        this.boundaries[i][j].position = createVector(0, height / 2);
      }
      if (i == 1 && j == 1) {
        this.boundaries[i][j].width = this.thickness;
        this.boundaries[i][j].height = height;
        this.boundaries[i][j].position = createVector(width, height / 2);
      }

      this.env_collider.push(this.boundaries[i][j]);
      this.boundaries[i][j].setCollider("rectangle");
      //this.boundaries[i][j].debug = true;
    }
  }


  //setting the obstacle platforms
  for (let i = 0; i < obstacles; i++) {
    this.obstacles[i] = [];
    for (let j = 0; j < obstacles; j++) {
      this.obstacles[i][j] = createSprite();
      if (j != 0) {
        this.obstacles[i][j].width = 20;
        this.obstacles[i][j].height = 80
      }
      if (j == 1 || j == 3) {
        this.obstacles[i][j].width = 100;
        this.obstacles[i][j].height = 20
      }
      if (j == 0 || j == 4) {
        this.obstacles[i][j].width = 20;
        this.obstacles[i][j].height = 80
      }

      if (i == 0 || i == 4) {
        this.obstacles[i][j].width = 20;
        this.obstacles[i][j].height = 20
      }

      if (j == 0 || j == 4) {
        if (j == 4) {
          offset *= -1;
        } else {
          offset = 100;
        }
        this.obstacles[i][j].position = createVector(width * (j) / 4 + offset, height * (2 * i) / 8)

      } else {
        this.obstacles[i][j].position = createVector(width * (j) / 4, height * (2 * i) / 8);
      }
      this.obstacles[i][j].shapeColor = this.color;
      this.env_collider.push(this.obstacles[i][j]);
      this.obstacles[i][j].setCollider("rectangle");
      //this.obstacles[i][j].debug = true;
    }
  }
}