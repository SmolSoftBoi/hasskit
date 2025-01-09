import Entity from '../entity';
import { AutomationState } from '../states';

export default class AutomationEntity extends Entity {
  get state(): AutomationState {
    if (!this.cahce.state) {
      this.cahce.state = new AutomationState(
        this.home,
        this.home.hass.states[this.hassEntity.entity_id],
      );
    }

    return this.cahce.state as AutomationState;
  }
}
