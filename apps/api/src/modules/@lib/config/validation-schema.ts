import { NodeEnv } from '@local/types';
import Joi from 'joi';

export const validationSchema = Joi.object({
  /* App */
  NODE_ENV: Joi.string().valid(NodeEnv.Development, NodeEnv.Production).required(),
  SERVER_PORT: Joi.number().required(),
  SERVER_URL: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  /* Database */
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_PASSWORD: Joi.string().allow('').optional(),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  /* JWT */
  JWT_SECRET: Joi.string().required(),
  /* Oauth providers */
  GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
});
