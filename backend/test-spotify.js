import dotenv from "dotenv";
dotenv.config();

console.log("Testing Spotify API setup...");
console.log("Client ID:", process.env.SPOTIFY_CLIENT_ID ? "✓ Found" : "✗ Missing");
console.log("Client Secret:", process.env.SPOTIFY_CLIENT_SECRET ? "✓ Found" : "✗ Missing");

if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
	const getSpotifyToken = async () => {
		try {
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: 'grant_type=client_credentials'
			});
			
			const data = await response.json();
			console.log("Token response:", data);
			return data.access_token;
		} catch (error) {
			console.error("Error getting token:", error);
		}
	};
	
	getSpotifyToken();
} else {
	console.log("Please add your Spotify credentials to .env file");
}
