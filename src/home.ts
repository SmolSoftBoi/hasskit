import { Home as HomeType } from '@smolpack/home-types';
import { Hass } from './types/hass';
import Entity, { EntityDomain, EntityTypes } from './entity';
import Device from './device';
import { WEATHERKIT_PLATFORM } from './integrations/weatherkit';
import {
  MAGIC_AREAS_GLOBAL_DEVICE_ID,
  MAGIC_AREAS_PLATFORM,
} from './integrations/magicAreas';
import Floor from './floor';
import Area from './area';
import User from './user';
import { AutomationEntity, ClimateEntity, LightEntity } from './entities';

export type HomeConfig = {
  areas: HomeConfigArea[];
};

export type HomeConfigArea = {
  id: string;
};

type HomeCache = {
  currentUser: User;
  areas: Area[];
  floors: Floor[];
  devices: Device[];
  entities: EntityTypes[];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export default class Home implements HomeType {
  hass: Hass;
  config: HomeConfig = {
    areas: [],
  };

  protected cache: Partial<HomeCache> = {};

  constructor(hass: Hass, config: DeepPartial<HomeConfig> = {}) {
    this.hass = hass;
    this.config = Home.createConfig(config);
  }

  static createConfig(partialConfig: DeepPartial<HomeConfig> = {}) {
    const config: HomeConfig = {
      areas: [],
    };

    if (partialConfig.areas) {
      for (const area of partialConfig.areas) {
        if (area && area.id) {
          config.areas.push({
            id: area.id,
          });
        }
      }
    }

    return config;
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
    if (!this.cache.currentUser) {
      if (!this.hass.user) {
        throw new Error();
      }

      this.cache.currentUser = new User(this, this.hass.user);
    }

    return this.cache.currentUser;
  }

  // Hass

  get areas(): Area[] {
    if (!this.cache.areas) {
      this.cache.areas = Object.values(this.hass.areas)
        .map((area) => new Area(this, area))
        .sort((areaA, areaB) => {
          const indexA = this.config.areas.findIndex(
            (configArea) => configArea.id === areaA.uniqueIdentifier,
          );
          const indexB = this.config.areas.findIndex(
            (configArea) => configArea.id === areaB.uniqueIdentifier,
          );
          return indexA - indexB;
        });
    }

    return this.cache.areas;
  }

  get floors(): Floor[] {
    if (!this.cache.floors) {
      this.cache.floors = Object.values(this.hass.floors)
        .map((floor) => new Floor(this, floor))
        .sort((floorA, floorB) => {
          const levelA = floorA.level || 0;
          const levelB = floorB.level || 0;
          return levelA - levelB;
        });
    }

    return this.cache.floors;
  }

  get devices(): Device[] {
    if (!this.cache.devices) {
      this.cache.devices = Object.values(this.hass.devices).map(
        (device) => new Device(this, device),
      );
    }

    return this.cache.devices;
  }

  entitiesWithDomains(domains: EntityDomain[]): EntityTypes[] {
    return this.entities.filter((entity) => domains.includes(entity.domain));
  }

  get entities(): EntityTypes[] {
    if (!this.cache.entities) {
      this.cache.entities = Object.values(this.hass.entities)
        .map((entity) => {
          switch (entity.entity_id.split('.')[0]) {
            case 'automation':
              return new AutomationEntity(this, entity);
            case 'climate':
              return new ClimateEntity(this, entity);
            case 'light':
              return new LightEntity(this, entity);
            default:
              return new Entity(this, entity);
          }
        })
        .sort((entityA, entityB) => {
          const indexA = this.config.areas.findIndex(
            (configArea) =>
              entityA.area && configArea.id === entityA.area.uniqueIdentifier,
          );
          const indexB = this.config.areas.findIndex(
            (configArea) =>
              entityB.area && configArea.id === entityB.area.uniqueIdentifier,
          );
          return indexA - indexB;
        });
    }

    return this.cache.entities;
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
      device.identifiers.find(
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

  get lightEntity(): LightEntity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.identifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID,
      ),
    );

    if (magicAreasGlobalDevice) {
      const magicAreasGlobalLightEntities =
        magicAreasGlobalDevice.entitiesWithDomains(['light']) as LightEntity[];

      if (magicAreasGlobalLightEntities.length > 0) {
        return magicAreasGlobalLightEntities[0];
      }
    }

    const lightEntities = this.entitiesWithDomains(['light']) as LightEntity[];

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }

  get lockEntity(): Entity | void {
    const magicAreasGlobalDevice = this.devices.find((device) =>
      device.identifiers.find(
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
      device.identifiers.find(
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
      device.identifiers.filter(
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
