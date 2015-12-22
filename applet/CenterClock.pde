import traer.physics.*;

final float SQRT_HALF = 0.70710678119;

Point entryPoint;
float unitRad;

int lastSec;

ParticleSystem world;
Particle centerWorld;
ArrayList obsticles;
ArrayList allBalls;

Day activeDay;
Hour activeHour;
Minute activeMinute;

PImage mask;

boolean timeFilled;

void setup(){
  size( 650, 650 );
  colorMode( HSB, 255 );
  smooth();
  noStroke();

  // CONSTANTS
  entryPoint = new Point( 1024, -500 );
  unitRad = 1000;

  world = new ParticleSystem(0, 0.03);
  centerWorld = world.makeParticle(1,0,0,0);
  centerWorld.makeFixed();

  obsticles = new ArrayList();
  allBalls = new ArrayList();

  activeDay = new Day();
  
  mask = createImage(width, height, ARGB);
  mask.loadPixels();
  for(int i=0; i<mask.width; i++)
    for(int j=0; j<mask.height; j++)
      mask.pixels[i+j*mask.width] = #000000;
  mask.updatePixels();
  
  PGraphics circle = createGraphics(width, height, JAVA2D);
  circle.smooth();
  circle.beginDraw();
  circle.background(255);
  circle.fill(0);
  circle.ellipse((float)width/2,(float)height/2,width-2,height-2);
  circle.endDraw();
  
  mask.mask( circle );
  
}

void update(){
  // calculate some things
  for( int i=0; i<allBalls.size(); i++ ){
    Ball b = (Ball) allBalls.get(i);
    b.update();
  }

  world.tick();
}

void draw(){
  background( 30 );
  
  // center of screen at 0,0
  pushMatrix();
  translate( width/2, height/2 );
  
  int time;

  // should we be adding things that already exist?
  if( !timeFilled){

    // add them in at a regular interval
    time = millis()/50;
    if (time != lastSec ){

      // add an hour?
      if( activeDay.children.size() < hour() )
        new Hour((float)(activeDay.children.size()+1)/12);
      else if( activeHour == null )
        activeHour = new Hour();

      // add a minute?
      if( activeHour != null ){
        if( activeHour.children.size() < minute() )
          new Minute((float)(activeHour.children.size()+1)/60);
        else if( activeMinute == null )
          activeMinute = new Minute();
      }

      // add a second?
      if( activeMinute != null ){
        if( activeMinute.children.size() < second() )
          new Second((float)(activeMinute.children.size()+1)/60);
        else
          timeFilled = true;
      }

    }
  }
  else{

    // trigger new second ball?
    time = second();
    if( time != lastSec )
      new Second( (float)second()/60 );

  }

  lastSec = time;



  update();

  // draw some things

  for( int i=0; i<allBalls.size(); i++ ){
    Ball b = (Ball) allBalls.get(i);
    b.draw();
  }
  
  popMatrix();
  
  image( mask, 0, 0 );

}
