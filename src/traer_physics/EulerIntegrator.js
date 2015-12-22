/* @flow */

import type { ParticleSystem } from './ParticleSystem';

export class EulerIntegrator /* implements Integrator */ {
  s: ParticleSystem;

  constructor(s: ParticleSystem) {
    this.s = s;
  }

  step(t: number): void {
    this.s._clearForces();
    this.s._applyForces();

    for (let i = 0; i < this.s.numberOfParticles(); i++ ) {
      const p = this.s.getParticle(i);
      if (p.isFree()) {
        p.velocity.add( p.force.x/(p.mass*t), p.force.y/(p.mass*t), p.force.z/(p.mass*t) );
        p.position.add( p.velocity.x/t, p.velocity.y/t, p.velocity.z/t );
      }
    }
  }
}
