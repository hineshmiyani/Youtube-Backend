import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  channelIdSchema,
  subscriberIdSchema,
  toggleSubscriptionSchema,
} from "../utils/validations/subscription.validation.js";
import { ApiError } from "../utils/ApiError.js";

const idTypeMappings = {
  "/c/": { key: "channelId", schema: channelIdSchema },
  "/u/": { key: "subscriberId", schema: subscriberIdSchema },
};

/**
 * Retrieves the schema and ID based on the provided path, channelId, and subscriberId.
 * It iterates through the `idTypeMappings` object to find a matching path key.
 * Once a match is found, it constructs and returns an object containing the key, id, and schema.
 *
 * @param {string} path - The path to be checked against the keys in `idTypeMappings`.
 * @param {string} channelId - The channel ID to be used if the key matches 'channelId'.
 * @param {string} subscriberId - The subscriber ID to be used if the key matches 'subscriberId'.
 * @returns {{key: string, id: string, schema: object}} An object containing the matched key, the corresponding ID (either channelId or subscriberId), and the schema.
 */
const getSchemaAndId = (path, channelId, subscriberId) => {
  for (const [pathKey, { key, schema }] of Object.entries(idTypeMappings)) {
    if (path.includes(pathKey)) {
      return {
        key,
        id: { channelId, subscriberId }[key],
        schema,
      };
    }
  }
};

const validateParamsId = asyncHandler((req, res, next) => {
  const { channelId, subscriberId } = req.params;

  const schemaAndId = getSchemaAndId(req.path, channelId, subscriberId);

  const payload = channelIdSchema.safeParse(schemaAndId?.id);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(400, errorMessage);
  }

  req.params = { ...req.params, [schemaAndId?.key]: payload?.data };
  next();
});

const validateToggleSubscription = asyncHandler((req, res, next) => {
  const { channelId } = req.params;

  const data = {
    subscriber: req.user?.id,
    channel: channelId,
  };

  const payload = toggleSubscriptionSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export { validateToggleSubscription, validateParamsId };
