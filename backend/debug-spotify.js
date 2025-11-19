import dotenv from "dotenv";
dotenv.config();

async function debugSpotify() {
    try {
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
        console.log("Searching for 'taylor swift'...");
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=taylor%20swift&type=track&limit=3`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const searchData = await searchResponse.json();
        console.log("Full response:", JSON.stringify(searchData, null, 2));

        if (searchData.tracks && searchData.tracks.items) {
            console.log(`\nFound ${searchData.tracks.items.length} tracks`);
            
            searchData.tracks.items.forEach((track, index) => {
                console.log(`\nTrack ${index + 1}:`);
                console.log(`  Name: ${track.name}`);
                console.log(`  Artist: ${track.artists[0]?.name}`);
                console.log(`  Preview URL: ${track.preview_url || 'NO PREVIEW'}`);
                console.log(`  Duration: ${track.duration_ms}ms`);
                console.log(`  Album: ${track.album?.name}`);
                console.log(`  Images: ${track.album?.images?.length || 0}`);
            });
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

debugSpotify();
