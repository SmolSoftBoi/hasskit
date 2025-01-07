import Entity from '../entity';
import { ClimateState } from '../states';

export default class ClimateEntity extends Entity {
  get state(): ClimateState {
    if (!this.cahce.state) {
      this.cahce.state = new ClimateState(
        this.home,
        this.home.hass.states[this.hassEntity.entity_id],
      );
    }

    return this.cahce.state as ClimateState;
  }
}
