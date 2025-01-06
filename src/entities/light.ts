import Entity from '../entity';
import { LightState } from '../states';

export default class LightEntity extends Entity {
  get state(): LightState {
    return new LightState(
      this.home,
      this.home.hass.states[this.hassEntity.entity_id],
    );
  }
}
