import {
  HassEntityAttributeBase,
  HassEntityBase,
} from 'home-assistant-js-websocket';

export interface HassAutomationEntity extends HassEntityBase {
  attributes: HassEntityAttributeBase & {
    id?: string;
    last_triggered: string;
  };
}
