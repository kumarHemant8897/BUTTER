import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "@/pages/home/components/SectionGrid";
import { Loader2 } from "lucide-react";

const SearchPage = () => {
	const { searchResults, isSearching, searchSongs } = useMusicStore();
	const { initializeQueue } = usePlayerStore();

	// Get search query from URL params
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const query = urlParams.get("q");
		if (query) {
			searchSongs(query);
		}
	}, [searchSongs]);

	useEffect(() => {
		if (searchResults.length > 0) {
			initializeQueue(searchResults);
		}
	}, [initializeQueue, searchResults]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Search Results</h1>
					
					{isSearching ? (
						<div className='flex items-center justify-center py-8'>
							<Loader2 className='size-8 animate-spin text-green-500' />
							<span className='ml-2 text-gray-300'>Searching...</span>
						</div>
					) : searchResults.length > 0 ? (
						<SectionGrid 
							title={`Found ${searchResults.length} song${searchResults.length !== 1 ? 's' : ''}`} 
							songs={searchResults} 
							isLoading={isSearching} 
						/>
					) : (
						<div className='text-center py-8 text-gray-400'>
							<p>No songs found. Try a different search term.</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default SearchPage;
