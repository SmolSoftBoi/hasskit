import { Room } from '@smolpack/home-types';
import Home from './home';
import { HassAreaRegistryEntry } from './types/hass';
import Entity from './entity';
import Device from './device';
import {
  MAGIC_AREAS_AREA_DEVICE_ID,
  MAGIC_AREAS_AREA_LIGHT_GROUP_ENTITY_IDS,
  MAGIC_AREAS_PLATFORM,
} from './integrations/magicAreas';
import { LightEntity } from './entities';

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
    return this.home.entities
      .filter((entity) => entity.areaIdentifier === this.uniqueIdentifier);
  }

  entitiesWithDomains(domains: string[]): (Entity | LightEntity)[] {
    return this.entities
      .filter((entity) => domains.includes(entity.domain))
  }

  get climateEntity(): Entity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_AREA_DEVICE_ID.replace(
              '${area.uniqueIdentifier}',
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

  get lightEntityGroups(): LightEntity[] {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_AREA_DEVICE_ID.replace(
              '${area.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaLightGroupEntities = (
        magicAreasAreaDevice.entitiesWithDomains(['light']) as LightEntity[]
      ).filter((entity) =>
        Object.keys(MAGIC_AREAS_AREA_LIGHT_GROUP_ENTITY_IDS).includes(
          entity.uniqueIdentifier,
        ),
      );

      if (magicAreasAreaLightGroupEntities) {
        return magicAreasAreaLightGroupEntities;
      }
    }

    return this.entitiesWithDomains(['light']) as LightEntity[];
  }

  get lockEntity(): Entity | void {
    const magicAreasAreaDevice = this.home.devices.find((device) =>
      device.idetntifiers.find(
        (identifiers) =>
          identifiers[0] === MAGIC_AREAS_PLATFORM &&
          identifiers[1] ===
            MAGIC_AREAS_AREA_DEVICE_ID.replace(
              '${area.uniqueIdentifier}',
              this.uniqueIdentifier,
            ),
      ),
    );

    if (magicAreasAreaDevice) {
      const magicAreasAreaClimateEntities =
        magicAreasAreaDevice.entitiesWithDomains(['lock']);

      if (magicAreasAreaClimateEntities.length > 0) {
        return magicAreasAreaClimateEntities[0];
      }
    }

    const climateEntities = this.entitiesWithDomains(['climate']);

    if (climateEntities.length === 1) {
      return climateEntities[0];
    }
  }
}
