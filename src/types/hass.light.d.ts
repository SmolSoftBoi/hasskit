import {
  HassEntityAttributeBase,
  HassEntityBase,
} from 'home-assistant-js-websocket';

export const enum HassLightColorMode {
  UNKNOWN = 'unknown',
  ONOFF = 'onoff',
  BRIGHTNESS = 'brightness',
  COLOR_TEMP = 'color_temp',
  HS = 'hs',
  XY = 'xy',
  RGB = 'rgb',
  RGBW = 'rgbw',
  RGBWW = 'rgbww',
  WHITE = 'white',
}

export interface HassLightEntity extends HassEntityBase {
  attributes: HassLightEntityAttributes;
}

interface HassLightEntityAttributes extends HassEntityAttributeBase {
  min_color_temp_kelvin?: number;
  max_color_temp_kelvin?: number;
  min_mireds?: number;
  max_mireds?: number;
  brightness?: number;
  xy_color?: [number, number];
  hs_color?: [number, number];
  color_temp?: number;
  color_temp_kelvin?: number;
  rgb_color?: [number, number, number];
  rgbw_color?: [number, number, number, number];
  rgbww_color?: [number, number, number, number, number];
  effect?: string;
  effect_list?: string[] | null;
  supported_color_modes?: HassLightColorMode[];
  color_mode?: HassLightColorMode;
}
