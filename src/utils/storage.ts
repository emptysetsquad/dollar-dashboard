/**
 * Get value by key
 * @param {string} key
 * @param {string} defaultValue
 */
export function getPreference(key:string, defaultValue:string): string {
  return localStorage.getItem(key) || defaultValue;
}

/**
 * store value to storage
 * @param {string} key
 * @param {string} value
 */
export function storePreference(key:string, value:string):void {
  localStorage.setItem(key, value);
}
