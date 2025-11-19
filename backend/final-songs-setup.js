import mongoose from "mongoose";
import { Song } from "./src/models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

async function setupSongs() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ Connected to MongoDB");

        // IMPORTANT: Do NOT clear existing songs anymore.
        // This script now only ADDS extra songs on top of what you already have
        // (for example, songs seeded from src/seeds/songs.js).

        // 1. Add your manual "Noor E khuda" song
        const manualSongs = [
            {
                title: "Noor E khuda",
                artist: "Shahrukh Khan, Kajol",
                imageUrl: "/cover-images/19.jpg",
                audioUrl: "/songs/19.mp3",
                duration: 380
            }
        ];

        await Song.insertMany(manualSongs);
        console.log(`✓ Added ${manualSongs.length} manual songs`);

        // 2. Try to fetch from iTunes API (better preview availability)
        // If the network call fails, we just log and continue without throwing.
        try {
            console.log("\nFetching from iTunes API...");
            const searches = ["noor e khuda", "shahrukh khan", "bollywood", "hindi songs"];
            let itunesSongs = [];

            for (const query of searches) {
                console.log(`Searching iTunes for: ${query}`);
                const response = await fetch(
                    `https://itunes.apple.com/search?term=${encodeURIComponent(
                        query
                    )}&entity=song&limit=10`
                );
                const data = await response.json();

                const songs = data.results
                    .filter((track) => track.previewUrl)
                    .map((track) => ({
                        title: track.trackName,
                        artist: track.artistName,
                        imageUrl: track.artworkUrl100.replace("100x100", "600x600"),
                        audioUrl: track.previewUrl,
                        duration: Math.floor(track.trackTimeMillis / 1000),
                    }));

                itunesSongs = [...itunesSongs, ...songs];
                console.log(`Found ${songs.length} songs with previews`);
            }

            // Remove duplicates
            const uniqueItunesSongs = itunesSongs.filter((song, index, self) =>
                index === self.findIndex((s) => s.title === song.title && s.artist === song.artist)
            );

            if (uniqueItunesSongs.length > 0) {
                await Song.insertMany(uniqueItunesSongs);
                console.log(`✓ Added ${uniqueItunesSongs.length} iTunes songs`);
            } else {
                console.log("No extra iTunes songs to add (0 with previews).");
            }
        } catch (itunesError) {
            console.log("iTunes fetch failed, keeping existing songs:", itunesError.message);
        }

        // 3. Add some popular songs from Spotify (without previews for demo)
        console.log("\nAdding popular songs from Spotify (metadata only)...");
        // Use existing cover-images (1-18.jpg) so images always load.
        const popularSongs = [
            {
                title: "Cruel Summer",
                artist: "Taylor Swift",
                imageUrl: "/cover-images/10.jpg",
                audioUrl: "/songs/taylor-cruel-summer.mp3",
                duration: 178,
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                imageUrl: "/cover-images/11.jpg",
                audioUrl: "/songs/ed-shape.mp3",
                duration: 233,
            },
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                imageUrl: "/cover-images/12.jpg",
                audioUrl: "/songs/weeknd-blinding.mp3",
                duration: 200,
            },
        ];

        await Song.insertMany(popularSongs);
        console.log(`✓ Added ${popularSongs.length} popular songs (metadata only)`);

        // Show final result
        const totalSongs = await Song.countDocuments();
        console.log(`\n🎵 Total songs in database: ${totalSongs}`);

        // Display first 10 songs
        const allSongs = await Song.find().limit(10);
        console.log("\n=== Sample Songs ===");
        allSongs.forEach((song, index) => {
            console.log(`${index + 1}. ${song.title} - ${song.artist} (${song.duration}s)`);
        });

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
    }
}

setupSongs();
