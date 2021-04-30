/* eslint-disable import/no-extraneous-dependencies */
const TerserPlugin = require('terser-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { publicRuntimeConfig, serverRuntimeConfig } = require('./config');

module.exports = () => {
  const APP_ENV = process.env.APP_ENV || 'development';
  const RELEASE = process.env.COMMIT_HASH || 'development';

  return withBundleAnalyzer({
    assetPrefix: APP_ENV === 'development' ? '' : publicRuntimeConfig.HOSTNAME,
    i18n: {
      // this makes `referrals.neofinancial.com/en-ca/login` and `/fr-ca/login` both point to login.js,
      locales: ['en-CA', 'fr-CA'],
      // this makes `referrals.neofinancial.com/login` an alias for /en-ca/login and is required
      defaultLocale: 'en-CA',
    },
    poweredByHeader: false,
    publicRuntimeConfig: {
      ...publicRuntimeConfig,
      APP_ENV: APP_ENV,
      RELEASE: RELEASE,
    },
    serverRuntimeConfig: {
      ...serverRuntimeConfig,
    },
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      });

      // adapted from https://github.com/twopluszero/next-images
      config.module.rules.push({
        test: /\.(jpg|jpeg|png|svg|gif|ico|webp|jp2|avif)$/,
        // Next.js already handles url() in css/sass/scss files
        issuer: /\.\w+(?<!(s?c|sa)ss)$/i,
        exclude: config.exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: config.inlineImageLimit,
              fallback: require.resolve('file-loader'),
              publicPath: `${config.assetPrefix || config.basePath}/_next/static/images/`,
              outputPath: `${isServer ? '../' : ''}static/images/`,
              name: '[name]-[hash].[ext]',
              esModule: true,
            },
          },
        ],
      });

      config.mode = APP_ENV === 'production' ? 'production' : 'development';

      config.optimization = {
        ...config.optimization,
        usedExports: true,
        providedExports: true,
        minimize: APP_ENV === 'production',
        minimizer: APP_ENV === 'production' && !isServer ? [new TerserPlugin()] : [],
      };

      return config;
    },
    productionBrowserSourceMaps: true,
  });
};
