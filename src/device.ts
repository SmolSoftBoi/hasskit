import { Accessory } from '@smolpack/home-types';
import Home from './home';
import { HassDeviceRegistryEntry } from './types/hass';
import Entity, { EntityDomain, EntityTypes } from './entity';
import Area from './area';

export default class Device implements Accessory {
  home: Home;
  hassDevice: HassDeviceRegistryEntry;

  constructor(home: Home, device: HassDeviceRegistryEntry) {
    this.home = home;
    this.hassDevice = device;
  }

  // Home

  get uniqueIdentifier(): string {
    return this.hassDevice.id;
  }

  get name(): string {
    return this.hassDevice.name || '';
  }

  get room(): Area | void {
    return this.area;
  }

  get isBlocked(): boolean {
    return this.hassDevice.disabled_by !== null;
  }

  get services(): Entity[] {
    return this.entities;
  }

  get manufacturer(): string | void {
    return this.hassDevice.manufacturer || void 0;
  }

  get model(): string | void {
    return this.hassDevice.model || void 0;
  }

  // Hass

  get identifiers(): Array<[string, string]> {
    return this.hassDevice.identifiers;
  }

  get area(): Area | void {
    return this.home.areas.find(
      (area) => area.uniqueIdentifier === this.hassDevice.area_id,
    );
  }

  get entities(): Entity[] {
    return this.home.entities.filter(
      (entity) => entity.deviceIdentifier === this.uniqueIdentifier,
    );
  }

  entitiesWithDomains(domains: EntityDomain[]): EntityTypes[] {
    return this.entities.filter((entity) => domains.includes(entity.domain));
  }
}
