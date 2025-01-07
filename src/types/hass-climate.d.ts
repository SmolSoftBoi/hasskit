import {
  HassEntityAttributeBase,
  HassEntityBase,
} from 'home-assistant-js-websocket';

export type HassClimateEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    hvac_mode: HassHvacMode;
    hvac_modes: HassHvacMode[];
    hvac_action?: HassHvacAction;
    current_temperature: number;
    min_temp: number;
    max_temp: number;
    temperature: number;
    target_temp_step?: number;
    target_temp_high?: number;
    target_temp_low?: number;
    humidity?: number;
    current_humidity?: number;
    target_humidity_low?: number;
    target_humidity_high?: number;
    min_humidity?: number;
    max_humidity?: number;
    fan_mode?: string;
    fan_modes?: string[];
    preset_mode?: string;
    preset_modes?: string[];
    swing_mode?: string;
    swing_modes?: string[];
    swing_horizontal_mode?: string;
    swing_horizontal_modes?: string[];
    aux_heat?: 'on' | 'off';
  };
};
