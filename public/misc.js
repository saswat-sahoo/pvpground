let bullet;
let player;
let bONs = false;
let click_dir;
let v;
let y;
let env = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  player = createVector(width/2,height/2);
  bullet =createVector(player.x,player.y);
  v = createVector(1,1);
  for(let i=0;i<40;i++){
    let v = createVector(round(random(windowWidth/60)),round(random(windowHeight/60)));
    env.push(v);
  }
  //frameRate(25);
}

function draw() {
  background(0);
  fill(255);
  circle(player.x,player.y,50);
  if(bONs){
    bullet.x += v.x*8;
    bullet.y += v.y*8;
  }
  else{
    bullet.x = player.x;
    bullet.y=player.y;
  }
  if(bullet.x<0 || bullet.x>windowWidth || bullet.y<0 || bullet.y>windowHeight){
    bONs =false;
  }
  fill(255,0,255);
  circle(bullet.x,bullet.y,15);
  fill(255);
  circle(player.x,player.y,50);
  if(keyIsDown(87) && collide(player.x,player.y-2)){
    player.y-=2;
  }
  if(keyIsDown(65) && collide(player.x-2,player.y)){
    player.x-=2;
  }
  if(keyIsDown(68) && collide(player.x+2,player.y)){
    player.x+=2;
  }
  if(keyIsDown(83) && collide(player.x,player.y+2)){
    player.y+=2;
  }
  for(let i = 0;i<40;i++){
    fill(255,0,0);
    rect(env[i].x*60,env[i].y*60,60,60)
  }
}


function mousePressed(){
  if(bONs==false){
    y=(createVector(mouseX-player.x,mouseY-player.y));
    v = y.normalize();
    bONs=true;
  }
}

function collide(a,b){
  for (var ev of env){
    if(ev.y*60-25<b && ev.y*60+60+25>b && ev.x*60-25< a && ev.x*60+60+25>a){
      return false;
    }
    if(b-25<0 || b+25>windowHeight){
      return false;
    }
    
    if(a-25<0 || a+25>windowWidth){
      return false
    }
  }
  return true;
}