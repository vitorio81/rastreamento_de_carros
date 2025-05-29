import * as Joi from "joi";

export const RequestSchema = Joi.object({
  appid: Joi.string().required(),
  time: Joi.string().required(),
  signature: Joi.string().required(),
});
