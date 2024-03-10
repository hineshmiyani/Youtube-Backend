import { isValidObjectId } from "mongoose";
import { z } from "zod";

const channelIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "ChannelId is required and must be a valid MongoDB ObjectId.",
});

const subscriberIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "SubscriberId is required and must be a valid MongoDB ObjectId.",
});

const toggleSubscriptionSchema = z.object({
  subscriber: subscriberIdSchema,
  channel: channelIdSchema,
});

export { toggleSubscriptionSchema, subscriberIdSchema, channelIdSchema };
