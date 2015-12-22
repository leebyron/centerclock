class Day extends Ball{

  Day(){
    super( new Point(0,0), 0);
  }

  void addChild(Ball b){
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
  
  void draw(){
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
    fill( h, s, 255, 100 );


    ellipse( center.x, center.y, radius*2, radius*2 );

  }

/*
  public void addVolume(float v){
  }
*/
}
