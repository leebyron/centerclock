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
    world.makeSpring( p, centerWorld, 0.0004, 0.01, 0 );
  }

  public void addVolume(float v){
    if( doDestroy ){
      owner.addVolume(v);
      return;
    }

    volume += v;
    tRadius = pow(volume,0.25);
  }

  public void push(){
    p.addVelocity( -10, 0, 0 );
  }

  public void addChild(Ball b){
    b.owner = this;
    children.add(b);
  }

  void merge(){
    owner.addVolume( volume );
    tRadius = 0;
    doDestroy = true;
  }

  void mergeChildren(){
    setPosition();
    allBalls.add( this );

    // merge all
    for( int i=0; i<children.size(); i++)
      ((Ball) children.get(i)).merging = true;
  }

  void setPosition(){
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
    radius += (tRadius-radius)*0.1;

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
      Point vMerge = target.clone().subtract( center ).multiply( 0.001 );
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
    float overlapMag = ballMag + radius - (float)width*0.5;
    if( overlapMag > 0 ){
      noBallOverlap.add( center.unit().multiply( -overlapMag*0.2 ) );
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
    s = pow(s,0.4);
    s*=255;

    float h = (radius/530);
    h = pow(h,0.5);
    h = 1-h;
    h += 0.83;

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
