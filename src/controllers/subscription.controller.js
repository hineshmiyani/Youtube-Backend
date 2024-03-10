import mongoose from "mongoose";

import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // ✅ TODO: toggle subscription

  const existingSubscription = await Subscription.findOne(req.body);

  if (existingSubscription) {
    const unsubscribed = await Subscription.findByIdAndDelete(
      existingSubscription?._id
    );

    if (!unsubscribed) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Oops! We encountered an issue while trying to unsubscribe you from the channel."
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          unsubscribed,
          "You've successfully unsubscribed from the channel"
        )
      );
  }

  const subscribed = await Subscription.create(req.body);

  if (!subscribed) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Oops! Something went wrong while attempting to subscribe to the channel."
        )
      );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribed,
        "You've successfully subscribed to the channel."
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $addFields: {
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$subscriber" },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully!"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$channel" },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully!"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
