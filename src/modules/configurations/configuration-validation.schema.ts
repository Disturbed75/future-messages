import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  APP_SERVER_UNIQUE_NAME: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
});
