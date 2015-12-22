/* @flow */

import type { Particle } from './Particle';

export class Spring /* implements Force */ {
  springConstant: number;
  damping: number;
  restLength: number;
  a: Particle;
  b: Particle;
  on: boolean;

  constructor(a: Particle, b: Particle, ks: number, d: number, r: number) {
    this.springConstant = ks;
    this.damping = d;
    this.restLength = r;
    this.a = a;
    this.b = b;
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }

  turnOn(): void {
    this.on = true;
  }

  isOn(): boolean {
    return this.on;
  }

  isOff(): boolean {
    return !this.on;
  }

  getOneEnd(): Particle {
    return this.a;
  }

  getTheOtherEnd(): Particle {
    return this.b;
  }

  currentLength(): number {
    return this.a.position.distanceToV(this.b.position);
  }

  restLength(): number {
    return this.restLength;
  }

  strength(): number {
    return this.springConstant;
  }

  setStrength(ks: number): void {
    this.springConstant = ks;
  }

  damping(): number {
    return this.damping;
  }

  setDamping(d: number): void {
    this.damping = d;
  }

  setRestLength(l: number): void {
    this.restLength = l;
  }

  apply(): void {
    if (this.on && (this.a.isFree() || this.b.isFree())) {
      let a2bX = this.a.position.x - this.b.position.x;
      let a2bY = this.a.position.y - this.b.position.y;
      let a2bZ = this.a.position.z - this.b.position.z;

      const a2bDistance = Math.sqrt( a2bX*a2bX + a2bY*a2bY + a2bZ*a2bZ );

      if ( a2bDistance == 0 ) {
        a2bX = 0;
        a2bY = 0;
        a2bZ = 0;
      } else {
        a2bX /= a2bDistance;
        a2bY /= a2bDistance;
        a2bZ /= a2bDistance;
      }

      // spring force is proportional to how much it stretched

      const springForce = -(a2bDistance - this.restLength) * this.springConstant;

      // want velocity along line b/w a & b, damping force is proportional to this

      const Va2bX = this.a.velocity.x - this.b.velocity.x;
      const Va2bY = this.a.velocity.y - this.b.velocity.y;
      const Va2bZ = this.a.velocity.z - this.b.velocity.z;

      const dampingForce = -this.damping * ( a2bX*Va2bX + a2bY*Va2bY + a2bZ*Va2bZ );

      // forceB is same as forceA in opposite direction

      const r = springForce + dampingForce;

      a2bX *= r;
      a2bY *= r;
      a2bZ *= r;

      if (this.a.isFree()) {
        this.a.force.add(a2bX, a2bY, a2bZ);
      }

      if (this.b.isFree()) {
        this.b.force.add(-a2bX, -a2bY, -a2bZ);
      }
    }
  }

  _setA(p: Particle) {
    this.a = p;
  }

  _setB(p: Particle) {
    this.b = p;
  }
}