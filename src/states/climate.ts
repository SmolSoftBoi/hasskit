import Home from '../home';
import State from '../state';
import { HassClimateEntity } from '../types/hass-climate';

export default class ClimateState extends State {
  hassState: HassClimateEntity;

  constructor(home: Home, hassState: HassClimateEntity) {
    super(home, hassState);
    this.hassState = hassState;
  }

  get fanModes(): string[] {
    return this.hassState.attributes.fan_modes || [];
  }
}
