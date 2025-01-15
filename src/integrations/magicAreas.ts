export const MAGIC_AREAS_PLATFORM = 'magic_areas';

export const MAGIC_AREAS_GLOBAL_DEVICE_ID = 'magic_area_device_global';

export const MAGIC_AREAS_FLOOR_DEVICE_ID =
  'magic_area_device_${floor.uniqueIdentifier}';

export const MAGIC_AREAS_AREA_DEVICE_ID =
  'magic_area_device_${area.uniqueIdentifier}';

export const MAGIC_AREA_AREA_LIGHT_GROUP_ALL_ENTITY_ID =
  'light.magic_areas_light_groups_${area.uniqueIdentifier}_all_lights';

export const MAGIC_AREAS_AREA_LIGHT_GROUP_ENTITY_IDS = {
  overhead:
    'light.magic_areas_light_groups_${area.uniqueIdentifier}_overhead_lights',
  sleep: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_sleep_lights',
  accent:
    'light.magic_areas_light_groups_${area.uniqueIdentifier}_accent_lights',
  task: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_task_lights',
};
