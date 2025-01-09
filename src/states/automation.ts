import Home from '../home';
import State from '../state';
import { HassAutomationEntity } from '../types/hass-automation';

export default class AutomationState extends State {
  hassState: HassAutomationEntity;

  constructor(home: Home, hassState: HassAutomationEntity) {
    super(home, hassState);
    this.hassState = hassState;
  }

  get lastTriggered(): Date {
    return new Date(this.hassState.attributes.last_triggered);
  }
}
