import { Accessory } from '@smolpack/home-types';
import Home from './home';
import { HassDeviceRegistryEntry } from './types/hass';
import Entity from './entity';

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

  get services(): Entity[] {
    return this.entities;
  }

  // Hass

  get idetntifiers(): Array<[string, string]> {
    return this.hassDevice.identifiers;
  }

  get entities(): Entity[] {
    return Object.values(this.home.hass.entities)
      .filter((entity) => entity.device_id === this.uniqueIdentifier)
      .map((entitiy) => new Entity(this.home, entitiy));
  }

  entitiesWithDomains(domains: string[]): Entity[] {
    return this.entities.filter((entity) => domains.includes(entity.domain));
  }
}
