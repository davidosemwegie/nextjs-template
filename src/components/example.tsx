import React, { ReactElement } from 'react';

import { publicConfig } from '../lib/config';

const Example = (): ReactElement => {
  return (
    <div>
      <h1>This is an example component</h1>
      <h2>APP_NAME: {publicConfig.APP_NAME}</h2>
      <h2>APP_ENV: {publicConfig.APP_ENV}</h2>
      <h2>NODE_ENV: {process.env.NODE_ENV}</h2>
    </div>
  );
};

export { Example };
