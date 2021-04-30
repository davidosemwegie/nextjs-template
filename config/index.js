const fs = require('fs');
const path = require('path');

const resolveFile = (appDirectory, configPath, fileName) => {
  if (fs.existsSync(path.resolve(appDirectory, configPath, `${fileName}.ts`)))
  {
    console.log('resolved config file', fileName, path.resolve(appDirectory, configPath, `${fileName}.ts`));

    return path.resolve(appDirectory, configPath, `${fileName}.ts`);
  } else if (fs.existsSync(path.resolve(appDirectory, configPath, `${fileName}.js`)))
  {
    console.log('resolved config file', fileName, path.resolve(appDirectory, configPath, `${fileName}.js`));

    return path.resolve(appDirectory, configPath, `${fileName}.js`);
  } else
  {
    console.log('unable to resolve config file', fileName);

    return undefined;
  }
};

const loadFile = (filePath) => {
  if (filePath)
  {
    try
    {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require(filePath);

      return config.default ? config.default : config;
    } catch (error)
    {
      console.error(`ERROR: Unable to load config file: ${filePath}`);
      console.error(error);
    }
  }
};

const loadConfig = (configPath = '') => {
  const appDirectory = fs.realpathSync(process.cwd());
  const environment = process.env.APP_ENV
    ? process.env.APP_ENV
    : process.env.NODE_ENV
      ? process.env.NODE_ENV
      : 'development';


  console.log('loading config from', path.resolve(appDirectory, configPath));

  const defaultConfig = loadFile(resolveFile(appDirectory, configPath, 'config.default'));
  const environmentConfig = loadFile(resolveFile(appDirectory, configPath, `config.${environment}`));
  const localEnvironmentConfig = loadFile(resolveFile(appDirectory, configPath, `config.${environment}.local`));
  const localConfig = loadFile(resolveFile(appDirectory, configPath, 'config.local'));
  const fileConfig = Object.assign({}, defaultConfig, environmentConfig, localEnvironmentConfig, localConfig);

  return fileConfig;
};

module.exports = {
  // paths are relative to the project root
  publicRuntimeConfig: loadConfig('config/public'),
  serverRuntimeConfig: loadConfig('config/server'),
};
