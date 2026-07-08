<script lang="ts">
import { onMount } from "svelte";

type Track = {
	title: string;
	artist?: string;
	cover?: string;
	src: string;
	neteaseId?: string;
	duration?: number;
};

type NeteaseSong = {
	name?: string;
	duration?: number;
	artists?: { name?: string }[];
	album?: {
		name?: string;
		picUrl?: string;
	};
};

type MetingSong = {
	title?: string;
	author?: string;
	pic?: string;
	url?: string;
};

export let tracks: Track[] = [];
export let autoplay = false;
export let initialVolume = 0.6;

let audio: HTMLAudioElement;
let currentIndex = 0;
let isPlaying = false;
let volume = Math.min(Math.max(initialVolume, 0), 1);
let playbackError = "";
let currentTime = 0;
let duration = 0;
let hydratedTracks = tracks;

$: currentTrack = hydratedTracks[currentIndex] || tracks[currentIndex];
$: displayDuration = duration || currentTrack?.duration || 0;
$: progress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0;

function formatTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function fetchNeteaseTrackInfo(track: Track) {
	if (!track.neteaseId) return track;

	try {
		const response = await fetch(
			`https://api.i-meto.com/meting/api?server=netease&type=song&id=${track.neteaseId}`,
		);
		if (response.ok) {
			const data = await response.json();
			const song: MetingSong | undefined = Array.isArray(data) ? data[0] : data;
			if (song) {
				return {
					...track,
					title: song.title || track.title,
					artist: song.author || track.artist,
					cover: song.pic || track.cover,
					src: song.url || track.src,
				};
			}
		}
	} catch {
		// Ignore metadata failures and fall back to the configured track.
	}

	try {
		const response = await fetch(
			`https://music.163.com/api/song/detail?ids=[${track.neteaseId}]`,
		);
		if (!response.ok) return track;

		const data = await response.json();
		const song: NeteaseSong | undefined = data?.songs?.[0];
		if (!song) return track;

		return {
			...track,
			title: song.name || track.title,
			artist:
				song.artists
					?.map((artist) => artist.name)
					.filter(Boolean)
					.join(" / ") ||
				track.artist ||
				song.album?.name,
			cover: song.album?.picUrl || track.cover,
			duration: song.duration
				? Math.round(song.duration / 1000)
				: track.duration,
		};
	} catch {
		return track;
	}
}

async function hydrateTrackInfo() {
	hydratedTracks = await Promise.all(tracks.map(fetchNeteaseTrackInfo));
	if (audio && currentTrack) {
		audio.src = currentTrack.src;
	}
}

function setTrack(index: number, shouldPlay = isPlaying) {
	if (hydratedTracks.length === 0) return;

	playbackError = "";
	currentTime = 0;
	const nextIndex = (index + hydratedTracks.length) % hydratedTracks.length;
	duration = hydratedTracks[nextIndex]?.duration || 0;
	currentIndex = nextIndex;
	if (!audio) return;

	audio.src = hydratedTracks[currentIndex].src;
	audio.load();

	if (shouldPlay) {
		void audio
			.play()
			.then(() => {
				isPlaying = true;
			})
			.catch(() => {
				isPlaying = false;
				playbackError = "音频链接无法播放";
			});
	}
}

function togglePlay() {
	if (!audio || !currentTrack) return;

	if (audio.paused) {
		playbackError = "";
		void audio
			.play()
			.then(() => {
				isPlaying = true;
			})
			.catch(() => {
				isPlaying = false;
				playbackError = "音频链接无法播放";
			});
	} else {
		audio.pause();
		isPlaying = false;
	}
}

function playPrevious() {
	setTrack(currentIndex - 1, true);
}

function playNext() {
	setTrack(currentIndex + 1, true);
}

function seek(event: Event) {
	if (!audio || displayDuration <= 0) return;

	const target = event.currentTarget as HTMLInputElement;
	const nextTime = (Number(target.value) / 100) * displayDuration;
	audio.currentTime = nextTime;
	currentTime = nextTime;
}

function handleAudioError() {
	isPlaying = false;
	playbackError = "音频链接无法播放";
}

onMount(() => {
	if (!audio || tracks.length === 0) return;

	hydratedTracks = tracks;
	void hydrateTrackInfo();
	audio.volume = volume;
	audio.src = hydratedTracks[currentIndex].src;

	if (autoplay) {
		void audio
			.play()
			.then(() => {
				isPlaying = true;
			})
			.catch(() => {
				isPlaying = false;
				playbackError = "音频链接无法播放";
			});
	}
});

$: if (audio) {
	audio.volume = volume;
}
</script>

{#if hydratedTracks.length > 0 && currentTrack}
	<div class="group fixed right-4 bottom-4 z-50 w-[min(24rem,calc(100vw_-_2rem))] translate-x-[calc(100%_-_3.5rem)] text-white transition-transform duration-300 hover:translate-x-0 focus-within:translate-x-0">
		<audio
			bind:this={audio}
			on:durationchange={() => duration = audio.duration || currentTrack.duration || 0}
			on:ended={playNext}
			on:error={handleAudioError}
			on:pause={() => isPlaying = false}
			on:play={() => isPlaying = true}
			on:timeupdate={() => currentTime = audio.currentTime || 0}
		></audio>

		<div class="pointer-events-none absolute left-0 top-0 z-10 h-14 w-14 overflow-hidden rounded-md shadow-2xl transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
				{#if currentTrack.cover}
					<img src={currentTrack.cover} alt="" class="h-full w-full object-cover" />
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-[#2d2d39]">
						<span class="text-3xl text-white/50">♪</span>
					</div>
				{/if}
		</div>

		<div class="relative rounded-lg border border-white/10 bg-[#2d2d39]/95 p-3 opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
			<div class="flex min-w-0 items-center gap-3">
				<div class="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/10">
					{#if currentTrack.cover}
						<img src={currentTrack.cover} alt="" class="h-full w-full object-cover" />
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<span class="text-3xl text-white/50">♪</span>
						</div>
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<div class="truncate text-sm font-semibold">{currentTrack.title}</div>
					<div class="mt-1 truncate text-xs text-white/45">{playbackError || currentTrack.artist || "未知歌手"}</div>
				</div>
			</div>

			<div class="mt-3 flex items-center gap-2 text-xs text-white/45">
				<span class="w-9 text-right">{formatTime(currentTime)}</span>
				<input
					aria-label="Music progress"
					class="h-1 min-w-0 flex-1 cursor-pointer accent-[#ff4057]"
					max="100"
					min="0"
					step="0.1"
					type="range"
					value={progress}
					on:input={seek}
				/>
				<span class="w-9">{formatTime(displayDuration)}</span>
			</div>

			<div class="mt-2 flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<button type="button" aria-label="Previous track" class="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10 active:scale-90" on:click={playPrevious}>
						<span class="text-xl leading-none">‹‹</span>
					</button>
					<button type="button" aria-label={isPlaying ? "Pause music" : "Play music"} class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4057] text-white transition hover:bg-[#ff5266] active:scale-95" on:click={togglePlay}>
						<span class="text-xl leading-none">{isPlaying ? "Ⅱ" : "▶"}</span>
					</button>
					<button type="button" aria-label="Next track" class="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10 active:scale-90" on:click={playNext}>
						<span class="text-xl leading-none">››</span>
					</button>
				</div>
				<div class="flex items-center gap-2 text-white/65">
					<span class="text-xs font-semibold tracking-wide">音量</span>
					<input
						aria-label="Music volume"
						class="w-20 accent-[#ff4057]"
						max="1"
						min="0"
						step="0.01"
						type="range"
						bind:value={volume}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
