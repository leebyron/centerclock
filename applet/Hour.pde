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
  
  void addChild(Ball b){
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
