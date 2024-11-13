import type { DetailedMatch } from "$lib/ranked-api";
import { getFinalTime, getWinnerUUID } from "./getters";
// import { groupBy } from "$lib/utils";

/**
 * - give each event a name and a detail level
 * - each timestamp "belongs" to the beginning of a split
 * - each timestamp (and its respective split) gets a color
 * - organize by player
 * - per player:
 *   - index duplicates + reassign colors to duplicates
 *   - add splits and shorten split names
 * - 1v1: compare main player to other players
 * - 3+: compare all other players to winner (or if its a draw, it doesn't matter)
 *
 */

export type MatchEvent = {
  name: string;
  timestamp: number;
  detailLevel: number;
  pairToRight: boolean;
  pairToLeft: boolean;

  /** a hex code, or `"prev"` */
  color: string;

  /** nulls if there's no matching event in any other timeline */
  diff?: Diff;

  /** The split for which this event is the start (nulls for the last event) */
  splitAfter?: {
    name: string;
    length: number;
    pairToRight: boolean;
    pairToLeft: boolean;

    /** nulls if there's no matching event in any other timeline */
    diff?: Diff;
  };
};

type Diff = {
  /** difference in time compared to opponent (or winner for 3+) */
  time: number;

  /** 0 to 1 (`diff.time / <biggest diff this timeline>`) */
  importance: number;

  /** light -> dark red for more negative, light -> dark green for more positive */
  color: string;
};

export function getTimelines(match: DetailedMatch, playerOrder: string[]) {
  match.timelines.reverse(); // the api returns the timeline last event to first event

  return [0, 1, 2, 3].map((detailLevel) =>
    getTimelinesAtDetailLevel(match, playerOrder, detailLevel),
  );
}

/**
 * @returns an array of playername-timeline pairs where the winner is put first, unless
 * `curPlayerName` is specified, in which case that player is put first
 */
function getTimelinesAtDetailLevel(
  match: DetailedMatch,
  playerOrder: string[],
  detailLevel: number,
) {
  const ret = getSplitTimelines(match.timelines, playerOrder).map(
    (timeline, i) => {
      const newTimeline = timeline
        .map((event) => getSimpleEvent(event.type, event.time))
        .filter(Boolean)
        .filter((event) => event.detailLevel <= detailLevel);

      addMissingEvents(newTimeline, {
        finalTime: getFinalTime(match),
        winnerUUID: getWinnerUUID(match),
        unformattedTimeline: match.timelines,
        forfeited: match.forfeited,
        curPlayerUUID: playerOrder[i],
      });

      fillColors(newTimeline);
      addSplits(newTimeline);
      indexDuplicates(newTimeline);
      return newTimeline;
    },
  );

  if (ret.length === 2) {
    diffTimelines(ret[0], ret[1]);
    pairTimelines(ret[0], ret[1]);
  } else if (ret.length > 2) {
    for (let i = 1; i < ret.length; i++) {
      diffTimelines(ret[i], ret[0]);
    }
  }

  return ret;
}

function pairTimelines(left: MatchEvent[], right: MatchEvent[]) {
  left.forEach((leftEvent, i) => {
    const matchingTimestampIdx = right.findIndex(
      (event) => event.name === leftEvent.name,
    );
    if (matchingTimestampIdx === i) {
      leftEvent.pairToRight = true;
      right[matchingTimestampIdx].pairToLeft = true;
    }

    const leftSplit = leftEvent.splitAfter;
    if (leftSplit) {
      const matchingSplitIdx = right.findIndex(
        (event) => event.splitAfter?.name === leftSplit.name,
      );
      if (matchingSplitIdx === i) {
        leftSplit.pairToRight = true;
        right[matchingSplitIdx].splitAfter!.pairToLeft = true;
      }
    }
  });
}

function diffTimelines(mutating: MatchEvent[], comparingTo: MatchEvent[]) {
  let biggestTimestampDiff = 0;
  let biggestSplitDiff = 0;

  mutating.forEach((event, i) => {
    // get timeDiffs for timestamps
    const matchingTimestamp = comparingTo.find(
      (event2) => event.name === event2.name,
    );
    if (matchingTimestamp) {
      const timeDiff = event.timestamp - matchingTimestamp.timestamp;
      biggestTimestampDiff = Math.max(biggestTimestampDiff, Math.abs(timeDiff));

      event.diff = {
        time: timeDiff,
        importance: 0,
        color: "",
      };
    }

    // get timeDiffs for splits
    if (!event.splitAfter) return;

    const matchingSplit = comparingTo.find(
      (event2) => event.splitAfter!.name === event2.splitAfter?.name,
    );
    if (matchingSplit) {
      const timeDiff =
        event.splitAfter.length - matchingSplit.splitAfter!.length;
      biggestSplitDiff = Math.max(biggestSplitDiff, Math.abs(timeDiff));

      event.splitAfter.diff = {
        time: timeDiff,
        importance: 0,
        color: "",
      };
    }

    mutating[i] = event;
  });

  // add color and importance
  mutating.forEach((event, i) => {
    if (event.diff) {
      event.diff = getDiff(event.diff.time, biggestTimestampDiff);
    }
    if (event.splitAfter?.diff) {
      event.splitAfter.diff = getDiff(
        event.splitAfter.diff.time,
        biggestSplitDiff,
      );
    }
    mutating[i] = event;
  });
}

function getDiff(timeDiff: number, biggestDiff: number): Diff {
  const importance = Math.abs(timeDiff) / biggestDiff;
  const color = `hsl(${timeDiff >= 0 ? 0 : 142}, 70%, ${Math.round(
    90 - 40 * importance ** 1.5,
  )}%)`;
  return {
    time: timeDiff,
    importance,
    color,
  };
}

function getSplitTimelines(
  timeline: DetailedMatch["timelines"],
  playerOrder: string[],
) {
  const timelines: (typeof timeline)[] = playerOrder.map(() => []);
  for (const event of timeline) {
    const playerIdx = playerOrder.findIndex((uuid) => event.uuid === uuid);
    if (playerIdx !== -1) {
      timelines[playerIdx].push(event);
    }
  }

  return timelines;
}

/** Assign the `"prev"` colors to the previous color */
export function fillColors(timeline: MatchEvent[]) {
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].color === "prev") {
      timeline[i].color = timeline[i - 1].color;
    }
  }
}

/** mutates `timeline`, adding `splitAfter` to each event (except the last) */
export function addSplits(timeline: MatchEvent[]) {
  for (let i = 0; i < timeline.length - 1; i++) {
    const { name, timestamp } = timeline[i];
    const next = timeline[i + 1];
    const nextTimestamp = next.timestamp;
    const splitName = shortenSplitName(`${name} → ${next.name}`);
    const splitLength = nextTimestamp - timestamp;
    timeline[i].splitAfter = {
      name: splitName,
      length: splitLength,
      pairToLeft: false,
      pairToRight: false,
    };
  }
}

export function addMissingEvents(
  timeline: MatchEvent[],
  {
    finalTime,
    forfeited = false,
    unformattedTimeline,
    winnerUUID,
    curPlayerUUID = winnerUUID ?? undefined,
  }: {
    finalTime: number;
    unformattedTimeline: { type: string }[];
    forfeited?: boolean;
    winnerUUID: string | null;
    curPlayerUUID?: string;
  },
) {
  timeline.unshift(newEvent("start", 0, "#5e5", 0));

  if (winnerUUID === null) {
    timeline.push(newEvent("draw", 0, "#3b82f6", finalTime));
  } else if (winnerUUID === curPlayerUUID) {
    timeline.push(
      newEvent(forfeited ? "win" : "finish", 0, "#22c55e", finalTime),
    );
  } else if (!forfeited) {
    timeline.push(newEvent("lose", 0, "#ef4444", finalTime));
  } else if (
    !unformattedTimeline.find(
      (event) => event.type === "projectelo.timeline.forfeit",
    )
  ) {
    timeline.push(newEvent("disconnected", 0, "#ef4444", finalTime));
  }

  return timeline;
}

function shortenSplitName(splitName: string) {
  const map = new Map([
    ["stronghold → end enter", "stronghold nav"],
    ["end enter → finish", "end split"],
    ["start → nether enter", "overworld"],
    ["nether enter → bastion", "terrain to bastion"],
    // ["nether enter → fortress", "terrain to fortress"],
  ]);
  return map.get(splitName) ?? splitName;
}

/** mutates `timeline`, indexing duplicate events and splits (e.g. nether enter 2) */
export function indexDuplicates(timeline: MatchEvent[]) {
  const numSeenEvents = new Map<string, number>();
  const numSeenSplits = new Map<string, number>();
  for (let i = 0; i < timeline.length; i++) {
    // index event
    const eventName = timeline[i].name;
    const eventCount = numSeenEvents.get(eventName) ?? 0;
    if (eventCount > 0) {
      numSeenEvents.set(eventName, eventCount + 1);
      timeline[i].name += ` ${eventCount + 1}`;
    } else {
      numSeenEvents.set(eventName, 1);
    }

    // index split (almost copy paste)
    const splitName = timeline[i]?.splitAfter?.name;
    if (splitName == null) continue;
    const splitCount = numSeenSplits.get(splitName) ?? 0;
    if (splitCount > 0) {
      numSeenSplits.set(splitName, splitCount + 1);
      timeline[i].splitAfter!.name += ` ${splitCount + 1}`;
    } else {
      numSeenSplits.set(splitName, 1);
    }
  }
}

function newEvent(
  name: string,
  detailLevel: number,
  color: string,
  timestamp: number,
): MatchEvent {
  return {
    name,
    detailLevel,
    color,
    timestamp,
    pairToLeft: false,
    pairToRight: false,
  };
}

export function getSimpleEvent(eventName: string, eventTimestamp: number) {
  switch (eventName) {
    case "projectelo.timeline.reset":
      return newEvent("reset", 0, "#5e5", eventTimestamp);

    case "projectelo.timeline.forfeit":
      return newEvent("forfeit", 0, "#ef4444", eventTimestamp);

    case "projectelo.timeline.death":
      return newEvent("death", 0, "#5e5", eventTimestamp);

    case "projectelo.timeline.death_spawnpoint":
      return newEvent("death reset", 2, "prev", eventTimestamp);

    case "story.mine_stone":
      return newEvent("stone", 3, "prev", eventTimestamp);

    case "story.smelt_iron":
      return newEvent("iron", 3, "prev", eventTimestamp);

    case "story.mine_diamond":
      return newEvent("diamonds", 3, "prev", eventTimestamp);

    case "story.root":
      return newEvent("crafting table", 2, "prev", eventTimestamp);

    case "story.iron_tools":
      return newEvent("iron pickaxe", 3, "prev", eventTimestamp);

    case "story.lava_bucket":
      return newEvent("lava", 3, "#f97316", eventTimestamp);

    case "story.enter_the_nether":
      return newEvent("nether enter", 0, "#f55", eventTimestamp);

    case "nether.find_bastion":
      return newEvent("bastion", 0, "#111", eventTimestamp);

    case "nether.find_fortress":
      return newEvent("fortress", 0, "#600", eventTimestamp);

    case "story.deflect_arrow":
      return newEvent("use shield", 2, "prev", eventTimestamp);

    case "adventure.kill_a_mob":
      return newEvent("first mob kill", 3, "prev", eventTimestamp);

    case "nether.obtain_blaze_rod":
      return newEvent("first rod", 1, "#600", eventTimestamp);

    case "projectelo.timeline.blind_travel":
      return newEvent("blind", 1, "#75e", eventTimestamp);

    case "story.follow_ender_eye":
      return newEvent("stronghold", 0, "#7a8", eventTimestamp);

    case "story.enter_the_end":
      return newEvent("end enter", 0, "#dbdeab", eventTimestamp);

    case "adventure.sleep_in_bed":
      return newEvent("sleep", 2, "prev", eventTimestamp);

    case "adventure.shoot_arrow":
      return newEvent("shoot mob", 2, "prev", eventTimestamp);

    case "adventure.ol_betsy":
      return newEvent("use crossbow", 2, "prev", eventTimestamp);

    case "nether.loot_bastion":
      return newEvent("open bastion chest", 2, "prev", eventTimestamp);

    case "story.form_obsidian":
      return newEvent("obsidian", 3, "prev", eventTimestamp);

    case "nether.obtain_crying_obsidian":
      return newEvent("crying obby", 3, "prev", eventTimestamp);

    case "nether.distract_piglin":
      return newEvent("Oh Shiny", 3, "prev", eventTimestamp);

    case "story.upgrade_tools":
      return newEvent("stone pickaxe", 3, "prev", eventTimestamp);

    case "nether.return_to_sender":
      return newEvent("Return To Sender", 3, "prev", eventTimestamp);

    case "adventure.trade":
      return newEvent("villager trade", 3, "prev", eventTimestamp);

    default:
      return null;
  }
}
