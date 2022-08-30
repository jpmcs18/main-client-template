import { Profile } from '../entities/user/Profile';
import { Authentication } from '../entities/Authentication';
import { APP_SECRET } from '../constant';

var CryptoJS = require('crypto-js');
const token_add = '--pxx--';
const profile_add = '--pxx-xdx--';
const current_voter = '--pxx-xvx--';
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

export function getCurrentVoter(): number | undefined {
  try {
    return parseInt(decrypt(sessionStorage.getItem(current_voter) ?? ''));
  } catch {
    return undefined;
  }
}

export function saveCurrentVoter(voterId: number) {
  if (voterId !== undefined) {
    sessionStorage.setItem(current_voter, encrypt(voterId.toString()));
  }
}

export function clearVoterId() {
  sessionStorage.removeItem(current_voter);
}

export function clearSession() {
  sessionStorage.clear();
}
