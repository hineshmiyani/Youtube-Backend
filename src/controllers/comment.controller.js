import mongoose from "mongoose";

import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // ✅ TODO: get all comments for a video
  const { videoId } = req.params;
  const { page, limit } = req.query;

  const options = { page, limit };

  const commentAggregate = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
  ]);

  try {
    const results = await Comment.aggregatePaginate(commentAggregate, options);

    res
      .status(200)
      .json(new ApiResponse(200, results, "Comments fetched successfully!"));
  } catch (error) {
    res.status(404).json(new ApiError(404, error?.message || error));
  }
});

const addComment = asyncHandler(async (req, res) => {
  // ✅ TODO: add a comment to a video

  const comment = await Comment.create(req?.body);

  res
    .status(200)
    .json(new ApiResponse(200, comment?._doc, "Comment added successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  // ✅ TODO: update a comment

  const { commentId } = req.params;
  const { content, owner } = req.body;

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      owner: owner,
    },
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    return res.status(404).json(new ApiError(404, "Comment not found!"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated successfully!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // ✅ TODO: delete a comment

  const { commentId } = req.params;

  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user?._id,
  });

  if (!deletedComment) {
    return res.status(404).json(new ApiError(404, "Comment not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully!"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
