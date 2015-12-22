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
