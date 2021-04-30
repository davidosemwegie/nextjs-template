function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isServer(): boolean {
  return typeof window === 'undefined';
}

export { isBrowser, isServer };
