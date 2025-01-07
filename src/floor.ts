import { Zone } from '@smolpack/home-types';
import Home from './home';
import { HassFloorRegistryEntry } from './types/hass';
import Area from './area';
import Entity, { EntityTypes } from './entity';
import {
  MAGIC_AREAS_FLOOR_DEVICE_ID,
  MAGIC_AREAS_PLATFORM,
} from './integrations/magicAreas';
import { LightEntity } from './entities';

export default class Floor implements Zone {
  home: Home;
  hassFloor: HassFloorRegistryEntry;

  constructor(home: Home, floor: HassFloorRegistryEntry) {
    this.home = home;
    this.hassFloor = floor;
  }

  // Home

  get name(): string {
    return this.hassFloor.name;
  }

  get uniqueIdentifier(): string {
    return this.hassFloor.floor_id;
  }

  get rooms(): Area[] {
    return this.areas;
  }

  // Hass

  get icon(): string | void {
    return this.hassFloor.icon || void 0;
  }

  get areas(): Area[] {
    return this.home.areas.filter(
      (area) => area.floorIdentifier === this.uniqueIdentifier,
    );
  }

  entitiesWithDomains(domains: string[]): EntityTypes[] {
    const entities: Entity[] = [];

    for (const area of this.areas) {
      entities.push(...area.entitiesWithDomains(domains));
    }

    return entities;
  }

  get climateEntity(): Entity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.identifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_FLOOR_DEVICE_ID.replace(
              '${floor.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaClimateEntities =
        magicAreasAreaDevice.entitiesWithDomains(['climate']);

      if (magicAreasAreaClimateEntities.length > 0) {
        return magicAreasAreaClimateEntities[0];
      }
    }

    const climateEntities = this.entitiesWithDomains(['climate']);

    if (climateEntities.length === 1) {
      return climateEntities[0];
    }
  }

  get lightEntity(): LightEntity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.identifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_FLOOR_DEVICE_ID.replace(
              '${floor.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaLightEntities =
        magicAreasAreaDevice.entitiesWithDomains(['light']) as LightEntity[];

      if (magicAreasAreaLightEntities.length > 0) {
        return magicAreasAreaLightEntities[0];
      }
    }

    const lightEntities = this.entitiesWithDomains(['light']) as LightEntity[];

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }

  get lockEntity(): Entity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.identifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_FLOOR_DEVICE_ID.replace(
              '${floor.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaLockEntities =
        magicAreasAreaDevice.entitiesWithDomains(['lock']);

      if (magicAreasAreaLockEntities.length > 0) {
        return magicAreasAreaLockEntities[0];
      }
    }

    const lockEntities = this.entitiesWithDomains(['lock']);

    if (lockEntities.length === 1) {
      return lockEntities[0];
    }
  }

  get mediaPlayerEntity(): Entity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.identifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_FLOOR_DEVICE_ID.replace(
              '${floor.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaMediaPlayerEntities =
        magicAreasAreaDevice.entitiesWithDomains(['media_player']);

      if (magicAreasAreaMediaPlayerEntities.length > 0) {
        return magicAreasAreaMediaPlayerEntities[0];
      }
    }

    const mediaPlayerEntities = this.entitiesWithDomains(['media_player']);

    if (mediaPlayerEntities.length === 1) {
      return mediaPlayerEntities[0];
    }
  }
}
