/* @flow */

import type { ParticleSystem } from './ParticleSystem';

export class ModifiedEulerIntegrator /* implements Integrator */ {
  s: ParticleSystem;

  constructor(s: ParticleSystem) {
    this.s = s;
  }

  step(t: number): void {
    this.s._clearForces();
    this.s._applyForces();

    const halftt = 0.5 * t * t;

    for (let i = 0; i < this.s.numberOfParticles(); i++) {
      const p = this.s.getParticle(i);
      if (p.isFree()) {
        const ax = p.force.x / p.mass;
        const ay = p.force.y / p.mass;
        const az = p.force.z / p.mass;

        p.position.add( p.velocity.x/t, p.velocity.y/t, p.velocity.z/t );
        p.position.add( ax*halftt, ay*halftt, az*halftt );
        p.velocity.add( ax/t, ay/t, az/t );
      }
    }
  }
}
