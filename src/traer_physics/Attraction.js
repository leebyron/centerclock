/* @flow */

import type { Particle } from './Particle';

// attract positive repel negative

export class Attraction /* implements Force */ {

  a: Particle;
  b: Particle;
  k: number;
  on: boolean;
  distanceMin: number;
  distanceMinSquared: number;

  constructor(a: Particle, b: Particle, k: number, distanceMin: number) {
    this.a = a;
    this.b = b;
    this.k = k;
    this.on = true;
    this.distanceMin = distanceMin;
    this.distanceMinSquared = distanceMin * distanceMin;
  }

  _setA(p: Particle): void {
    this.a = p;
  }

  _setB(p: Particle): void {
    this.b = p;
  }

  getMinimumDistance(): number {
    return this.distanceMin;
  }

  setMinimumDistance(d: number): void {
    this.distanceMin = d;
    this.distanceMinSquared = d * d;
  }

  turnOff(): void {
    this.on = false;
  }

  turnOn(): void {
    this.on = true;
  }

  setStrength(k: number): void {
    this.k = k;
  }

  getOneEnd(): Particle {
    return this.a;
  }

  getTheOtherEnd(): Particle {
    return this.b;
  }

  getStrength(): number {
    return this.k;
  }

  isOn(): boolean {
    return this.on;
  }

  isOff(): boolean {
    return !this.on;
  }

  apply(): void {
    if (this.on && (this.a.isFree() || this.b.isFree())) {
      let a2bX = this.a.position.x - this.b.position.x;
      let a2bY = this.a.position.y - this.b.position.y;
      let a2bZ = this.a.position.z - this.b.position.z;

      let a2bDistanceSquared = a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ;

      if ( a2bDistanceSquared < this.distanceMinSquared ) {
        a2bDistanceSquared = this.distanceMinSquared;
      }

      const force = this.k * this.a.mass * this.b.mass / a2bDistanceSquared;

      const length = Math.sqrt(a2bDistanceSquared);

      // make unit vector

      a2bX /= length;
      a2bY /= length;
      a2bZ /= length;

      // multiply by force

      a2bX *= force;
      a2bY *= force;
      a2bZ *= force;

      // apply

      if (this.a.isFree()) {
        this.a.force.add( -a2bX, -a2bY, -a2bZ );
      }

      if (this.b.isFree()) {
        this.b.force.add( a2bX, a2bY, a2bZ );
      }
    }
  }
}
