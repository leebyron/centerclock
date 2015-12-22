import processing.core.*; import traer.physics.*; import java.applet.*; import java.awt.*; import java.awt.image.*; import java.awt.event.*; import java.io.*; import java.net.*; import java.text.*; import java.util.*; import java.util.zip.*; public class CenterClock extends PApplet {

final float SQRT_HALF = 0.70710678119f;

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

public void setup(){
  size( 650, 650 );
  colorMode( HSB, 255 );
  smooth();
  noStroke();

  // CONSTANTS
  entryPoint = new Point( 1024, -500 );
  unitRad = 1000;

  world = new ParticleSystem(0, 0.03f);
  centerWorld = world.makeParticle(1,0,0,0);
  centerWorld.makeFixed();

  obsticles = new ArrayList();
  allBalls = new ArrayList();

  activeDay = new Day();
  
  mask = createImage(width, height, ARGB);
  mask.loadPixels();
  for(int i=0; i<mask.width; i++)
    for(int j=0; j<mask.height; j++)
      mask.pixels[i+j*mask.width] = 0xff000000;
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

public void update(){
  // calculate some things
  for( int i=0; i<allBalls.size(); i++ ){
    Ball b = (Ball) allBalls.get(i);
    b.update();
  }

  world.tick();
}

public void draw(){
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

class Ball{

  Ball owner;
  ArrayList children;
  Point center;

  float radius;
  float tRadius;

  float volume;
  Particle p;
  boolean merging;
  boolean doDestroy;
  int index;

  public Ball( Point c, float v ){
    center = c;
    volume = 0;
    addVolume(v);
    radius = 0;

    children = new ArrayList();

    if( volume > 0 )
      allBalls.add( this );

    p = world.makeParticle( 1, c.x, c.y, 0 );
    world.makeSpring( p, centerWorld, 0.0004f, 0.01f, 0 );
  }

  public void addVolume(float v){
    if( doDestroy ){
      owner.addVolume(v);
      return;
    }

    volume += v;
    tRadius = pow(volume,0.25f);
  }

  public void push(){
    p.addVelocity( -10, 0, 0 );
  }

  public void addChild(Ball b){
    b.owner = this;
    children.add(b);
  }

  public void merge(){
    owner.addVolume( volume );
    tRadius = 0;
    doDestroy = true;
  }

  public void mergeChildren(){
    setPosition();
    allBalls.add( this );

    // merge all
    for( int i=0; i<children.size(); i++)
      ((Ball) children.get(i)).merging = true;
  }

  public void setPosition(){
    center = new Point(0,0);

    /*
    for( int i=0; i<children.size(); i++)
     center.add( ((Ball) children.get(i)).center );
     center.divide( children.size() );
     */
    Ball b = (Ball) children.get( (int) children.size()/2 );
    center.add( b.center);
    p.moveTo( center.x, center.y, 0 );
  }


  public void update(){
    radius += (tRadius-radius)*0.1f;

    if( doDestroy && radius < EPSILON && allBalls.contains( this ) ){
      allBalls.remove( allBalls.indexOf( this ) );
      p.kill();
    }

    if( merging ){

      Point target = null;
      float tRad = 10;
      Ball dad = owner;
      while( dad.doDestroy ){
        if( dad.owner == null ){
          target = new Point(0,0);
        }
        dad = dad.owner;
      }
      if( target == null ){
        target = dad.center;
        tRad = dad.radius;
      }
      
      /*
      if( owner.doDestroy && owner.owner != null ){
        target = owner.owner.center;
        tRad = owner.owner.radius;
      }else if( owner.doDestroy && owner.owner == null ){
        target = new Point(0,0);
        tRad = 10;
      }else{
        target = owner.center;
        tRad = owner.radius;
      }
      */

      // merge?
      if(!doDestroy && center.distance( target ) < (tRad+radius) ){
        merge();
        return;
      }

      // merge?
      Point vMerge = target.clone().subtract( center ).multiply( 0.001f );
      p.addVelocity( vMerge.x, vMerge.y, 0 );
      //return;
    }

    // dont overlap other balls
    Point noBallOverlap = new Point(0,0);
    for( int i=0; i<allBalls.size(); i++ ){

      // ball du jour
      Ball b = (Ball) allBalls.get(i);

      // don't compare to self
      if( b == this )
        continue;

      // both merging?
      if( merging && b.merging )
        continue;

      // if we're merging, dont compare to like seconds (or it's minute)
      if( (merging || b.merging) && isRelated(b) )
        continue;

      // repel
      Point over = overlap( b );

      // no overlap?
      if( over == null )
        continue;

      // add in the force
      noBallOverlap.add( over );
    }

    // dont overlap outer wall
    float ballMag = center.magnitude();
    float overlapMag = ballMag + radius - (float)width*0.5f;
    if( overlapMag > 0 ){
      noBallOverlap.add( center.unit().multiply( -overlapMag*0.2f ) );
    }

    // affect ball
    p.addVelocity( noBallOverlap.x, noBallOverlap.y, 0 );
  }

  public boolean isRelated(Ball b){
    if( this == b.owner )
      return true;
    if( b == owner )
      return true;
    if( owner == b.owner )
      return true;
    if( owner != null && owner.owner != null && b == owner.owner )
      return true;
    if( b.owner != null && b.owner.owner != null && this == b.owner.owner )
      return true;

    return false;
  }

  public void draw(){
    // update point
    center.x = p.position().x();
    center.y = p.position().y();

    float s = ((radius-6)/80);
    s = max(s,0);
    s = pow(s,0.4f);
    s*=255;

    float h = (radius/530);
    h = pow(h,0.5f);
    h = 1-h;
    h += 0.83f;

    //    h=1-h;
    //    h*=h;
    //    h+=0.43;
    h=h%1;
    h*=255;
    fill( h, s, 255 );


    ellipse( center.x, center.y, radius*2, radius*2 );
  }

  // returns the vector ball would have to move to no longer overlap parameter b
  // or null if there is no overlap
  public Point overlap( Ball b ){

    if( center.equals(b.center) )
      return null;

    // min distance between the two
    float minDist = radius + b.radius;

    // do some boolean logic tests to save cpu
    if( abs( center.x - b.center.x ) > minDist )
      return null;

    if( abs( center.y - b.center.y ) > minDist )
      return null;

    // actual distance
    float distTo = center.distance( b.center );
    if( distTo > minDist )
      return null;

    // return vector to oppose collision
    Point overlap = new Point(b.center.x-center.x, b.center.y-center.y);
    overlap.add( overlap.unit().multiply( -minDist ) );

    return overlap.multiply( radius / (radius + b.radius) );
    //return overlap.multiply( b.radius / (radius + b.radius) );
  }
}

class Day extends Ball{

  Day(){
    super( new Point(0,0), 0);
  }

  public void addChild(Ball b){
//    super.addChild(b);

    if( children.size() == 24 ){
      activeDay = new Day();
//      mergeChildren();
    setPosition();
    allBalls.add( this );

    // merge all
    for( int i=0; i<children.size(); i++)
      ((Ball) children.get(i)).merging = true;

    }

    b.owner = activeDay;
    activeDay.children.add(b);
  }
  
  public void draw(){
        center.x = p.position().x();
    center.y = p.position().y();

    float s = ((radius-6)/80);
    s = max(s,0);
    s = pow(s,0.4f);
    s*=255;

    float h = (radius/530);
    h = pow(h,0.5f);
    h = 1-h;
    h += 0.83f;

    //    h=1-h;
    //    h*=h;
    //    h+=0.43;
    h=h%1;
    h*=255;
    fill( h, s, 255, 100 );


    ellipse( center.x, center.y, radius*2, radius*2 );

  }

/*
  public void addVolume(float v){
  }
*/
}

class Hour extends Ball{
  
  Hour(){
    super( new Point(0,0), 0);
    activeDay.addChild( this );
  }
  
  Hour( float n ){
    //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*3600 );
    super( new Point( random(-20,20),random(-20,20) ), unitRad*3600 );
    activeDay.addChild( this );
  }
  
  public void addChild(Ball b){
//    super.addChild(b);

    println( "min: "+children.size() );
    
    if( children.size() == 60 ){
      activeHour = new Hour();
      mergeChildren();
    }
    
    b.owner = activeHour;
    activeHour.children.add(b);

  }
  
}

class Minute extends Ball{
  
  Minute(){
    super( new Point(0,0), 0);
    activeHour.addChild( this );
  }
  
  Minute( float n ){
    //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*60 );
    super( new Point( random(-20,20),random(-20,20) ), unitRad*60 );
    activeHour.addChild( this );
  }

  
  public void addChild(Ball b){
    //super.addChild(b);
    
    println( "sec: "+children.size() );

    if( children.size() == 60 ){
      activeMinute = new Minute();
      mergeChildren();
    }
    
    b.owner = activeMinute;
    activeMinute.children.add(b);
    
  }
  
}

class Point{
  
  float x, y;
  
  public Point(float x, float y){
    this.x = x;
    this.y = y;
  }
  
  public Point clone(){
    return new Point(x,y);
  }
  
  public float distance( Point p ){
    return dist( x, y, p.x, p.y );
  }
  
  public boolean isZero(){
    if(x != 0)
      return false;
    if(y != 0)
      return false;
    return true;
  }
  
  // some vector functions
  
  public Point subtract( Point p ){
    x -= p.x;
    y -= p.y;
    return this;
  }
  
  public Point add( Point p ){
    x += p.x;
    y += p.y;
    return this;
  }
  
  public Point multiply( float m ){
    x *= m;
    y *= m;
    return this;
  }
  
  public Point divide( float d ){
    x /= d;
    y /= d;
    return this;
  }
  
  public float magnitude(){
    return dist(x,y,0,0);
  }
  
  public Point unit(){
    return clone().divide( magnitude() );
  }
  
  public float dot(Point p){
    return x*p.x + y*p.y;
  }
  
  public String toString(){
    return "("+x+","+y+")";
  }
  
  
  public boolean equals( Object o ){
    Point b = (Point) o;
    return ( abs(b.x-x) < EPSILON && abs(b.y-y) < EPSILON );
  }
  
  
}

class Second extends Ball{
  
  //Minute m;
  
  Second(Point c, float v){
    super(c,v);
    activeMinute.addChild(this);
  }
  
  Second( float n ){
//    super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad );
    super( new Point( random(-20,20),random(-20,20) ), unitRad );
    activeMinute.addChild(this);
  }
  
}

  static public void main(String args[]) {     PApplet.main(new String[] { "CenterClock" });  }}