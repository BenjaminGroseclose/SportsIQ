import { Injectable } from '@angular/core';

export interface AppSettings {
  env: 'dev' | 'prod';
  apiKey: string;
  baseUrl: string;
  issuer: string;
  clientId: string;
  responseType: string;
  scope: string;
  showDebugInformation: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  settings: AppSettings | null = null;

  constructor() { }

  getSettings(): AppSettings {
    if (this.settings == null) {
      throw new Error('Settings have not been loaded.');
    }

    return this.settings;
  }

  loadSettings(): Promise<any> {
    return fetch('/app-settings.json')
      .then((response) => response.json())
      .then((settings: AppSettings) => (this.settings = settings));
  }
}
