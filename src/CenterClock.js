/* @flow */

/***************************************************************************
 *
 *  CenterClock - Copyright 2007 Lee Byron
 *  Creative Commons Attribution-ShareAlike 4.0 International
 *
 *  Originally written for Processing, ported to flow-typed p5.js in 2015
 *  while leaving as many quirks as possible (including commented out code).
 *
 ***************************************************************************/

import { ParticleSystem } from './traer_physics/ParticleSystem';
import type { Particle } from './traer_physics/Particle';
import type { Spring } from './traer_physics/Spring';

const EPSILON = 0.00001;
const SQRT_HALF = 0.70710678119;

export function CenterClock(p5: any) {

// ========================================================================
//    Point
// ========================================================================

  class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    clone(): Point {
      return new Point(this.x, this.y);
    }

    distance(p: Point): number {
      return p5.dist(this.x, this.y, p.x, p.y);
    }

    isZero(): boolean {
      if (this.x !== 0) {
        return false;
      }
      if (this.y !== 0) {
        return false;
      }
      return true;
    }

    // some vector functions

    subtract(p: Point): Point {
      this.x -= p.x;
      this.y -= p.y;
      return this;
    }

    add(p: Point): Point {
      this.x += p.x;
      this.y += p.y;
      return this;
    }

    multiply(m: number): Point {
      this.x *= m;
      this.y *= m;
      return this;
    }

    divide(d: number): Point {
      this.x /= d;
      this.y /= d;
      return this;
    }

    magnitude(): number {
      return p5.dist(this.x, this.y, 0, 0);
    }

    unit(): Point {
      return this.clone().divide(this.magnitude());
    }

    dot(p: Point): number {
      return this.x * p.x + this.y * p.y;
    }

    toString(): string {
      return `(${this.x},${this.y})`;
    }

    equals(p: Point): boolean {
      return Math.abs(p.x - this.x) < EPSILON && Math.abs(p.y - this.y) < EPSILON;
    }
  }


// ========================================================================
//    Ball
// ========================================================================

  class Ball {
    owner: ?Ball;
    children: Array<Ball>;
    center: Point;

    radius: number;
    tRadius: number;

    volume: number;
    p: Particle;
    s: Spring;
    merging: boolean;
    doDestroy: boolean;
    index: number;

    constructor(c: Point, v: number) {
      this.center = c;
      this.volume = 0;
      this.addVolume(v);
      this.radius = 0;

      this.children = [];

      if (this.volume > 0) {
        allBalls.push(this);
      }

      this.p = world.makeParticle(1, c.x, c.y, 0);
      this.s = world.makeSpring( this.p, centerWorld, 0.0004, 0.01, 0 );
    }

    addVolume(v: number): void {
      if (this.doDestroy) {
        if (this.owner) {
          this.owner.addVolume(v);
        }
        return;
      }

      this.volume += v;
      this.tRadius = Math.pow(this.volume, 0.25);
    }

    push(): void {
      this.p.velocity.add( -10, 0, 0 );
    }

    addChild(b: Ball): void{
      b.owner = this;
      this.children.push(b);
    }

    merge(): void {
      if (this.owner) {
        this.owner.addVolume(this.volume);
      }
      this.tRadius = 0;
      this.doDestroy = true;
    }

    mergeChildren(): void {
      this.setPosition();
      allBalls.push(this);

      // merge all
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].merging = true;
      }
    }

    setPosition(): void {
      this.center = new Point(0, 0);

      /*
      for( int i=0; i<children.size(); i++)
       center.add( ((Ball) children.get(i)).center );
       center.divide( children.size() );
       */
      const b = this.children[Math.floor(this.children.length / 2)];
      this.center.add(b.center);
      this.p.position.set(this.center.x, this.center.y, 0);
    }

    update(): void {
      this.radius += (this.tRadius - this.radius) * 0.1;

      if (this.doDestroy && this.radius < EPSILON && allBalls.indexOf(this) !== -1) {
        allBalls.splice(allBalls.indexOf(this), 1);
        world.removeParticle(this.p);
        world.removeSpring(this.s);
      }

      if (this.merging) {

        let target = null;
        let tRad = 10;
        let dad = this.owner;
        while (dad && dad.doDestroy) {
          if (dad.owner == null) {
            target = new Point(0, 0);
          }
          dad = dad.owner;
        }
        if (dad && target == null) {
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

        if (target) {

          // merge?
          if(!this.doDestroy && this.center.distance(target) < (tRad + this.radius)) {
            this.merge();
            return;
          }

          // merge?
          const vMerge = target.clone().subtract(this.center).multiply(0.001);
          this.p.velocity.add(vMerge.x, vMerge.y, 0);
          //return;
        }
      }

      // dont overlap other balls
      const noBallOverlap = new Point(0, 0);
      for (let i = 0; i < allBalls.length; i++) {

        // ball du jour
        const b = allBalls[i];

        // don't compare to self
        if (b === this) {
          continue;
        }

        // both merging?
        if (this.merging && b.merging) {
          continue;
        }

        // if we're merging, dont compare to like seconds (or it's minute)
        if((this.merging || b.merging) && this.isRelated(b)) {
          continue;
        }

        // repel
        const over = this.overlap(b);

        // no overlap?
        if (over == null) {
          continue;
        }

        // add in the force
        noBallOverlap.add(over);
      }

      // dont overlap outer wall
      const ballMag = this.center.magnitude();
      const overlapMag = ballMag + this.radius - p5.width * 0.5;
      if (overlapMag > 0) {
        noBallOverlap.add(this.center.unit().multiply(-overlapMag * 0.2));
      }

      // affect ball
      this.p.velocity.add(noBallOverlap.x, noBallOverlap.y, 0);
    }

    isRelated(b: Ball): boolean{
      if (this === b.owner ) {
        return true;
      }
      if (b === this.owner) {
        return true;
      }
      if (this.owner === b.owner) {
        return true;
      }
      if (this.owner != null && this.owner.owner != null && b === this.owner.owner) {
        return true;
      }
      if (b.owner != null && b.owner.owner != null && this === b.owner.owner) {
        return true;
      }

      return false;
    }

    draw(): void {
      // update point
      this.center.x = this.p.position.x;
      this.center.y = this.p.position.y;

      let s = (this.radius - 6) / 80;
      s = Math.max(s, 0);
      s = Math.pow(s, 0.4);
      s *= 255;

      let h = this.radius / 530;
      h = Math.pow(h, 0.5);
      h = 1 - h;
      h += 0.83;

      //    h=1-h;
      //    h*=h;
      //    h+=0.43;
      h = h % 1;
      h *= 255;

      p5.fill(h, s, 255);
      p5.ellipse(this.center.x, this.center.y, this.radius * 2, this.radius * 2);
    }

    // returns the vector ball would have to move to no longer overlap parameter b
    // or null if there is no overlap
    overlap(b: Ball): ?Point {

      if (this.center.equals(b.center)) {
        return null;
      }

      // min distance between the two
      const minDist = this.radius + b.radius;

      // do some boolean logic tests to save cpu
      if (Math.abs(this.center.x - b.center.x) > minDist) {
        return null;
      }

      if (Math.abs(this.center.y - b.center.y) > minDist) {
        return null;
      }

      // actual distance
      const distTo = this.center.distance( b.center );
      if (distTo > minDist) {
        return null;
      }

      // return vector to oppose collision
      const _overlap = new Point(b.center.x - this.center.x, b.center.y - this.center.y);
      _overlap.add(_overlap.unit().multiply(-minDist));

      return _overlap.multiply(this.radius / (this.radius + b.radius));
      //return overlap.multiply( b.radius / (radius + b.radius) );
    }
  }


// ========================================================================
//    Day
// ========================================================================

  class Day extends Ball {

    constructor() {
      super(new Point(0, 0), 0);
    }

    addChild(b: Ball): void {
//    super.addChild(b);

      if (this.children.length === 24) {
        activeDay = new Day();
  //      mergeChildren();
        this.setPosition();
        allBalls.push(this);

        // merge all
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].merging = true;
        }
      }

      b.owner = activeDay;
      if (activeDay) {
        activeDay.children.push(b);
      }
    }


    draw(): void {
      this.center.x = this.p.position.x;
      this.center.y = this.p.position.y;

      let s = (this.radius - 6) / 80;
      s = Math.max(s, 0);
      s = Math.pow(s, 0.4);
      s *= 255;

      let h = this.radius / 530;
      h = Math.pow(h, 0.5);
      h = 1 - h;
      h += 0.83;

      //    h=1-h;
      //    h*=h;
      //    h+=0.43;
      h = h % 1;
      h *= 255;

      p5.fill(h, s, 255, 100);
      p5.ellipse(this.center.x, this.center.y, this.radius * 2, this.radius * 2);
    }
  }


// ========================================================================
//    Hour
// ========================================================================

  class Hour extends Ball {

    constructor(n?: number) {
      if (n == null) {
        super(new Point(0, 0), 0);
        if (activeDay) {
          activeDay.addChild(this);
        }
      } else {
        //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*3600 );
        super(new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad * 3600);
        if (activeDay) {
          activeDay.addChild(this);
        }
      }
    }

    addChild(b: Ball): void {
  //    super.addChild(b);

      // p5.println( "min: "+this.children.length );

      if (this.children.length === 60) {
        activeHour = new Hour();
        this.mergeChildren();
      }

      b.owner = activeHour;
      if (activeHour) {
        activeHour.children.push(b);
      }
    }
  }


// ========================================================================
//    Minute
// ========================================================================

  class Minute extends Ball {

    constructor(n?: number) {
      if (n == null) {
        super( new Point(0, 0), 0);
        if (activeHour) {
          activeHour.addChild(this);
        }
      } else {
        //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*60 );
        super(new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad * 60);
        if (activeHour) {
          activeHour.addChild(this);
        }
      }
    }

    addChild(b: Ball): void {
      //super.addChild(b);

      // p5.println( "sec: "+this.children.length );

      if (this.children.length === 60) {
        activeMinute = new Minute();
        this.mergeChildren();
      }

      b.owner = activeMinute;
      if (activeMinute) {
        activeMinute.children.push(b);
      }
    }
  }


// ========================================================================
//    Second
// ========================================================================

  class Second extends Ball {

    //Minute m;

    // Second(Point c, float v){
    //   super(c,v);
    //   activeMinute.addChild(this);
    // }

    constructor(n: number) {
  //    super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad );
      super(new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad);
      if (activeMinute) {
        activeMinute.addChild(this);
      }
    }
  }


// ========================================================================
//    CenterClock
// ========================================================================

  // CONSTANTS
  const entryPoint = new Point( 1024, -500 );
  const unitRad: number = 1000;

  let lastSec;

  const world = new ParticleSystem(0, 0.03);
  const centerWorld = world.makeParticle(1,0,0,0);
  centerWorld.makeFixed();

  // let obsticles = [];
  const allBalls: Array<Ball> = [];

  let activeDay: Day = new Day();
  let activeHour: ?Hour;
  let activeMinute: ?Minute;

  let mask;

  let timeFilled;

  p5.setup = function setup() {
    const docElem = document.documentElement;
    let minSize = Math.min(docElem.clientHeight, docElem.clientWidth);
    minSize = Math.floor(minSize * 0.94);
    p5.createCanvas(minSize, minSize);
    p5.colorMode(p5.HSB, 255);
    p5.smooth();
    p5.noStroke();

    // Note, in the original source, a circle-mask image is created here.
    // To achieve the same effect, this source is assumed to be used alongside
    // the index.html file in this same repository, which creates a similar
    // circle-mask effect.
  }

  function update() {
    // calculate some things
    for (let i = 0; i < allBalls.length; i++) {
      const b = allBalls[i];
      b.update();
    }

    world.tick();
  }

  p5.draw = function draw() {
    p5.background(30);

    // center of screen at 0,0
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);

    let time;

    // should we be adding things that already exist?
    if (!timeFilled) {

      // add them in at a regular interval
      time = p5.millis() / 50;
      if (time != lastSec) {

        // add an hour?
        if (activeDay.children.length < p5.hour()) {
          new Hour((activeDay.children.length + 1) / 12);
        } else if (activeHour == null) {
          activeHour = new Hour();
        }

        // add a minute?
        if (activeHour != null) {
          if (activeHour.children.length < p5.minute()) {
            new Minute((activeHour.children.length + 1) / 60);
          } else if (activeMinute == null) {
            activeMinute = new Minute();
          }
        }

        // add a second?
        if (activeMinute != null) {
          if (activeMinute.children.length < p5.second()) {
            new Second((activeMinute.children.length + 1) / 60);
          } else {
            timeFilled = true;
          }
        }
      }
    } else {

      // trigger new second ball?
      time = p5.second();
      if (time != lastSec) {
        new Second(p5.second() / 60);
      }

    }

    lastSec = time;

    update();

    // draw some things

    for (let i = 0; i < allBalls.length; i++) {
      const b = allBalls[i];
      b.draw();
    }

    p5.pop();
  }

}
