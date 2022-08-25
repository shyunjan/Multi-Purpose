import { ConfigObject } from '@nestjs/config';

const APP_PHASE_PROPERTY = 'APPLICATION_PHASE';
export const APP_PHASE = process.argv[2];
process.env[APP_PHASE_PROPERTY] = APP_PHASE;
console.info(`process.env.${APP_PHASE_PROPERTY} =`, process.env[APP_PHASE_PROPERTY]);

export default (): ConfigObject => {
  const auth = require(`./${APP_PHASE}/config.auth`).default;
  // const db = require(`./${appPhase}/config.db`).default;
  const etc = require(`./${APP_PHASE}/config.etc`).default;
  // return Object.assign(auth(), db(), etc());
  return Object.assign(auth(), etc());
};
