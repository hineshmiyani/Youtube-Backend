import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  // ✅ TODO: create playlist

  const playlist = await Playlist.create(req.body);

  if (!playlist) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Playlist creation failed due to a server issue. Please try again later."
        )
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  // ✅ TODO: get user playlists
  const { userId } = req.params;

  const playlists = await Playlist.find({
    owner: userId,
  });

  if (!playlists) {
    return res.status(404).json(new ApiError(404, "Playlists not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully!"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  // ✅ TODO: get playlist by id
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully!"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // ✅ TODO: add video to playlist
  const { playlistId, videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found!"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: video?._id,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist!"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // ✅ TODO: remove video from playlist
  const { playlistId, videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found!"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: video?._id,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist!"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // ✅ TODO: delete playlist
  const { playlistId } = req.params;

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    return res.status(404).json(new ApiError(404, "Playlist not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully!"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  // ✅ TODO: update playlist
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    return res.status(404).json(new ApiError(404, "Playlist not found!"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully!")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
