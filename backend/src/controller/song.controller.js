import { Song } from "../models/song.model.js";

// Get all songs (used mainly in admin area)
export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Featured: a small curated-looking slice from the newest songs
export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 }).limit(6);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Made For You: pick a different slice, slightly older songs
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 }).skip(6).limit(8);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Trending: random selection so the section looks varied
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([{ $sample: { size: 8 } }]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Search within local DB by title or artist
export const searchSongs = async (req, res, next) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ message: "Search query is required" });
		}

		const regex = new RegExp(q, "i");
		const songs = await Song.find({
			$or: [{ title: regex }, { artist: regex }],
		}).limit(40);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};
