/* @flow */

import { Attraction } from './Attraction';
import { Particle } from './Particle';
import { ModifiedEulerIntegrator } from './ModifiedEulerIntegrator';
import { RungeKuttaIntegrator } from './RungeKuttaIntegrator';
import { Spring } from './Spring';
import { Vector3D } from './Vector3D';
import type { Force } from './Force';
import type { Integrator } from './Integrator';

const _DEFAULT_GRAVITY: number = 0;
const _DEFAULT_DRAG: number = 0.001;

export class ParticleSystem {
  static RUNGE_KUTTA;
  static MODIFIED_EULER;

  particles: Array<Particle>;
  springs: Array<Spring>;
  attractions: Array<Attraction>;
  customForces: Array<Force>;

  integrator: Integrator;

  gravity: Vector3D;
  drag: number;

  hasDeadParticles: boolean;

  // constructor()
  // constructor(g: number, drag: number)
  constructor(gx?: number, gy?: number, gz?: number, drag?: number) {
    let _gx, _gy, _gz, _drag;
    if (arguments.length === 0) {
      _gx = 0;
      _gy = _DEFAULT_GRAVITY;
      _gz = 0;
      _drag = _DEFAULT_DRAG;
    } else if (arguments.length <= 2) {
      _gx = 0;
      _gy = gx;
      _gz = 0;
      _drag = gy;
    } else {
      _gx = gx;
      _gy = gy;
      _gz = gz;
      _drag = drag;
    }

    this.particles = [];
    this.springs = [];
    this.attractions = [];
    this.customForces = [];

    this.integrator = new RungeKuttaIntegrator(this);

    this.gravity = new Vector3D(_gx, _gy, _gz);
    this.drag = _drag || _DEFAULT_DRAG;

    this.hasDeadParticles = false;
  }

  setIntegrator(integrator: number): void {
    switch (integrator) {
      case ParticleSystem.RUNGE_KUTTA:
        this.integrator = new RungeKuttaIntegrator(this);
        break;
      case ParticleSystem.MODIFIED_EULER:
        this.integrator = new ModifiedEulerIntegrator(this);
        break;
    }
  }

  // setGravity(g: number): void
  setGravity(x: number, y?: number, z?: number): void {
    if (arguments.length === 1) {
      // default down gravity
      this.gravity.set(0, x, 0);
    } else {
      if (y == null || z == null) {
        throw new Error();
      }
      this.gravity.set(x, y, z);
    }
  }

  setDrag(d: number): void {
    this.drag = d;
  }

  tick(t: number = 1): void {
    this.integrator.step(t);
  }

  makeParticle(mass: number = 1, x: number = 0, y: number = 0, z: number = 0): Particle {
    const p = new Particle(mass);
    p.position.set(x, y, z);
    this.particles.push(p);
    return p;
  }

  makeSpring(a: Particle, b: Particle, ks: number, d: number, r: number): Spring {
    const s = new Spring(a, b, ks, d, r);
    this.springs.push(s);
    return s;
  }

  makeAttraction(a: Particle, b: Particle, k: number, minDistance: number): Attraction {
    const m = new Attraction(a, b, k, minDistance);
    this.attractions.push(m);
    return m;
  }

  clear(): void {
    this.particles = [];
    this.springs = [];
    this.attractions = [];
    this.customForces = [];
  }

  _applyForces(): void {
    if (!this.gravity.isZero()) {
      for (let i = 0; i < this.particles.length; ++i) {
        const p = this.particles[i];
        p.force.addV(this.gravity);
      }
    }

    for (let i = 0; i < this.particles.length; ++i) {
      const p = this.particles[i];
      p.force.add(p.velocity.x * -this.drag, p.velocity.y * -this.drag, p.velocity.z * -this.drag);
    }

    for (let i = 0; i < this.springs.length; i++) {
      const f = this.springs[i];
      f.apply();
    }

    for (let i = 0; i < this.attractions.length; i++) {
      const f = this.attractions[i];
      f.apply();
    }

    for (let i = 0; i < this.customForces.length; i++) {
      const f = this.customForces[i];
      f.apply();
    }
  }

  _clearForces(): void {
    for (let p of this.particles) {
      p.force.clear();
    }
  }

  numberOfParticles(): number {
    return this.particles.length;
  }

  numberOfSprings(): number {
    return this.springs.length;
  }

  numberOfAttractions(): number {
    return this.attractions.length;
  }

  getParticle(i: number): Particle {
    return this.particles[i];
  }

  getSpring(i: number): Spring {
    return this.springs[i];
  }

  getAttraction(i: number): Attraction {
    return this.attractions[i];
  }

  addCustomForce(f: Force): void {
    this.customForces.push(f);
  }

  numberOfCustomForces(): number {
    return this.customForces.length;
  }

  getCustomForce(i: number): Force {
    return this.customForces[i];
  }

  removeParticle(a: number | Particle): ?Particle {
    const i = typeof a === 'number' ? a : this.particles.indexOf(a);
    if (i !== -1) {
      return this.particles.splice(i, 1)[0];
    }
  }

  removeAttraction(a: number | Attraction): ?Attraction {
    const i = typeof a === 'number' ? a : this.attractions.indexOf(a);
    if (i !== -1) {
      return this.attractions.splice(i, 1)[0];
    }
  }

  removeSpring(a: number | Spring): ?Spring {
    const i = typeof a === 'number' ? a : this.springs.indexOf(a);
    if (i !== -1) {
      return this.springs.splice(i, 1)[0];
    }
  }

  removeCustomForce(a: number | Force): ?Force {
    const i = typeof a === 'number' ? a : this.customForces.indexOf(a);
    if (i !== -1) {
      return this.customForces.splice(i, 1)[0];
    }
  }
}

ParticleSystem.RUNGE_KUTTA = 0;
ParticleSystem.MODIFIED_EULER = 1;
