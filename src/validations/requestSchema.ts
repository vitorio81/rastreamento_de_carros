import * as Joi from "joi";

export const RequestSchema = Joi.object({
  accessToken: Joi.string().required(),
});
