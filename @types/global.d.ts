import { api } from '../core/preload';

declare global {
  // eslint-disable-next-line
  interface Window {
    api: typeof api;
  }
}

declare module 'tar.gz';
