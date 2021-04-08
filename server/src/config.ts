import yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('Config');

export class Config {
  debugLogging = 'debug';
  'server.port' = '8081';
  'jhipster.clientApp.name' = 'gen';
  'jhipster.registry.password' = 'admin';
  'jhipster.security.session.secret' = '';
  'jhipster.security.oauth2.client.provider.oidc.issuer-uri' = '';
  'jhipster.security.oauth2.client.registration.oidc.client-id' = '';
  'jhipster.security.oauth2.client.registration.oidc.client-secret' = '';
  'jhipster.mail.base-url' = 'http://127.0.0.1:${server.port}';
  'jhipster.mail.from' = 'gen@localhost';
  'jhipster.swagger.default-include-pattern' = '/api/.*';
  'jhipster.swagger.title' = 'gen API';
  'jhipster.swagger.description' = 'gen API documentation';
  'jhipster.swagger.version' = '0.0.1';
  'jhipster.swagger.path' = '/api/v2/api-docs';
  'eureka.client.enabled' = true;
  'eureka.client.healthcheck.enabled' = true;
  'eureka.client.fetch-registry' = true;
  'eureka.client.register-with-eureka' = true;
  'eureka.client.instance-info-replication-interval-seconds' = 10;
  'eureka.client.registry-fetch-interval-seconds' = 10;
  'eureka.instance.appname' = 'gen';
  'eureka.instance.instanceId' = 'gen:${random.value}';
  'eureka.instance.lease-renewal-interval-in-seconds' = 5;
  'eureka.instance.lease-expiration-duration-in-seconds' = 10;
  'eureka.instance.status-page-url-path' = '${management.endpoints.web.base-path}/info';
  'eureka.instance.health-check-url-path' = '${management.endpoints.web.base-path}/health';
  'eureka.instance.metadata-map.zone' = 'primary';
  // 'eureka.instance.metadata-map.profile' = '${profiles.active}';
  'eureka.instance.metadata-map.git-version' = '${git.commit.id.describe:}';
  'eureka.instance.metadata-map.git-commit' = '${git.commit.id.abbrev:}';
  'eureka.instance.metadata-map.git-branch' = '${git.branch:}';
  'eureka.instance.prefer-ip-address' = true;
  'eureka.client.service-url.defaultZone' = 'http://admin:${jhipster.registry.password}@localhost:8761/eureka/';
  'cloud.config.uri' = 'http://admin:${jhipster.registry.password}@localhost:8761/config';
  'cloud.config.name' = 'gen';
  'cloud.config.profile' = 'prod';
  'loud.config.label' = 'master';
  'crypto.key' = '3772c1cdbd27c225735d116d1e4c5421a3aec26c919cc7ab457f21a4d16a1821';
  'crypto.iv' = '54f3ad979d9262d3a2dd4489531daf34';

  constructor(properties) {
    this.addAll(properties);
  }

  public get(key: string): any {
    return this[key];
  }

  public getClientPath(): string {
    return path.join(__dirname, '../dist/static');
  }
  public addAll(properties): any {
    properties = objectToArray(properties);
    for (const property in properties) {
      if (properties.hasOwnProperty(property)) {
        this[property] = properties[property];
      }
    }
    this.postProcess();
  }

  public postProcess(): any {
    const variables = { ...this, ...process.env };
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        const value = this[property];
        const processedValue = this.processTemplate(value, variables);
        this[property] = processedValue;
      }
    }
  }

  private processTemplate(template, variables): any {
    // console.log(template);
    if (typeof template === 'string') {
      return template.replace(new RegExp('\\${[^{]+}', 'g'), name => variables[name.substring(2, name.length - 1)]);
    }
    return template;
  }
}

const yamlConfigPath = path.join(__dirname, 'config', 'application.yml');
const envYamlConfigPath = path.join(__dirname, 'config', `application-${process.env.BACKEND_ENV}.yml`);

const yamlConfig = yaml.safeLoad(fs.readFileSync(yamlConfigPath, 'utf8'));
logger.log(`Actual process.env.BACKEND_ENV value: ${process.env.BACKEND_ENV}`);
logger.log('Standard allowed values are: dev, test or prod');
logger.log('if you run with a non standard BACKEND_ENV value, remember to add your application-{process.env.BACKEND_ENV}.yml file');
if (!fs.existsSync(envYamlConfigPath)) {
  logger.error(
    'An application-{process.env.BACKEND_ENV}.yml file with your process.env.BACKEND_ENV value does not exist under config folder!'
  );
}
const envYamlConfig = yaml.safeLoad(fs.readFileSync(envYamlConfigPath, 'utf8'));

const config = new Config({ ...objectToArray(yamlConfig), ...objectToArray(envYamlConfig), ipAddress: ipAddress() });

export { config };

function objectToArray(source, currentKey?, target?): any {
  target = target || {};
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const newKey = currentKey ? currentKey + '.' + property : property;
      const newVal = source[property];

      if (typeof newVal === 'object') {
        objectToArray(newVal, newKey, target);
      } else {
        target[newKey] = newVal;
      }
    }
  }
  return target;
}

function ipAddress(): any {
  const interfaces = require('os').networkInterfaces();
  for (const dev in interfaces) {
    if (interfaces.hasOwnProperty(dev)) {
      const iface = interfaces[dev];
      for (const alias of iface) {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }

  return null;
}
