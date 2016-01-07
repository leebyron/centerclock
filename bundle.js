(function (p5) { 'use strict';

  p5 = 'default' in p5 ? p5['default'] : p5;

  var babelHelpers_classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var babelHelpers_createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var babelHelpers_inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var babelHelpers_possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Vector3D = function () {
    function Vector3D() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var z = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      babelHelpers_classCallCheck(this, Vector3D);

      this.x = x;
      this.y = y;
      this.z = z;
    }

    babelHelpers_createClass(Vector3D, [{
      key: 'setX',
      value: function setX(x) {
        this.x = x;
      }
    }, {
      key: 'setY',
      value: function setY(y) {
        this.y = y;
      }
    }, {
      key: 'setZ',
      value: function setZ(z) {
        this.z = z;
      }
    }, {
      key: 'set',
      value: function set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    }, {
      key: 'setV',
      value: function setV(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
      }
    }, {
      key: 'add',
      value: function add(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
      }
    }, {
      key: 'addV',
      value: function addV(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
      }
    }, {
      key: 'subtract',
      value: function subtract(x, y, z) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
      }
    }, {
      key: 'subtractV',
      value: function subtractV(v) {
        this.x = -v.x;
        this.y = -v.y;
        this.z = -v.z;
      }
    }, {
      key: 'multiplyBy',
      value: function multiplyBy(f) {
        this.x *= f;
        this.y *= f;
        this.z *= f;
        return this;
      }
    }, {
      key: 'distanceTo',
      value: function distanceTo(x, y, z) {
        var dx = this.x - x;
        var dy = this.y - y;
        var dz = this.z - z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    }, {
      key: 'distanceToV',
      value: function distanceToV(v) {
        return Math.sqrt(this.distanceSquaredTo(v));
      }
    }, {
      key: 'distanceSquaredTo',
      value: function distanceSquaredTo(p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        var dz = this.z - p.z;
        return dx * dx + dy * dy + dz * dz;
      }
    }, {
      key: 'dot',
      value: function dot(p) {
        return this.x * p.x + this.y * p.y + this.z * p.z;
      }
    }, {
      key: 'length',
      value: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }
    }, {
      key: 'lengthSquared',
      value: function lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
    }, {
      key: 'toString',
      value: function toString() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
      }
    }, {
      key: 'cross',
      value: function cross(p) {
        return new Vector3D(this.y * p.z - this.z * p.y, this.x * p.z - this.z * p.x, this.x * p.y - this.y * p.x);
      }
    }, {
      key: 'isZero',
      value: function isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0;
      }
    }]);
    return Vector3D;
  }();

  var Particle = function () {
    function Particle(m) {
      babelHelpers_classCallCheck(this, Particle);

      this.position = new Vector3D();
      this.velocity = new Vector3D();
      this.force = new Vector3D();
      this.mass = m;
      this.fixed = false;
      this.age = 0;
      this.dead = false;
    }

    babelHelpers_createClass(Particle, [{
      key: 'distanceTo',
      value: function distanceTo(p) {
        return this.position.distanceToV(p.position);
      }
    }, {
      key: 'makeFixed',
      value: function makeFixed() {
        this.fixed = true;
        this.velocity.clear();
      }
    }, {
      key: 'isFixed',
      value: function isFixed() {
        return this.fixed;
      }
    }, {
      key: 'isFree',
      value: function isFree() {
        return !this.fixed;
      }
    }, {
      key: 'makeFree',
      value: function makeFree() {
        this.fixed = false;
      }
    }, {
      key: 'setMass',
      value: function setMass(m) {
        this.mass = m;
      }
    }, {
      key: '_reset',
      value: function _reset() {
        this.age = 0;
        this.dead = false;
        this.position.clear();
        this.velocity.clear();
        this.force.clear();
        this.mass = 1;
      }
    }]);
    return Particle;
  }();

  // attract positive repel negative

  var Attraction /* implements Force */ = function () {
    function Attraction(a, b, k, distanceMin) {
      babelHelpers_classCallCheck(this, Attraction);

      this.a = a;
      this.b = b;
      this.k = k;
      this.on = true;
      this.distanceMin = distanceMin;
      this.distanceMinSquared = distanceMin * distanceMin;
    }

    babelHelpers_createClass(Attraction, [{
      key: '_setA',
      value: function _setA(p) {
        this.a = p;
      }
    }, {
      key: '_setB',
      value: function _setB(p) {
        this.b = p;
      }
    }, {
      key: 'getMinimumDistance',
      value: function getMinimumDistance() {
        return this.distanceMin;
      }
    }, {
      key: 'setMinimumDistance',
      value: function setMinimumDistance(d) {
        this.distanceMin = d;
        this.distanceMinSquared = d * d;
      }
    }, {
      key: 'turnOff',
      value: function turnOff() {
        this.on = false;
      }
    }, {
      key: 'turnOn',
      value: function turnOn() {
        this.on = true;
      }
    }, {
      key: 'setStrength',
      value: function setStrength(k) {
        this.k = k;
      }
    }, {
      key: 'getOneEnd',
      value: function getOneEnd() {
        return this.a;
      }
    }, {
      key: 'getTheOtherEnd',
      value: function getTheOtherEnd() {
        return this.b;
      }
    }, {
      key: 'getStrength',
      value: function getStrength() {
        return this.k;
      }
    }, {
      key: 'isOn',
      value: function isOn() {
        return this.on;
      }
    }, {
      key: 'isOff',
      value: function isOff() {
        return !this.on;
      }
    }, {
      key: 'apply',
      value: function apply() {
        if (this.on && (this.a.isFree() || this.b.isFree())) {
          var a2bX = this.a.position.x - this.b.position.x;
          var a2bY = this.a.position.y - this.b.position.y;
          var a2bZ = this.a.position.z - this.b.position.z;

          var a2bDistanceSquared = a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ;

          if (a2bDistanceSquared < this.distanceMinSquared) {
            a2bDistanceSquared = this.distanceMinSquared;
          }

          var force = this.k * this.a.mass * this.b.mass / a2bDistanceSquared;

          var length = Math.sqrt(a2bDistanceSquared);

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
            this.a.force.add(-a2bX, -a2bY, -a2bZ);
          }

          if (this.b.isFree()) {
            this.b.force.add(a2bX, a2bY, a2bZ);
          }
        }
      }
    }]);
    return Attraction;
  }();

  var Spring /* implements Force */ = function () {
    function Spring(a, b, ks, d, r) {
      babelHelpers_classCallCheck(this, Spring);

      this.springConstant = ks;
      this.damping = d;
      this.restLength = r;
      this.a = a;
      this.b = b;
      this.on = true;
    }

    babelHelpers_createClass(Spring, [{
      key: 'turnOff',
      value: function turnOff() {
        this.on = false;
      }
    }, {
      key: 'turnOn',
      value: function turnOn() {
        this.on = true;
      }
    }, {
      key: 'isOn',
      value: function isOn() {
        return this.on;
      }
    }, {
      key: 'isOff',
      value: function isOff() {
        return !this.on;
      }
    }, {
      key: 'getOneEnd',
      value: function getOneEnd() {
        return this.a;
      }
    }, {
      key: 'getTheOtherEnd',
      value: function getTheOtherEnd() {
        return this.b;
      }
    }, {
      key: 'currentLength',
      value: function currentLength() {
        return this.a.position.distanceToV(this.b.position);
      }
    }, {
      key: 'restLength',
      value: function restLength() {
        return this.restLength;
      }
    }, {
      key: 'strength',
      value: function strength() {
        return this.springConstant;
      }
    }, {
      key: 'setStrength',
      value: function setStrength(ks) {
        this.springConstant = ks;
      }
    }, {
      key: 'damping',
      value: function damping() {
        return this.damping;
      }
    }, {
      key: 'setDamping',
      value: function setDamping(d) {
        this.damping = d;
      }
    }, {
      key: 'setRestLength',
      value: function setRestLength(l) {
        this.restLength = l;
      }
    }, {
      key: 'apply',
      value: function apply() {
        if (this.on && (this.a.isFree() || this.b.isFree())) {
          var a2bX = this.a.position.x - this.b.position.x;
          var a2bY = this.a.position.y - this.b.position.y;
          var a2bZ = this.a.position.z - this.b.position.z;

          var a2bDistance = Math.sqrt(a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ);

          if (a2bDistance == 0) {
            a2bX = 0;
            a2bY = 0;
            a2bZ = 0;
          } else {
            a2bX /= a2bDistance;
            a2bY /= a2bDistance;
            a2bZ /= a2bDistance;
          }

          // spring force is proportional to how much it stretched

          var springForce = -(a2bDistance - this.restLength) * this.springConstant;

          // want velocity along line b/w a & b, damping force is proportional to this

          var Va2bX = this.a.velocity.x - this.b.velocity.x;
          var Va2bY = this.a.velocity.y - this.b.velocity.y;
          var Va2bZ = this.a.velocity.z - this.b.velocity.z;

          var dampingForce = -this.damping * (a2bX * Va2bX + a2bY * Va2bY + a2bZ * Va2bZ);

          // forceB is same as forceA in opposite direction

          var r = springForce + dampingForce;

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
    }, {
      key: '_setA',
      value: function _setA(p) {
        this.a = p;
      }
    }, {
      key: '_setB',
      value: function _setB(p) {
        this.b = p;
      }
    }]);
    return Spring;
  }();

  var ModifiedEulerIntegrator /* implements Integrator */ = function () {
    function ModifiedEulerIntegrator(s) {
      babelHelpers_classCallCheck(this, ModifiedEulerIntegrator);

      this.s = s;
    }

    babelHelpers_createClass(ModifiedEulerIntegrator, [{
      key: 'step',
      value: function step(t) {
        this.s._clearForces();
        this.s._applyForces();

        var halftt = 0.5 * t * t;

        for (var i = 0; i < this.s.numberOfParticles(); i++) {
          var p = this.s.getParticle(i);
          if (p.isFree()) {
            var ax = p.force.x / p.mass;
            var ay = p.force.y / p.mass;
            var az = p.force.z / p.mass;

            p.position.add(p.velocity.x / t, p.velocity.y / t, p.velocity.z / t);
            p.position.add(ax * halftt, ay * halftt, az * halftt);
            p.velocity.add(ax / t, ay / t, az / t);
          }
        }
      }
    }]);
    return ModifiedEulerIntegrator;
  }();

  var RungeKuttaIntegrator /* implements Integrator */ = function () {
    function RungeKuttaIntegrator(s) {
      babelHelpers_classCallCheck(this, RungeKuttaIntegrator);

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

    babelHelpers_createClass(RungeKuttaIntegrator, [{
      key: 'allocateParticles',
      value: function allocateParticles() {
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
    }, {
      key: 'step',
      value: function step(deltaT) {
        this.allocateParticles();
        /////////////////////////////////////////////////////////
        // save original position and velocities

        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            this.originalPositions[i].setV(p.position);
            this.originalVelocities[i].setV(p.velocity);
          }

          p.force.clear(); // and clear the forces
        }

        ////////////////////////////////////////////////////////
        // get all the k1 values

        this.s._applyForces();

        // save the intermediate forces
        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            this.k1Forces[i].setV(p.force);
            this.k1Velocities[i].setV(p.velocity);
          }

          p.force.clear();
        }

        ////////////////////////////////////////////////////////////////
        // get k2 values

        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            var originalPosition = this.originalPositions[i];
            var k1Velocity = this.k1Velocities[i];

            p.position.x = originalPosition.x + k1Velocity.x * 0.5 * deltaT;
            p.position.y = originalPosition.y + k1Velocity.y * 0.5 * deltaT;
            p.position.z = originalPosition.z + k1Velocity.z * 0.5 * deltaT;

            var originalVelocity = this.originalVelocities[i];
            var k1Force = this.k1Forces[i];

            p.velocity.x = originalVelocity.x + k1Force.x * 0.5 * deltaT / p.mass;
            p.velocity.y = originalVelocity.y + k1Force.y * 0.5 * deltaT / p.mass;
            p.velocity.z = originalVelocity.z + k1Force.z * 0.5 * deltaT / p.mass;
          }
        }

        this.s._applyForces();

        // save the intermediate forces
        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            this.k2Forces[i].setV(p.force);
            this.k2Velocities[i].setV(p.velocity);
          }

          p.force.clear(); // and clear the forces now that we are done with them
        }

        /////////////////////////////////////////////////////
        // get k3 values

        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            var originalPosition = this.originalPositions[i];
            var k2Velocity = this.k2Velocities[i];

            p.position.x = originalPosition.x + k2Velocity.x * 0.5 * deltaT;
            p.position.y = originalPosition.y + k2Velocity.y * 0.5 * deltaT;
            p.position.z = originalPosition.z + k2Velocity.z * 0.5 * deltaT;

            var originalVelocity = this.originalVelocities[i];
            var k2Force = this.k2Forces[i];

            p.velocity.x = originalVelocity.x + k2Force.x * 0.5 * deltaT / p.mass;
            p.velocity.y = originalVelocity.y + k2Force.y * 0.5 * deltaT / p.mass;
            p.velocity.z = originalVelocity.z + k2Force.z * 0.5 * deltaT / p.mass;
          }
        }

        this.s._applyForces();

        // save the intermediate forces
        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            this.k3Forces[i].setV(p.force);
            this.k3Velocities[i].setV(p.velocity);
          }

          p.force.clear(); // and clear the forces now that we are done with them
        }

        //////////////////////////////////////////////////
        // get k4 values

        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            var originalPosition = this.originalPositions[i];
            var k3Velocity = this.k3Velocities[i];

            p.position.x = originalPosition.x + k3Velocity.x * deltaT;
            p.position.y = originalPosition.y + k3Velocity.y * deltaT;
            p.position.z = originalPosition.z + k3Velocity.z * deltaT;

            var originalVelocity = this.originalVelocities[i];
            var k3Force = this.k3Forces[i];

            p.velocity.x = originalVelocity.x + k3Force.x * deltaT / p.mass;
            p.velocity.y = originalVelocity.y + k3Force.y * deltaT / p.mass;
            p.velocity.z = originalVelocity.z + k3Force.z * deltaT / p.mass;
          }
        }

        this.s._applyForces();

        // save the intermediate forces
        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          if (p.isFree()) {
            this.k4Forces[i].setV(p.force);
            this.k4Velocities[i].setV(p.velocity);
          }
        }

        /////////////////////////////////////////////////////////////
        // put them all together and what do you get?

        for (var i = 0; i < this.s.particles.length; ++i) {
          var p = this.s.particles[i];
          p.age += deltaT;
          if (p.isFree()) {
            // update position

            var originalPosition = this.originalPositions[i];
            var k1Velocity = this.k1Velocities[i];
            var k2Velocity = this.k2Velocities[i];
            var k3Velocity = this.k3Velocities[i];
            var k4Velocity = this.k4Velocities[i];

            p.position.x = originalPosition.x + deltaT / 6.0 * (k1Velocity.x + 2.0 * k2Velocity.x + 2.0 * k3Velocity.x + k4Velocity.x);
            p.position.y = originalPosition.y + deltaT / 6.0 * (k1Velocity.y + 2.0 * k2Velocity.y + 2.0 * k3Velocity.y + k4Velocity.y);
            p.position.z = originalPosition.z + deltaT / 6.0 * (k1Velocity.z + 2.0 * k2Velocity.z + 2.0 * k3Velocity.z + k4Velocity.z);

            // update velocity

            var originalVelocity = this.originalVelocities[i];
            var k1Force = this.k1Forces[i];
            var k2Force = this.k2Forces[i];
            var k3Force = this.k3Forces[i];
            var k4Force = this.k4Forces[i];

            p.velocity.x = originalVelocity.x + deltaT / (6.0 * p.mass) * (k1Force.x + 2.0 * k2Force.x + 2.0 * k3Force.x + k4Force.x);
            p.velocity.y = originalVelocity.y + deltaT / (6.0 * p.mass) * (k1Force.y + 2.0 * k2Force.y + 2.0 * k3Force.y + k4Force.y);
            p.velocity.z = originalVelocity.z + deltaT / (6.0 * p.mass) * (k1Force.z + 2.0 * k2Force.z + 2.0 * k3Force.z + k4Force.z);
          }
        }
      }
    }]);
    return RungeKuttaIntegrator;
  }();

  var _DEFAULT_GRAVITY = 0;
  var _DEFAULT_DRAG = 0.001;

  var ParticleSystem = function () {

    // constructor()
    // constructor(g: number, drag: number)

    function ParticleSystem(gx, gy, gz, drag) {
      babelHelpers_classCallCheck(this, ParticleSystem);

      var _gx = undefined,
          _gy = undefined,
          _gz = undefined,
          _drag = undefined;
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

    babelHelpers_createClass(ParticleSystem, [{
      key: 'setIntegrator',
      value: function setIntegrator(integrator) {
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

    }, {
      key: 'setGravity',
      value: function setGravity(x, y, z) {
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
    }, {
      key: 'setDrag',
      value: function setDrag(d) {
        this.drag = d;
      }
    }, {
      key: 'tick',
      value: function tick() {
        var t = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        this.integrator.step(t);
      }
    }, {
      key: 'makeParticle',
      value: function makeParticle() {
        var mass = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        var z = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var p = new Particle(mass);
        p.position.set(x, y, z);
        this.particles.push(p);
        return p;
      }
    }, {
      key: 'makeSpring',
      value: function makeSpring(a, b, ks, d, r) {
        var s = new Spring(a, b, ks, d, r);
        this.springs.push(s);
        return s;
      }
    }, {
      key: 'makeAttraction',
      value: function makeAttraction(a, b, k, minDistance) {
        var m = new Attraction(a, b, k, minDistance);
        this.attractions.push(m);
        return m;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.particles = [];
        this.springs = [];
        this.attractions = [];
        this.customForces = [];
      }
    }, {
      key: '_applyForces',
      value: function _applyForces() {
        if (!this.gravity.isZero()) {
          for (var i = 0; i < this.particles.length; ++i) {
            var p = this.particles[i];
            p.force.addV(this.gravity);
          }
        }

        for (var i = 0; i < this.particles.length; ++i) {
          var p = this.particles[i];
          p.force.add(p.velocity.x * -this.drag, p.velocity.y * -this.drag, p.velocity.z * -this.drag);
        }

        for (var i = 0; i < this.springs.length; i++) {
          var f = this.springs[i];
          f.apply();
        }

        for (var i = 0; i < this.attractions.length; i++) {
          var f = this.attractions[i];
          f.apply();
        }

        for (var i = 0; i < this.customForces.length; i++) {
          var f = this.customForces[i];
          f.apply();
        }
      }
    }, {
      key: '_clearForces',
      value: function _clearForces() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            p.force.clear();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'numberOfParticles',
      value: function numberOfParticles() {
        return this.particles.length;
      }
    }, {
      key: 'numberOfSprings',
      value: function numberOfSprings() {
        return this.springs.length;
      }
    }, {
      key: 'numberOfAttractions',
      value: function numberOfAttractions() {
        return this.attractions.length;
      }
    }, {
      key: 'getParticle',
      value: function getParticle(i) {
        return this.particles[i];
      }
    }, {
      key: 'getSpring',
      value: function getSpring(i) {
        return this.springs[i];
      }
    }, {
      key: 'getAttraction',
      value: function getAttraction(i) {
        return this.attractions[i];
      }
    }, {
      key: 'addCustomForce',
      value: function addCustomForce(f) {
        this.customForces.push(f);
      }
    }, {
      key: 'numberOfCustomForces',
      value: function numberOfCustomForces() {
        return this.customForces.length;
      }
    }, {
      key: 'getCustomForce',
      value: function getCustomForce(i) {
        return this.customForces[i];
      }
    }, {
      key: 'removeParticle',
      value: function removeParticle(a) {
        var i = typeof a === 'number' ? a : this.particles.indexOf(a);
        if (i !== -1) {
          return this.particles.splice(i, 1)[0];
        }
      }
    }, {
      key: 'removeAttraction',
      value: function removeAttraction(a) {
        var i = typeof a === 'number' ? a : this.attractions.indexOf(a);
        if (i !== -1) {
          return this.attractions.splice(i, 1)[0];
        }
      }
    }, {
      key: 'removeSpring',
      value: function removeSpring(a) {
        var i = typeof a === 'number' ? a : this.springs.indexOf(a);
        if (i !== -1) {
          return this.springs.splice(i, 1)[0];
        }
      }
    }, {
      key: 'removeCustomForce',
      value: function removeCustomForce(a) {
        var i = typeof a === 'number' ? a : this.customForces.indexOf(a);
        if (i !== -1) {
          return this.customForces.splice(i, 1)[0];
        }
      }
    }]);
    return ParticleSystem;
  }();

  ParticleSystem.RUNGE_KUTTA = 0;
  ParticleSystem.MODIFIED_EULER = 1;

  var EPSILON = 0.00001;
  function CenterClock(p5) {

    // ========================================================================
    //    Point
    // ========================================================================

    var Point = function () {
      function Point(x, y) {
        babelHelpers_classCallCheck(this, Point);

        this.x = x;
        this.y = y;
      }

      babelHelpers_createClass(Point, [{
        key: 'clone',
        value: function clone() {
          return new Point(this.x, this.y);
        }
      }, {
        key: 'distance',
        value: function distance(p) {
          return p5.dist(this.x, this.y, p.x, p.y);
        }
      }, {
        key: 'isZero',
        value: function isZero() {
          if (this.x !== 0) {
            return false;
          }
          if (this.y !== 0) {
            return false;
          }
          return true;
        }

        // some vector functions

      }, {
        key: 'subtract',
        value: function subtract(p) {
          this.x -= p.x;
          this.y -= p.y;
          return this;
        }
      }, {
        key: 'add',
        value: function add(p) {
          this.x += p.x;
          this.y += p.y;
          return this;
        }
      }, {
        key: 'multiply',
        value: function multiply(m) {
          this.x *= m;
          this.y *= m;
          return this;
        }
      }, {
        key: 'divide',
        value: function divide(d) {
          this.x /= d;
          this.y /= d;
          return this;
        }
      }, {
        key: 'magnitude',
        value: function magnitude() {
          return p5.dist(this.x, this.y, 0, 0);
        }
      }, {
        key: 'unit',
        value: function unit() {
          return this.clone().divide(this.magnitude());
        }
      }, {
        key: 'dot',
        value: function dot(p) {
          return this.x * p.x + this.y * p.y;
        }
      }, {
        key: 'toString',
        value: function toString() {
          return '(' + this.x + ',' + this.y + ')';
        }
      }, {
        key: 'equals',
        value: function equals(p) {
          return Math.abs(p.x - this.x) < EPSILON && Math.abs(p.y - this.y) < EPSILON;
        }
      }]);
      return Point;
    }();

    // ========================================================================
    //    Ball
    // ========================================================================

    var Ball = function () {
      function Ball(c, v) {
        babelHelpers_classCallCheck(this, Ball);

        this.center = c;
        this.volume = 0;
        this.addVolume(v);
        this.radius = 0;

        this.children = [];

        if (this.volume > 0) {
          allBalls.push(this);
        }

        this.p = world.makeParticle(1, c.x, c.y, 0);
        this.s = world.makeSpring(this.p, centerWorld, 0.0004, 0.01, 0);
      }

      babelHelpers_createClass(Ball, [{
        key: 'addVolume',
        value: function addVolume(v) {
          if (this.doDestroy) {
            if (this.owner) {
              this.owner.addVolume(v);
            }
            return;
          }

          this.volume += v;
          this.tRadius = Math.pow(this.volume, 0.25);
        }
      }, {
        key: 'push',
        value: function push() {
          this.p.velocity.add(-10, 0, 0);
        }
      }, {
        key: 'addChild',
        value: function addChild(b) {
          b.owner = this;
          this.children.push(b);
        }
      }, {
        key: 'merge',
        value: function merge() {
          if (this.owner) {
            this.owner.addVolume(this.volume);
          }
          this.tRadius = 0;
          this.doDestroy = true;
        }
      }, {
        key: 'mergeChildren',
        value: function mergeChildren() {
          this.setPosition();
          allBalls.push(this);

          // merge all
          for (var i = 0; i < this.children.length; i++) {
            this.children[i].merging = true;
          }
        }
      }, {
        key: 'setPosition',
        value: function setPosition() {
          this.center = new Point(0, 0);

          /*
          for( int i=0; i<children.size(); i++)
           center.add( ((Ball) children.get(i)).center );
           center.divide( children.size() );
           */
          var b = this.children[Math.floor(this.children.length / 2)];
          this.center.add(b.center);
          this.p.position.set(this.center.x, this.center.y, 0);
        }
      }, {
        key: 'update',
        value: function update() {
          this.radius += (this.tRadius - this.radius) * 0.1;

          if (this.doDestroy && this.radius < EPSILON && allBalls.indexOf(this) !== -1) {
            allBalls.splice(allBalls.indexOf(this), 1);
            world.removeParticle(this.p);
            world.removeSpring(this.s);
          }

          if (this.merging) {

            var target = null;
            var tRad = 10;
            var dad = this.owner;
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
              if (!this.doDestroy && this.center.distance(target) < tRad + this.radius) {
                this.merge();
                return;
              }

              // merge?
              var vMerge = target.clone().subtract(this.center).multiply(0.001);
              this.p.velocity.add(vMerge.x, vMerge.y, 0);
              //return;
            }
          }

          // dont overlap other balls
          var noBallOverlap = new Point(0, 0);
          for (var i = 0; i < allBalls.length; i++) {

            // ball du jour
            var b = allBalls[i];

            // don't compare to self
            if (b === this) {
              continue;
            }

            // both merging?
            if (this.merging && b.merging) {
              continue;
            }

            // if we're merging, dont compare to like seconds (or it's minute)
            if ((this.merging || b.merging) && this.isRelated(b)) {
              continue;
            }

            // repel
            var over = this.overlap(b);

            // no overlap?
            if (over == null) {
              continue;
            }

            // add in the force
            noBallOverlap.add(over);
          }

          // dont overlap outer wall
          var ballMag = this.center.magnitude();
          var overlapMag = ballMag + this.radius - p5.width * 0.5;
          if (overlapMag > 0) {
            noBallOverlap.add(this.center.unit().multiply(-overlapMag * 0.2));
          }

          // affect ball
          this.p.velocity.add(noBallOverlap.x, noBallOverlap.y, 0);
        }
      }, {
        key: 'isRelated',
        value: function isRelated(b) {
          if (this === b.owner) {
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
      }, {
        key: 'draw',
        value: function draw() {
          // update point
          this.center.x = this.p.position.x;
          this.center.y = this.p.position.y;

          var s = (this.radius - 6) / 80;
          s = Math.max(s, 0);
          s = Math.pow(s, 0.4);
          s *= 255;

          var h = this.radius / 530;
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

      }, {
        key: 'overlap',
        value: function overlap(b) {

          if (this.center.equals(b.center)) {
            return null;
          }

          // min distance between the two
          var minDist = this.radius + b.radius;

          // do some boolean logic tests to save cpu
          if (Math.abs(this.center.x - b.center.x) > minDist) {
            return null;
          }

          if (Math.abs(this.center.y - b.center.y) > minDist) {
            return null;
          }

          // actual distance
          var distTo = this.center.distance(b.center);
          if (distTo > minDist) {
            return null;
          }

          // return vector to oppose collision
          var _overlap = new Point(b.center.x - this.center.x, b.center.y - this.center.y);
          _overlap.add(_overlap.unit().multiply(-minDist));

          return _overlap.multiply(this.radius / (this.radius + b.radius));
          //return overlap.multiply( b.radius / (radius + b.radius) );
        }
      }]);
      return Ball;
    }();

    // ========================================================================
    //    Day
    // ========================================================================

    var Day = function (_Ball) {
      babelHelpers_inherits(Day, _Ball);

      function Day() {
        babelHelpers_classCallCheck(this, Day);
        return babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Day).call(this, new Point(0, 0), 0));
      }

      babelHelpers_createClass(Day, [{
        key: 'addChild',
        value: function addChild(b) {
          //    super.addChild(b);

          if (this.children.length === 24) {
            activeDay = new Day();
            //      mergeChildren();
            this.setPosition();
            allBalls.push(this);

            // merge all
            for (var i = 0; i < this.children.length; i++) {
              this.children[i].merging = true;
            }
          }

          b.owner = activeDay;
          if (activeDay) {
            activeDay.children.push(b);
          }
        }
      }, {
        key: 'draw',
        value: function draw() {
          this.center.x = this.p.position.x;
          this.center.y = this.p.position.y;

          var s = (this.radius - 6) / 80;
          s = Math.max(s, 0);
          s = Math.pow(s, 0.4);
          s *= 255;

          var h = this.radius / 530;
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
      }]);
      return Day;
    }(Ball);

    // ========================================================================
    //    Hour
    // ========================================================================

    var Hour = function (_Ball2) {
      babelHelpers_inherits(Hour, _Ball2);

      function Hour(n) {
        babelHelpers_classCallCheck(this, Hour);

        if (n == null) {
          var _this2 = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Hour).call(this, new Point(0, 0), 0));

          if (activeDay) {
            activeDay.addChild(_this2);
          }
        } else {
          var _this2 = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Hour).call(this, new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad * 3600));
          //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*3600 );

          if (activeDay) {
            activeDay.addChild(_this2);
          }
        }
        return babelHelpers_possibleConstructorReturn(_this2);
      }

      babelHelpers_createClass(Hour, [{
        key: 'addChild',
        value: function addChild(b) {
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
      }]);
      return Hour;
    }(Ball);

    // ========================================================================
    //    Minute
    // ========================================================================

    var Minute = function (_Ball3) {
      babelHelpers_inherits(Minute, _Ball3);

      function Minute(n) {
        babelHelpers_classCallCheck(this, Minute);

        if (n == null) {
          var _this3 = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Minute).call(this, new Point(0, 0), 0));

          if (activeHour) {
            activeHour.addChild(_this3);
          }
        } else {
          var _this3 = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Minute).call(this, new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad * 60));
          //super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad*60 );

          if (activeHour) {
            activeHour.addChild(_this3);
          }
        }
        return babelHelpers_possibleConstructorReturn(_this3);
      }

      babelHelpers_createClass(Minute, [{
        key: 'addChild',
        value: function addChild(b) {
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
      }]);
      return Minute;
    }(Ball);

    // ========================================================================
    //    Second
    // ========================================================================

    var Second = function (_Ball4) {
      babelHelpers_inherits(Second, _Ball4);

      //Minute m;

      // Second(Point c, float v){
      //   super(c,v);
      //   activeMinute.addChild(this);
      // }

      function Second(n) {
        babelHelpers_classCallCheck(this, Second);

        var _this4 = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(Second).call(this, new Point(Math.random(-20, 20), Math.random(-20, 20)), unitRad));
        //    super( new Point( width*SQRT_HALF*cos((n-0.25)*TWO_PI), width*SQRT_HALF*sin((n-0.25)*TWO_PI) ), unitRad );

        if (activeMinute) {
          activeMinute.addChild(_this4);
        }
        return _this4;
      }

      return Second;
    }(Ball);

    // ========================================================================
    //    CenterClock
    // ========================================================================

    // CONSTANTS

    var entryPoint = new Point(1024, -500);
    var unitRad = 1000;

    var lastSec = undefined;

    var world = new ParticleSystem(0, 0.03);
    var centerWorld = world.makeParticle(1, 0, 0, 0);
    centerWorld.makeFixed();

    // let obsticles = [];
    var allBalls = [];

    var activeDay = new Day();
    var activeHour = undefined;
    var activeMinute = undefined;

    var mask = undefined;

    var timeFilled = undefined;

    p5.setup = function setup() {
      var docElem = document.documentElement;
      var minSize = Math.min(docElem.clientHeight, docElem.clientWidth);
      minSize = Math.floor(minSize * 0.94);
      p5.createCanvas(minSize, minSize);
      p5.colorMode(p5.HSB, 255);
      p5.smooth();
      p5.noStroke();

      // Note, in the original source, a circle-mask image is created here.
      // To achieve the same effect, this source is assumed to be used alongside
      // the index.html file in this same repository, which creates a similar
      // circle-mask effect.
    };

    function update() {
      // calculate some things
      for (var i = 0; i < allBalls.length; i++) {
        var b = allBalls[i];
        b.update();
      }

      world.tick();
    }

    p5.draw = function draw() {
      p5.background(30);

      // center of screen at 0,0
      p5.push();
      p5.translate(p5.width / 2, p5.height / 2);

      var time = undefined;

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

      for (var i = 0; i < allBalls.length; i++) {
        var b = allBalls[i];
        b.draw();
      }

      p5.pop();
    };
  }

  var myp5 = new p5(CenterClock, 'CenterClock');

})(p5);