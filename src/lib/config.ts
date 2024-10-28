import CalendarIcon from "./components/icons/CalendarIcon.svelte";
import PodiumIcon from "./components/icons/PodiumIcon.svelte";
import StopwatchIcon from "./components/icons/StopwatchIcon.svelte";
import TrophyIcon from "./components/icons/TrophyIcon.svelte";
import VsIcon from "./components/icons/VsIcon.svelte";

export const headerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Download",
    href: "/download",
  },
  {
    label: "Leaderboards",
    href: "/stats",
    hideUntilLg: true,
  },
  {
    label: "Guidelines",
    href: "/guidelines",
  },
  {
    label: "Store",
    href: "https://mcsrranked.com/store",
  },
];

export const sidebarLinks = [
  {
    label: "Playoffs",
    href: "/stats/playoffs",
    Icon: TrophyIcon,
  },
  {
    label: "Fastest times",
    href: "/stats/lb",
    Icon: StopwatchIcon,
  },
  {
    label: "Points leaderboard",
    href: "/stats/points-lb",
    Icon: PodiumIcon,
  },
  {
    label: "Weekly race",
    href: "/stats/weekly-race",
    Icon: CalendarIcon,
  },
  {
    label: "Compare players",
    href: "/stats/vs",
    Icon: VsIcon,
  },
];

export const downloads = [
  {
    name: "Normal Pack" as const,
    description: "Includes basic mods for MCSR Ranked",
    recommended: true,
    links: {
      windows:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Windows-1.16.1.mrpack",
      mac: "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-OSX-1.16.1.mrpack",
      linux:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Linux-1.16.1.mrpack",
    },
  },
  {
    name: "Pro Pack" as const,
    description:
      "Includes everything in Normal Pack, plus AntiResourceReload and StandardSettings. Requires Java 17+",
    links: {
      windows:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Windows-1.16.1-Pro.mrpack",
      mac: "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-OSX-1.16.1-Pro.mrpack",
      linux:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Linux-1.16.1-Pro.mrpack",
    },
  },
  {
    name: "All-in Pack" as const,
    description:
      "Includes everything in Pro Pack, plus all other RSG mods. Requires Java 17+",
    links: {
      windows:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Windows-1.16.1-All.mrpack",
      mac: "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-OSX-1.16.1-All.mrpack",
      linux:
        "https://redlime.github.io/MCSRMods/modpacks/v4/MCSRRanked-Linux-1.16.1-All.mrpack",
    },
  },
];

/** groups are put in columns on mobile */
export const footerLinkGroups = [
  [
    {
      label: "Store",
      href: "https://mcsrranked.com/store",
    },
    {
      label: "Discord",
      href: "https://mcsrranked.com/discord",
    },
    {
      label: "Contact",
      href: "mailto:mcsrranked@gmail.com",
    },
  ],
  [
    {
      label: "Privacy Policy",
      href: "/privacy",
    },
    {
      label: "OSS Licences",
      href: "/licences",
    },
    {
      label: "API Docs",
      href: "https://docs.mcsrranked.com",
    },
  ],
];
