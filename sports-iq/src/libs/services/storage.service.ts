export class StorageService {
  private _storage: Storage;

  constructor(local: boolean = false) {
    if (local) {
      this._storage = localStorage;
      return;
    }

    this._storage = sessionStorage;
  }

  public setStorage(storage: Storage): void {
    this._storage = storage;
  }

  public get<T>(key: string): T | undefined {
    if (!this.hasKey(key)) {
      return undefined;
    }

    const value: string | null = this._storage.getItem(key) || null;
    try {
      const objValue: T = JSON.parse(value as string);
      return objValue;
    } catch {
      return undefined;
    }
  }

  public set<T>(key: string, item: T): void {
    this._storage.setItem(key, JSON.stringify(item));
  }

  public hasKey(key: string): boolean {
    const value: unknown = this._storage.getItem(key);
    return value !== undefined && value !== null;
  }

  public remove(key: string, exact: boolean = true): void {
    if (exact) {
      this._storage.removeItem(key);
      return;
    }

    const keys: string[] = [];
    for (let i = 0; i < this._storage.length; i++) {
      keys.push(this._storage.key(i) as string);
    }

    keys.forEach((k) => {
      if (k.includes(key)) this.remove(k);
    });
  }

  public clear(): void {
    this._storage.clear();
  }
}
