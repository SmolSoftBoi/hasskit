import { describe, expect, test, vi } from 'vitest';
import Home from '../src/home';
import { Hass } from '../src/types/hass';

// Mock hass
vi.mock('hass', {});

describe('Home', () => {
  const hass: Hass = {
    auth: undefined,
    connection: undefined,
    connected: false,
    states: undefined,
    entities: {},
    devices: {},
    areas: {},
    floors: {},
    services: undefined,
    config: undefined,
    themes: undefined,
    selectedTheme: undefined,
    panels: undefined,
    panelUrl: '',
    language: '',
    selectedLanguage: null,
    locale: undefined,
    resources: undefined,
    localize: undefined,
    translationMetadata: undefined,
    suspendWhenHidden: false,
    enableShortcuts: false,
    vibrate: false,
    debugConnection: false,
    dockedSidebar: 'docked',
    defaultPanel: '',
    moreInfoEntityId: null,
    hassUrl: vi.fn(),
    callService: vi.fn(),
    callApi: vi.fn(),
    callApiRaw: vi.fn(),
    fetchWithAuth: vi.fn(),
    sendWS: vi.fn(),
    callWS: vi.fn(),
    loadBackendTranslation: vi.fn(),
    loadFragmentTranslation: vi.fn(),
    formatEntityState: vi.fn(),
    formatEntityAttributeValue: vi.fn(),
    formatEntityAttributeName: vi.fn(),
  };

  const myHome = new Home(hass);

  test('Expect home to be defined', () => {
    expect(myHome).toBeDefined();
  });

  test('Expect hass to be defined and equal to hass', () => {
    expect(myHome.hass).toBeDefined();
    expect(myHome.hass).toEqual(hass);
  });

  test('Expect config to be defined', () => {
    expect(myHome.config).toBeDefined();
  });

  describe('Home', () => {
    test('Expect accessories to be defined and an array', () => {
      expect(myHome.accessories).toBeDefined();
      expect(myHome.accessories).toBeInstanceOf(Array);
    });

    test('Expect servicesWithTypes to be defined and a function', () => {
      expect(myHome.servicesWithTypes).toBeDefined();
      expect(myHome.servicesWithTypes).toBeInstanceOf(Function);
    });
  });

  describe('Hass', () => {
    test('Expect devices to be defined and an array', () => {
      expect(myHome.devices).toBeDefined();
      expect(myHome.devices).toBeInstanceOf(Array);
    });

    test('Expect entitiesWithDomains to be defined and a function', () => {
      expect(myHome.entitiesWithDomains).toBeDefined();
      expect(myHome.entitiesWithDomains).toBeInstanceOf(Function);
    });

    test('Expect entities to be defined and an array', () => {
      expect(myHome.entities).toBeDefined();
      expect(myHome.entities).toBeInstanceOf(Array);
    });

    test('Expect energy entity to be undefined', () => {
      expect(myHome.energyEntity).toBeUndefined();
    });
  });
});
