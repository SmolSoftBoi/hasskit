import { Room } from '@smolpack/home-types';
import Home from './home';
import { HassAreaRegistryEntry } from './types/hass';
import Entity from './entity';
import Device from './device';

export default class Area implements Room {
  home: Home;
  hassArea: HassAreaRegistryEntry;

  constructor(home: Home, area: HassAreaRegistryEntry) {
    this.home = home;
    this.hassArea = area;
  }

  // Home

  get name(): string {
    return this.hassArea.name;
  }

  get uniqueIdentifier(): string {
    return this.hassArea.area_id;
  }

  get accessories(): Device[] {
    return this.devices;
  }

  // Hass

  get devices(): Device[] {
    return this.home.devices.filter(
      (device) => device.hassDevice.area_id === this.uniqueIdentifier,
    );
  }

  get entities(): Entity[] {
    return Object.values(this.home.hass.entities)
      .filter((entity) => entity.area_id === this.uniqueIdentifier)
      .map((entity) => new Entity(this.home, entity));
  }

  entitiesWithDomains(domains: string[]): Entity[] {
    return this.entities.filter((entity) => domains.includes(entity.domain));
  }
}
