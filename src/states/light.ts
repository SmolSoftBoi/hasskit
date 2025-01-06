import Home from '../home';
import State from '../state';
import { HassLightColorMode, HassLightEntity } from '../types/hass.light';

export default class Light extends State {
  hassState: HassLightEntity;

  constructor(home: Home, hassState: HassLightEntity) {
    super(home, hassState);
    this.hassState = hassState;
  }

  get supportedColorModes(): HassLightColorMode[] {
    return this.hassState.attributes.supported_color_modes || [];
  }
}
