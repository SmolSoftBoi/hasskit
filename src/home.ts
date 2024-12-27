import { Home as HomeType } from '@smolpack/home-types';
import { Hass } from './types/hass';
import Entity from './entity';
import Device from './device';
import { WEATHERKIT_PLATFORM } from './integrations/weatherkit';

export type HomeConfig = object;

export default class Home implements HomeType {
  hass: Hass;
  config: HomeConfig;

  constructor(hass: Hass, config?: HomeConfig) {
    this.hass = hass;
    this.config = config || {};
  }

  // Home

  get accessories(): Device[] {
    return this.devices;
  }

  servicesWithTypes(serviceTypes: string[]): Entity[] {
    return this.entitiesWithDomains(serviceTypes);
  }

  // Hass

  get devices(): Device[] {
    return Object.values(this.hass.devices).map(
      (device) => new Device(this, device),
    );
  }

  entitiesWithDomains(domains: string[]): Entity[] {
    return this.entities.filter((entity) => domains.includes(entity.domain));
  }

  get entities(): Entity[] {
    return Object.values(this.hass.entities).map(
      (entity) => new Entity(this, entity),
    );
  }

  get weatherEntity(): Entity | void {
    const weatherEntities = this.entitiesWithDomains(['weather']);

    if (weatherEntities.length > 0) {
      const weatherKitEntity = weatherEntities.find(
        (entity) => entity.platform === WEATHERKIT_PLATFORM,
      );

      if (weatherKitEntity) {
        return weatherKitEntity;
      }

      return weatherEntities[0];
    }
  }

  get energyEntity(): Entity | void {
    const c02SignalDevices = this.devices.filter((device) =>
      device.idetntifiers.filter(
        (identifiers) => identifiers[0] === 'c02signal',
      ),
    );

    if (c02SignalDevices.length > 0) {
      const c02SignalEntities: Entity[] = [];

      for (const c02SignalDevice of c02SignalDevices) {
        c02SignalEntities.push(
          ...c02SignalDevice.entities.filter(
            (entity) => entity.characteristics[0].units === '%',
          ),
        );
      }

      if (c02SignalEntities.length > 0) {
        return c02SignalEntities[0];
      }
    }
  }
}
