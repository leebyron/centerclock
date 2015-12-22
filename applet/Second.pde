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
