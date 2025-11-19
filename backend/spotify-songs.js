import mongoose from "mongoose";
import { Song } from "./src/models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ Connected to MongoDB");

        // Get Spotify access token
        console.log("Getting Spotify token...");
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });
        
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;
        console.log("✓ Got Spotify token");

        // Search for tracks
        console.log("Searching for 'noor e khuda'...");
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=noor%20e%20khuda&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const searchData = await searchResponse.json();
        console.log(`Found ${searchData.tracks.items.length} tracks`);

        // Clear existing songs
        await Song.deleteMany({});
        console.log("Cleared existing songs");

        // Convert and save songs
        const songs = searchData.tracks.items
            .filter(track => track.preview_url)
            .map(track => ({
                title: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                imageUrl: track.album.images[0]?.url || '/cover-images/default.jpg',
                audioUrl: track.preview_url,
                duration: Math.floor(track.duration_ms / 1000)
            }));

        if (songs.length > 0) {
            await Song.insertMany(songs);
            console.log(`✓ Added ${songs.length} songs to database!`);

            songs.forEach((song, index) => {
                console.log(`${index + 1}. ${song.title} - ${song.artist}`);
            });
        } else {
            console.log("No songs found with preview URLs");
        }

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

main();
