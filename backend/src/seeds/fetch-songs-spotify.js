import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

// Get Spotify access token
const getSpotifyToken = async () => {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'grant_type=client_credentials'
	});
	
	const data = await response.json();
	return data.access_token;
};

const fetchSongsFromSpotify = async (searchQuery = "noor e khuda") => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Get Spotify access token
		const token = await getSpotifyToken();
		console.log("Successfully got Spotify token");

		// Search for tracks
		const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=20`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		const searchData = await searchResponse.json();
		console.log(`Found ${searchData.tracks.items.length} tracks from Spotify`);

		// Clear existing songs (optional - remove this line if you want to keep existing songs)
		await Song.deleteMany({});

		// Convert and save songs
		const songs = searchData.tracks.items
			.filter(track => track.preview_url) // Only include tracks with preview
			.map(track => ({
				title: track.name,
				artist: track.artists.map(artist => artist.name).join(', '),
				imageUrl: track.album.images[0]?.url || '/cover-images/default.jpg',
				audioUrl: track.preview_url,
				duration: Math.floor(track.duration_ms / 1000) // Convert to seconds
			}));

		if (songs.length === 0) {
			console.log("No songs found with preview URLs");
			return;
		}

		await Song.insertMany(songs);
		console.log(`Successfully added ${songs.length} songs to database!`);

		// Display added songs
		songs.forEach((song, index) => {
			console.log(`${index + 1}. ${song.title} - ${song.artist} (${song.duration}s)`);
		});

	} catch (error) {
		console.error("Error fetching songs from Spotify:", error);
		if (error.message.includes('invalid')) {
			console.log("Please check your Spotify Client ID and Client Secret in .env file");
		}
	} finally {
		mongoose.connection.close();
	}
};

// Multiple search options
const searchOptions = [
	"noor e khuda",
	"shahrukh khan", 
	"kajol",
	"bollywood romantic",
	"my name is khan"
];

// Run with different searches
const fetchMultipleSearches = async () => {
	for (const query of searchOptions) {
		console.log(`\n=== Searching for: ${query} ===`);
		await fetchSongsFromSpotify(query);
		await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
	}
};

// Choose what to run:
fetchSongsFromSpotify("noor e khuda"); // Single search
// fetchMultipleSearches(); // Multiple searches
