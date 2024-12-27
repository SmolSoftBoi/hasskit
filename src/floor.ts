import { Zone } from '@smolpack/home-types';
import Home from './home';
import { HassFloorRegistryEntry } from './types/hass';
import Area from './area';

export default class Floor implements Zone {
  home: Home;
  hassFloor: HassFloorRegistryEntry;

  constructor(home: Home, floor: HassFloorRegistryEntry) {
    this.home = home;
    this.hassFloor = floor;
  }

  // Home

  get uniqueIdentifier(): string {
    return this.hassFloor.floor_id;
  }

  get rooms(): Area[] {
    return Object.values(this.home.hass.areas).filter(
      (area) => area.floor_id && area.floor_id === this.uniqueIdentifier,
    );
  }
}
