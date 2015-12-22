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

  
  void addChild(Ball b){
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
