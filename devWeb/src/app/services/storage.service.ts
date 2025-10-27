import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = sessionStorage;
  setItem(key:string,value:any){ this.storage.setItem(key, JSON.stringify(value)); }
  getItem<T>(key:string): T|null { const v = this.storage.getItem(key); return v? JSON.parse(v) : null; }
  removeItem(key:string){ this.storage.removeItem(key); }
  clear(){ this.storage.clear(); }
}