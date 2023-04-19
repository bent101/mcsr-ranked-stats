const base = "https://mcsrranked.com/api";

export const getUUID = async (name: string) => {
	const res = await fetch(`https://playerdb.co/api/player/minecraft/${name}`);
	const data = await res.json();
	if (data.code !== "player.found") return null;
	return data.data.player.raw_id;
};

export const getLeaderboard = async () => {
	const res = await fetch(`${base}/leaderboard`);
	const data = await res.json();
	if (data.status !== "success") return null;
	return data.data;
};

export const getPlayer = async (name: string) => {
	const res = await fetch(`${base}/users/${name}`);
	const data = await res.json();
	if (data.status !== "success") return null;
	return data.data;
};

export const getMatches = async (name: string, page: number) => {
	const res = await fetch(`${base}/users/${name}/matches?page=${page}&filter=2`);
	const data = await res.json();
	if (data.status !== "success") return null;
	let matches = data.data.map(
		({ is_decay, winner, final_time, members, score_changes, forfeit }) => {
			let opponent = undefined;
			let time = undefined;
			let outcome = undefined;
			const uuid = members.find((member) => member.nickname === name).uuid;
			if (!is_decay) {
				opponent = members.find((member) => member.nickname !== name).nickname;
				outcome = "draw";
				if (winner) outcome = winner === uuid ? "won" : "lost";
				time = formatTime(final_time);
			}

			const { change, score } = score_changes.find((member) => member.uuid === uuid);
			return {
				isDecay: is_decay,
				opponent,
				outcome,
				forfeit,
				time,
				eloChange: change,
				eloAfter: score,
			};
		}
	);
	return matches;
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
