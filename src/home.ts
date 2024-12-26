import { ReadonlyHome } from '@smolpack/home-types';
import { Hass } from './types/hass';

export default class Home implements ReadonlyHome {
  readonly hass: Hass;

  constructor(hass: Hass) {
    this.hass = hass;
  }
}
