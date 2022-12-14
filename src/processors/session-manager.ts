import Profile from '../entities/user/Profile';
import Authentication from '../entities/Authentication';
import { APP_SECRET } from '../constant';
import MenuItem from '../entities/MenuItem';

var CryptoJS = require('crypto-js');
const token_add = '--pxx--';
const profile_add = '--pxx-xdx--';
const navigation_add = '--pxx-xnx--';
const theme = '--dark-theme--';

function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, APP_SECRET).toString();
}
function decrypt(data: string): string {
  return CryptoJS.AES.decrypt(data, APP_SECRET).toString(CryptoJS.enc.Utf8);
}
export function getTheme(): boolean | undefined {
  try {
    return localStorage.getItem(theme) === 'true';
  } catch {
    return undefined;
  }
}

export function setTheme(isDarkMode: boolean) {
  localStorage.setItem(theme, isDarkMode.toString());
}
export function saveToken(auth: Authentication) {
  if (auth.token !== undefined && auth.refreshToken !== undefined) {
    sessionStorage.setItem(token_add, encrypt(JSON.stringify(auth)));
  }
}

export function clearToken() {
  sessionStorage.removeItem(token_add);
}

export function getToken(): Authentication | undefined {
  try {
    return JSON.parse(decrypt(sessionStorage.getItem(token_add) ?? ''));
  } catch {
    return undefined;
  }
}

export function getProfile(): Profile | undefined {
  try {
    return JSON.parse(decrypt(sessionStorage.getItem(profile_add) ?? ''));
  } catch {
    return undefined;
  }
}
export function saveProfile(profile: Profile) {
  if (profile !== undefined) {
    sessionStorage.setItem(profile_add, encrypt(JSON.stringify(profile)));
  }
}

export function clearProfile() {
  sessionStorage.removeItem(profile_add);
}

export function getSessionMenus(): MenuItem[] | undefined {
  try {
    return JSON.parse(decrypt(localStorage.getItem(navigation_add) ?? ''));
  } catch {
    return undefined;
  }
}
export function saveSessionMenus(menus: MenuItem[]) {
  if (menus !== undefined) {
    localStorage.setItem(navigation_add, encrypt(JSON.stringify(menus)));
  }
}

export function clearSessionMenus() {
  localStorage.removeItem(navigation_add);
}
export function clearSession() {
  sessionStorage.clear();
}
