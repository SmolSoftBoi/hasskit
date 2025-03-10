import { HassConfig } from 'home-assistant-js-websocket';

export interface Hass {
  auth: Auth & { external?: ExternalMessaging };
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  entities: { [id: string]: HassEntityRegistryDisplayEntry };
  devices: { [id: string]: HassDeviceRegistryEntry };
  areas: { [id: string]: HassAreaRegistryEntry };
  floors: { [id: string]: HassFloorRegistryEntry };
  services: HassServices;
  config: HassConfig;
  themes: Themes;
  selectedTheme: ThemeSettings | null;
  panels: Panels;
  panelUrl: string;
  // i18n
  // current effective language in that order:
  //   - backend saved user selected language
  //   - language in local app storage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compatibility
  selectedLanguage: string | null;
  locale: FrontendLocaleData;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: TranslationMetadata;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: 'docked' | 'always_hidden' | 'auto';
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: HassCurrentUser;
  userData?: CoreFrontendUserData | null;
  hassUrl(path?): string;
  callService(
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target'],
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<ServiceCallResponse>;
  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T>;
  callApiRaw( // introduced in 2024.11
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<Response>;
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
  sendWS(msg: MessageBase): void;
  callWS<T>(msg: MessageBase): Promise<T>;
  loadBackendTranslation(
    category: Parameters<typeof getHassTranslations>[2],
    integrations?: Parameters<typeof getHassTranslations>[3],
    configFlow?: Parameters<typeof getHassTranslations>[4],
  ): Promise<LocalizeFunc>;
  loadFragmentTranslation(fragment: string): Promise<LocalizeFunc | undefined>;
  formatEntityState(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue(
    stateObj: HassEntity,
    attribute: string,
    value?: any,
  ): string;
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

export interface HassFloorRegistryEntry extends RegistryEntry {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  aliases: string[];
}

export interface HassAreaRegistryEntry extends RegistryEntry {
  area_id: string;
  floor_id: string | null;
  name: string;
  picture: string | null;
  icon: string | null;
  labels: string[];
  aliases: string[];
}

export interface HassDeviceRegistryEntry extends RegistryEntry {
  id: string;
  config_entries: string[];
  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: 'service' | null;
  disabled_by: 'user' | 'integration' | 'config_entry' | null;
  configuration_url: string | null;
  primary_config_entry: string | null;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: EntityCategory;
  translation_key?: string;
  platform?: string;
  display_precision?: number;
}

export interface HassCurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}
