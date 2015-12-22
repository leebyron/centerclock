/* @flow */

export type Force = {
  turnOn(): void;
  turnOff(): void;
  isOn(): boolean;
  isOff(): boolean;
  apply(): void;
}
