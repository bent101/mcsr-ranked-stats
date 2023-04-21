export type PlayerInfo = {
	nickname: string;
	uuid: string;
	badge: number;
	elo_rate: number;
	elo_rank: number | null;
};

export type ScoreChange = {
	uuid: string;
	change: number;
	score: number;
};

export type VersusWinCount = {
	total: number;
	[UUID1: string]: number;
	[UUID2: string]: number;
};

export type MatchTimeline = {
	uuid: string;
	time: number;
	timeline: string;
};

/** 1: casual, 2: ranked, 3: private */
export type MatchType = 1 | 2 | 3;

/** in milliseconds */
export type MatchDuration = number;

/** epoch time in seconds */
export type Date = number;

export type DetailedPlayer = {
	uuid: string;
	nickname: string;
	badge: number;
	elo_rate: number;
	elo_rank: number | null;
	created_time: Date;
	latest_time: Date;
	total_played: number;
	season_played: number;
	highest_winstreak: number;
	current_winstreak: number;
	prev_elo_rate: number;
	best_elo_rate: number;
	best_record_time: MatchDuration;
	records: {
		1: {
			win: number;
			lose: number;
			draw: number;
		};
		2: {
			win: number;
			lose: number;
			draw: number;
		};
	};
	achievements: [
		{
			achieve_type: number;
			tag_name: string;
			achieve_time: Date;
			achieve_data: string;
		}
	];
	connections: {
		discord: {
			id: string;
			name: string;
		} | null;
		twitch: {
			id: string;
			name: string;
		} | null;
		youtube: {
			id: string;
			name: string;
		} | null;
	};
};

export type Match = {
	match_id: number;
	match_type: number;
	match_date: Date;
	winner: string | null;
	final_time: MatchDuration;
	match_season: number;
	members: PlayerInfo[];
	score_changes?: ScoreChange[];
	forfeit: boolean;
	is_decay: boolean;
};

export type DetailedMatch = {
	match_id: number;
	seed_type: string;
	match_type: MatchType;
	winner: string | null;
	members: PlayerInfo[];
	final_time: MatchDuration;
	score_changes: ScoreChange[] | null;
	forfeit: boolean;
	match_season: number;
	category: string;
	match_date: Date;
	is_decay: boolean;
	timelines:
		| null
		| {
				time: number;
				timeline: string;
				uuid: string;
		  }[];
};

export type EloLeaderboard = {
	users: PlayerInfo[];
	season_number: number;
	season_end_time: MatchDuration;
};

export type RecordLeaderboard = {
	final_time_rank: number;
	match_id: number;
	final_time: MatchDuration;
	match_date: Date;
	user: PlayerInfo;
};
