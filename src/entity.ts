import { Service } from '@smolpack/home-types';
import Home from './home';
import { HassEntityRegistryDisplayEntry } from './types/hass';
import Characteristic from './characteristic';
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

  get characteristics(): Characteristic[] {
    return [
      new Characteristic(this.home, this.home.hass.states[this.hassEntity]),
    ];
  }

  get serviceType(): EntityDomain {
    return this.domain;
  }

  get accessory(): Device | void {
    return this.device;
  }

  // Hass

  get device(): Device | void {
    return this.home.devices.find(
      (device) => device.uniqueIdentifier === this.hassEntity.device_id,
    );
  }

  get domain(): string {
    return this.hassEntity.entity_id.split('.')[1];
  }

  get platform(): string | void {
    return this.hassEntity.platform;
  }
}
