import Entity from '../entity';
import { LightState } from '../states';

export default class LightEntity extends Entity {
  get state(): LightState {
    if (!this.cahce.state) {
      this.cahce.state = new LightState(
        this.home,
        this.home.hass.states[this.hassEntity.entity_id],
      );
    }

    return this.cahce.state as LightState;
  }
}
