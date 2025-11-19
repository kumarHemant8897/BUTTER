// Simple runner for Spotify songs
console.log("Starting Spotify song fetch...");

import('./src/seeds/fetch-songs-spotify.js').catch(console.error);
