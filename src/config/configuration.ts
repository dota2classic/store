import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export interface ExpectedConfig {
  redis: {
    host: string;
    password: string;
  };
  postgres: {
    host: string;
    username: string;
    password: string;
  };
  telemetry: {
    jaeger: {
      url: string;
    };
  };
  fluentbit: {
    host: string;
    port: number;
  };
}

export default (config = YAML_CONFIG_FILENAME): ExpectedConfig => {
  try {
    return yaml.load(
      readFileSync(join('./', config), 'utf8'),
    ) as ExpectedConfig;
  } catch (e) {
    console.warn(`Error loading config file ${config}`);
    return {
      fluentbit: { host: '', port: 0 },
      postgres: { host: '', password: '', username: '' },
      redis: { host: '', password: '' },
      telemetry: { jaeger: { url: '' } },
    };
  }
};
