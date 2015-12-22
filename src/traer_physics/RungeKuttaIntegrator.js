/* @flow */

import { Vector3D } from './Vector3D';
import type { ParticleSystem } from './ParticleSystem';

export class RungeKuttaIntegrator /* implements Integrator */ {

  originalPositions: Array<Vector3D>;
  originalVelocities: Array<Vector3D>;
  k1Forces: Array<Vector3D>;
  k1Velocities: Array<Vector3D>;
  k2Forces: Array<Vector3D>;
  k2Velocities: Array<Vector3D>;
  k3Forces: Array<Vector3D>;
  k3Velocities: Array<Vector3D>;
  k4Forces: Array<Vector3D>;
  k4Velocities: Array<Vector3D>;
  s: ParticleSystem;

  constructor(s: ParticleSystem) {
    this.s = s;

    this.originalPositions = [];
    this.originalVelocities = [];
    this.k1Forces = [];
    this.k1Velocities = [];
    this.k2Forces = [];
    this.k2Velocities = [];
    this.k3Forces = [];
    this.k3Velocities = [];
    this.k4Forces = [];
    this.k4Velocities = [];
  }

  allocateParticles(): void {
    while (this.s.particles.length > this.originalPositions.length) {
      this.originalPositions.push(new Vector3D());
      this.originalVelocities.push(new Vector3D());
      this.k1Forces.push(new Vector3D());
      this.k1Velocities.push(new Vector3D());
      this.k2Forces.push(new Vector3D());
      this.k2Velocities.push(new Vector3D());
      this.k3Forces.push(new Vector3D());
      this.k3Velocities.push(new Vector3D());
      this.k4Forces.push(new Vector3D());
      this.k4Velocities.push(new Vector3D());
    }
  }

  step(deltaT: number): void {
    this.allocateParticles();
    /////////////////////////////////////////////////////////
    // save original position and velocities

    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        this.originalPositions[i].setV(p.position);
        this.originalVelocities[i].setV(p.velocity);
      }

      p.force.clear();  // and clear the forces
    }

    ////////////////////////////////////////////////////////
    // get all the k1 values

    this.s._applyForces();

    // save the intermediate forces
    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        this.k1Forces[i].setV(p.force);
        this.k1Velocities[i].setV(p.velocity);
      }

      p.force.clear();
    }

    ////////////////////////////////////////////////////////////////
    // get k2 values

    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        const originalPosition = this.originalPositions[i];
        const k1Velocity = this.k1Velocities[i];

        p.position.x = originalPosition.x + k1Velocity.x * 0.5 * deltaT;
        p.position.y = originalPosition.y + k1Velocity.y * 0.5 * deltaT;
        p.position.z = originalPosition.z + k1Velocity.z * 0.5 * deltaT;

        const originalVelocity = this.originalVelocities[i];
        const k1Force = this.k1Forces[i];

        p.velocity.x = originalVelocity.x + k1Force.x * 0.5 * deltaT / p.mass;
        p.velocity.y = originalVelocity.y + k1Force.y * 0.5 * deltaT / p.mass;
        p.velocity.z = originalVelocity.z + k1Force.z * 0.5 * deltaT / p.mass;
      }
    }

    this.s._applyForces();

    // save the intermediate forces
    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        this.k2Forces[i].setV(p.force);
        this.k2Velocities[i].setV(p.velocity);
      }

      p.force.clear();  // and clear the forces now that we are done with them
    }


    /////////////////////////////////////////////////////
    // get k3 values

    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        const originalPosition = this.originalPositions[i];
        const k2Velocity = this.k2Velocities[i];

        p.position.x = originalPosition.x + k2Velocity.x * 0.5 * deltaT;
        p.position.y = originalPosition.y + k2Velocity.y * 0.5 * deltaT;
        p.position.z = originalPosition.z + k2Velocity.z * 0.5 * deltaT;

        const originalVelocity = this.originalVelocities[i];
        const k2Force = this.k2Forces[i];

        p.velocity.x = originalVelocity.x + k2Force.x * 0.5 * deltaT / p.mass;
        p.velocity.y = originalVelocity.y + k2Force.y * 0.5 * deltaT / p.mass;
        p.velocity.z = originalVelocity.z + k2Force.z * 0.5 * deltaT / p.mass;
      }
    }

    this.s._applyForces();

    // save the intermediate forces
    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        this.k3Forces[i].setV(p.force);
        this.k3Velocities[i].setV(p.velocity);
      }

      p.force.clear();  // and clear the forces now that we are done with them
    }


    //////////////////////////////////////////////////
    // get k4 values

    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        const originalPosition = this.originalPositions[i];
        const k3Velocity = this.k3Velocities[i];

        p.position.x = originalPosition.x + k3Velocity.x * deltaT;
        p.position.y = originalPosition.y + k3Velocity.y * deltaT;
        p.position.z = originalPosition.z + k3Velocity.z * deltaT;

        const originalVelocity = this.originalVelocities[i];
        const k3Force = this.k3Forces[i];

        p.velocity.x = originalVelocity.x + k3Force.x * deltaT / p.mass;
        p.velocity.y = originalVelocity.y + k3Force.y * deltaT / p.mass;
        p.velocity.z = originalVelocity.z + k3Force.z * deltaT / p.mass;

      }
    }

    this.s._applyForces();

    // save the intermediate forces
    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      if (p.isFree()) {
        this.k4Forces[i].setV(p.force);
        this.k4Velocities[i].setV(p.velocity);
      }
    }

    /////////////////////////////////////////////////////////////
    // put them all together and what do you get?

    for (let i = 0; i < this.s.particles.length; ++i) {
      const p = this.s.particles[i];
      p.age += deltaT;
      if (p.isFree()) {
        // update position

        const originalPosition = this.originalPositions[i];
        const k1Velocity = this.k1Velocities[i];
        const k2Velocity = this.k2Velocities[i];
        const k3Velocity = this.k3Velocities[i];
        const k4Velocity = this.k4Velocities[i];

        p.position.x = originalPosition.x + deltaT / 6.0 * ( k1Velocity.x + 2.0 * k2Velocity.x + 2.0 * k3Velocity.x + k4Velocity.x );
        p.position.y = originalPosition.y + deltaT / 6.0 * ( k1Velocity.y + 2.0 * k2Velocity.y + 2.0 * k3Velocity.y + k4Velocity.y );
        p.position.z = originalPosition.z + deltaT / 6.0 * ( k1Velocity.z + 2.0 * k2Velocity.z + 2.0 * k3Velocity.z + k4Velocity.z );

        // update velocity

        const originalVelocity = this.originalVelocities[i];
        const k1Force = this.k1Forces[i];
        const k2Force = this.k2Forces[i];
        const k3Force = this.k3Forces[i];
        const k4Force = this.k4Forces[i];

        p.velocity.x = originalVelocity.x + deltaT / ( 6.0 * p.mass ) * ( k1Force.x + 2.0 * k2Force.x + 2.0 * k3Force.x + k4Force.x );
        p.velocity.y = originalVelocity.y + deltaT / ( 6.0 * p.mass ) * ( k1Force.y + 2.0 * k2Force.y + 2.0 * k3Force.y + k4Force.y );
        p.velocity.z = originalVelocity.z + deltaT / ( 6.0 * p.mass ) * ( k1Force.z + 2.0 * k2Force.z + 2.0 * k3Force.z + k4Force.z );
      }
    }
  }
}
