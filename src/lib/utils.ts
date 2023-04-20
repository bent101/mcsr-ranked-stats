import type { PlayerInfo, Match, EloLeaderboard } from "./ranked-api";

const base = "https://mcsrranked.com/api";

export const getLeaderboard = async () => {
	const data = await fetch(`${base}/leaderboard`).then((res) => res.json());
	if (data.status !== "success") return null;
	return data.data as EloLeaderboard;
};

export const getPlayer = async (name: string) => {
	const data = await fetch(`${base}/users/${name}`).then((res) => res.json());
	if (data.status !== "success") return null;
	return data.data as PlayerInfo;
};

export const getMatches = async (name: string, page: number) => {
	const res = await fetch(`${base}/users/${name}/matches?page=${page}&filter=2`);
	const data = await res.json();
	if (data.status !== "success") return null;
	return (data.data as Match[]).map(
		({ is_decay, winner, final_time, members, score_changes, forfeit }: Match) => {
			let opponent = undefined;
			let time = undefined;
			let outcome: "won" | "lost" | "draw" | undefined = undefined;
			const uuid = members.find((member) => member.nickname === name).uuid;
			if (!is_decay) {
				opponent = members.find((member) => member.nickname !== name).nickname;
				outcome = "draw";
				if (winner) outcome = winner === uuid ? "won" : "lost";
				time = formatTime(final_time);
			}

			const scoreChange = score_changes?.find((member) => member.uuid === uuid);
			const eloChange = scoreChange?.change;
			const eloAfter = scoreChange?.score;
			return {
				isDecay: is_decay,
				opponent,
				outcome,
				forfeit,
				time,
				eloChange,
				eloAfter,
			};
		}
	);
};

export const getAvatar = (uuid: string, size = 64) => {
	return `https://crafatar.com/avatars/${uuid}?overlay&size=${size}`;
};

export const formatTime = (timeInMs: number) => {
	const seconds = ~~(timeInMs / 1000);
	const minutes = ~~(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
