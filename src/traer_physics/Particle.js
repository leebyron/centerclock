/* @flow */

import { Vector3D } from './Vector3D';

export class Particle {
  position: Vector3D;
  velocity: Vector3D;
  force: Vector3D;
  mass: number;
  age: number;
  dead: boolean;
  fixed: boolean;

  constructor(m: number) {
    this.position = new Vector3D();
    this.velocity = new Vector3D();
    this.force = new Vector3D();
    this.mass = m;
    this.fixed = false;
    this.age = 0;
    this.dead = false;
  }

  distanceTo(p: Particle): number {
    return this.position.distanceToV(p.position);
  }

  makeFixed(): void {
    this.fixed = true;
    this.velocity.clear();
  }

  isFixed(): boolean {
    return this.fixed;
  }

  isFree(): boolean {
    return !this.fixed;
  }

  makeFree(): void {
    this.fixed = false;
  }

  setMass(m: number): void {
    this.mass = m;
  }

  _reset() {
    this.age = 0;
    this.dead = false;
    this.position.clear();
    this.velocity.clear();
    this.force.clear();
    this.mass = 1;
  }
}
