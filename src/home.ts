import { Home as HomeType } from '@smolpack/home-types';
import { Hass } from './types/hass';
import Entity from './entity';
import Device from './device';
import { WEATHERKIT_PLATFORM } from './integrations/weatherkit';
import {
  MAGIC_AREAS_GLOBAL_DEVICE_ID,
  MAGIC_AREAS_PLATFORM,
} from './integrations/magicAreas';
import Floor from './floor';
import Area from './area';
import User from './user';

export type HomeConfig = object;

export default class Home implements HomeType {
  hass: Hass;
  config: HomeConfig;

  constructor(hass: Hass, config?: HomeConfig) {
    this.hass = hass;
    this.config = config || {};
  }

  // Home

  get name(): string {
    return this.hass.config.location_name;
  }

  get rooms(): Area[] {
    return this.areas;
  }

  get zones(): Floor[] {
    return this.floors;
  }

  get accessories(): Device[] {
    return this.devices;
  }

  servicesWithTypes(serviceTypes: string[]): Entity[] {
    return this.entitiesWithDomains(serviceTypes);
  }

  get state():
    | 'NOT_RUNNING'
    | 'STARTING'
    | 'RUNNING'
    | 'STOPPING'
    | 'FINAL_WRITE' {
    return this.hass.config.state;
  }

  get currentUser(): User {
    if (!this.hass.user) {
      throw new Error();
    }

    return new User(this, this.hass.user);
  }

  // Hass

  get areas(): Area[] {
    return Object.values(this.hass.areas).map((area) => new Area(this, area));
  }

  get floors(): Floor[] {
    return Object.values(this.hass.floors).map(
      (floor) => new Floor(this, floor),
    );
  }

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

  get climateEntity(): Entity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID,
      ),
    );

    if (magicAreasGlobalDevice) {
      const magicAreasGlobalClimateEntities =
        magicAreasGlobalDevice.entitiesWithDomains(['climate']);

      if (magicAreasGlobalClimateEntities.length > 0) {
        return magicAreasGlobalClimateEntities[0];
      }
    }

    const climateEntities = this.entitiesWithDomains(['climate']);

    if (climateEntities.length === 1) {
      return climateEntities[0];
    }
  }

  get lightEntity(): Entity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID,
      ),
    );

    if (magicAreasGlobalDevice) {
      const magicAreasGlobalLightEntities =
        magicAreasGlobalDevice.entitiesWithDomains(['light']);

      if (magicAreasGlobalLightEntities.length > 0) {
        return magicAreasGlobalLightEntities[0];
      }
    }

    const lightEntities = this.entitiesWithDomains(['light']);

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }

  get lockEntity(): Entity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID,
      ),
    );

    if (magicAreasGlobalDevice) {
      const magicAreasGlobalLockEntities =
        magicAreasGlobalDevice.entitiesWithDomains(['lock']);

      if (magicAreasGlobalLockEntities.length > 0) {
        return magicAreasGlobalLockEntities[0];
      }
    }

    const lockEntities = this.entitiesWithDomains(['lock']);

    if (lockEntities.length === 1) {
      return lockEntities[0];
    }
  }

  get mediaPlayerEntity(): Entity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID,
      ),
    );

    if (magicAreasGlobalDevice) {
      const magicAreasGlobalMediaPlayerEntities =
        magicAreasGlobalDevice.entitiesWithDomains(['media_player']);

      if (magicAreasGlobalMediaPlayerEntities.length > 0) {
        return magicAreasGlobalMediaPlayerEntities[0];
      }
    }

    const mediaPlayerEntities = this.entitiesWithDomains(['media_player']);

    if (mediaPlayerEntities.length === 1) {
      return mediaPlayerEntities[0];
    }
  }

  get c02SignalEntity(): Entity | void {
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

  get wasteEntity(): Entity | void {
    const wasteEntities = this.entitiesWithDomains(['calendar']).filter(
      (entity) => entity.name.includes('waste'),
    );

    if (wasteEntities.length > 0) {
      return wasteEntities[0];
    }
  }
}
