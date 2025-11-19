import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

const addSong = async (title, artist, imageUrl, audioUrl, duration) => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		const newSong = new Song({
			title,
			artist,
			imageUrl,
			audioUrl,
			duration,
		});

		await newSong.save();
		console.log(`Song "${title}" added successfully!`);
	} catch (error) {
		console.error("Error adding song:", error);
	} finally {
		mongoose.connection.close();
	}
};

// Example usage - modify these values
addSong(
	"Your Custom Song",
	"Your Artist Name", 
	"/cover-images/custom-song.jpg",
	"/songs/custom-song.mp3",
	210 // 3:30 in seconds
);
