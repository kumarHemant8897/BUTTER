import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Play } from "lucide-react";

const AllSongsPage = () => {
	const { songs, fetchSongs, isLoading } = useMusicStore();
	const { playAlbum } = usePlayerStore();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	useEffect(() => {
		fetchSongs();
	}, [fetchSongs]);

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
		);
	};

	const handlePlaySelected = () => {
		const selectedSongs: Song[] = songs.filter((song) =>
			selectedIds.includes(song._id as string)
		);
		if (selectedSongs.length === 0) return;
		playAlbum(selectedSongs, 0);
	};

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6 space-y-4'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl sm:text-3xl font-bold'>All Songs</h1>
						<Button
							disabled={selectedIds.length === 0}
							onClick={handlePlaySelected}
							className='bg-[#FEE400] text-black hover:bg-[#FEE400]/90 hover:scale-105 transition-all disabled:bg-zinc-700 disabled:text-zinc-400 disabled:hover:scale-100'
						>
							Play selected ({selectedIds.length})
						</Button>
					</div>

					{isLoading ? (
						<p className='text-zinc-300'>Loading songs...</p>
					) : (
						<div className='space-y-2'>
							{songs.map((song) => {
								const checked = selectedIds.includes(song._id as string);
								return (
									<div
										key={song._id}
										className='flex items-center gap-3 bg-zinc-800/40 p-3 rounded-md hover:bg-zinc-700/40 cursor-pointer'
										onClick={() => toggleSelect(song._id as string)}
									>
										<input
											type='checkbox'
											checked={checked}
											readOnly
											className='w-4 h-4 accent-yellow-400'
										/>
										<img
											src={song.imageUrl}
											alt={song.title}
											className='w-12 h-12 rounded-md object-cover'
										/>
										<div className='flex-1 min-w-0'>
											<p className='font-medium truncate'>{song.title}</p>
											<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
										</div>
										<Button
											size='icon'
											className='ml-auto w-10 h-10 rounded-md bg-[#FEE400] hover:bg-[#FEE400]/90 hover:scale-105 text-black transition-all'
											onClick={(e) => {
												e.stopPropagation();
												const index = songs.findIndex((s) => s._id === song._id);
												if (index !== -1) {
													playAlbum(songs, index);
												}
											}}
										>
											<Play className='w-5 h-5 text-black' />
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default AllSongsPage;
