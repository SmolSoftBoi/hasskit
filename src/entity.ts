import { Service } from '@smolpack/home-types';
import Home from './home';
import { HassEntityRegistryDisplayEntry } from './types/hass';
import State from './state';
import Device from './device';
import { AutomationEntity, ClimateEntity, LightEntity } from './entities';

export type EntityDomain = 'automation' | 'climate' | 'light' | string;

export type EntityTypes =
  | Entity
  | AutomationEntity
  | ClimateEntity
  | LightEntity;

type EntityCache = {
  state: State;
};

export default class Entity implements Service {
  home: Home;
  hassEntity: HassEntityRegistryDisplayEntry;

  protected cahce: Partial<EntityCache> = {};

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

  get identifier(): string {
    return this.uniqueIdentifier.split('.')[1];
  }

  get areaIdentifier(): string | void {
    if (this.hassEntity.area_id) {
      return this.hassEntity.area_id;
    }

    if (this.device && this.device.area) {
      return this.device.area.uniqueIdentifier;
    }
  }

  get deviceIdentifier(): string | void {
    return this.hassEntity.device_id || void 0;
  }

  get state(): State {
    if (!this.cahce.state) {
      this.cahce.state = new State(
        this.home,
        this.home.hass.states[this.hassEntity.entity_id],
      );
    }

    return this.cahce.state;
  }

  get device(): Device | void {
    return this.home.devices.find(
      (device) => device.uniqueIdentifier === this.deviceIdentifier,
    );
  }

  get domain(): string {
    return this.hassEntity.entity_id.split('.')[0];
  }

  get platform(): string | void {
    return this.hassEntity.platform;
  }
}
