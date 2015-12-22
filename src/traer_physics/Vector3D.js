/* @flow */

export class Vector3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  setZ(z: number): void {
    this.z = z;
  }

  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setV(v: Vector3D): void {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  add(x: number, y: number, z: number): void {
    this.x += x;
    this.y += y;
    this.z += z;
  }

  addV(v: Vector3D): void {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  subtract(x: number, y: number, z: number): void {
    this.x -= x;
    this.y -= y;
    this.z -= z;
  }

  subtractV(v: Vector3D): void {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
  }

  multiplyBy(f: number): Vector3D {
    this.x *= f;
    this.y *= f;
    this.z *= f;
    return this;
  }

  distanceTo(x: number, y: number, z: number): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  distanceToV(v: Vector3D): number {
    return Math.sqrt(this.distanceSquaredTo(v));
  }

  distanceSquaredTo(p: Vector3D): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    const dz = this.z - p.z;
    return dx * dx + dy * dy + dz * dz;
  }

  dot(p: Vector3D): number {
    return this.x * p.x + this.y * p.y + this.z * p.z;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  clear(): void {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  toString(): string {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
  }

  cross(p: Vector3D): Vector3D {
    return new Vector3D(
      this.y * p.z - this.z * p.y,
      this.x * p.z - this.z * p.x,
      this.x * p.y - this.y * p.x
    );
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
}
