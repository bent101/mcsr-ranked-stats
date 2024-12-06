export type APIResponse<T> = Promise<{
  status: "success" | "error";
  data: T;
}>;

export type Player = {
  uuid: string;
  nickname: string;
  roleType: number;
  eloRate: number | null;
  eloRank: number | null;
};

export type ScoreChange = {
  uuid: string;
} & (
  | { change: null; eloRate: null } // placements
  | { change: number; eloRate: number }
);

export type VersusWinCount = {
  total: number;
  [UUID1and2: string]: number;
};

export type Achievement = {
  id: string;
  /** epoch time in seconds */
  date: number;
  data: string[];
  level: number;
};

/** 1: casual, 2: ranked, 3: private, 4: event */
export type MatchType = 1 | 2 | 3 | 4;

export type DetailedPlayer = Player & {
  achievements: {
    display: Achievement[];
    total: Achievement[];
  };
  timestamp: {
    /** epoch time in seconds */
    firstOnline: number;
    /** epoch time in seconds */
    lastOnline: number;
    /** epoch time in seconds */
    lastRanked: number;
  };
  statistics: Record<
    "season" | "total",
    Record<
      | "bestTime"
      | "highestWinStreak"
      | "currentWinStreak"
      | "playedMatches"
      | "playtime"
      | "forfeits"
      | "completions"
      | "wins"
      | "loses"
      | "completionTime",
      {
        ranked: number;
        casual: number;
      }
    >
  >;
  connections: Record<
    "discord" | "twitch" | "youtube",
    { id: string; name: string } | null
  >;
  seasonResult: {
    last: {
      eloRate: number | null;
      eloRank: number;
      phasePoint: number;
    };
    highest: number;
    lowest: number;
    phases: {
      phase: number;
      eloRate: number | null;
      eloRank: number;
      point: number;
    }[];
  };
};

export type Match = {
  id: number;
  type: number;
  season: number;
  category: string;
  /** epoch time in seconds */
  date: number;
  players: Player[];
  spectators: Player[];
  forfeited: boolean;
  rank: {
    season: number;
    allTime: number;
  };
  changes?: ScoreChange[];
  seedType: string;
  bastionType?: "HOUSING" | "BRIDGE" | "STABLES" | "TREASURE";
} & (
  | {
      decayed: false;
      result: {
        uuid: string | null;
        /** in milliseconds */
        time: number;
      };
    }
  | {
      decayed: true;
      result: null;
    }
);

export type DetailedMatch = Match & {
  completions: {
    uuid: string;
    /** in milliseconds */
    time: number;
  }[];
  timelines: {
    uuid: string;
    /** in milliseconds */
    time: number;
    type: string;
  }[];
};

export type EloLeaderboard = {
  season: {
    number: number;
    endsAt: number;
  };
  users: Player[];
};

export type RecordLeaderboard = {
  season: number;
  rank: number;
  id: number;
  /** in milliseconds */
  time: number;
  /** epoch time in seconds */
  date: number;
  user: Player;
}[];

export type PointsLeaderboard = {
  phase: {
    /** epoch time in seconds */
    endsAt: number;
    number: number;
    season: number;
  };
  users: (Player & {
    seasonResult: {
      eloRate: number | null;
      eloRank: number;
      phasePoint: number;
    };
  })[];
};

export type WeeklyRaceLeaderboard = {
  id: number;
  seed: {
    overworld: string;
    nether: string;
  };
  endsAt: number;
  leaderboard: {
    rank: number;
    player: Player;
    time: number;
  }[];
};
