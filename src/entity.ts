import { Service } from '@smolpack/home-types';
import Home from './home';
import { HassEntityRegistryDisplayEntry } from './types/hass';
import State from './state';
import Device from './device';

export type EntityDomain = string;

export default class Entity implements Service {
  home: Home;
  hassEntity: HassEntityRegistryDisplayEntry;

  constructor(home: Home, entity: HassEntityRegistryDisplayEntry) {
    this.home = home;
    this.hassEntity = entity;
  }

  // Home

  get name(): string {
    return this.hassEntity.name || '';
  }

  get uniqueIdentifier(): string {
    return this.hassEntity.entity_id;
  }

  get characteristics(): State[] {
    return [this.state];
  }

  get serviceType(): EntityDomain {
    return this.domain;
  }

  get accessory(): Device | void {
    return this.device;
  }

  // Hass

  get areaIdentifier(): string | void {
    return this.hassEntity.area_id || void 0;
  }

  get deviceIdentifier(): string | void {
    return this.hassEntity.device_id || void 0;
  }

  get state(): State {
    return new State(
      this.home,
      this.home.hass.states[this.hassEntity.entity_id],
    );
  }

  get device(): Device | void {
    return this.home.devices.find(
      (device) => device.uniqueIdentifier === this.hassEntity.device_id,
    );
  }

  get domain(): string {
    return this.hassEntity.entity_id.split('.')[0];
  }

  get platform(): string | void {
    return this.hassEntity.platform;
  }
}
