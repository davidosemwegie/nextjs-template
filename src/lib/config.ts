import getConfig from 'next/config';

export interface PublicConfig {
  // Set in env at buildtime
  APP_ENV: string;
  RELEASE: string;
  //Set in next config at runtime
  APP_NAME: string;
}

const { publicRuntimeConfig } = getConfig();

export const publicConfig: PublicConfig = publicRuntimeConfig;
