import CalendarIcon from "./components/icons/CalendarIcon.svelte";
import CartIcon from "./components/icons/CartIcon.svelte";
import DiscordIcon from "./components/icons/DiscordIcon.svelte";
import DownloadIcon from "./components/icons/DownloadIcon.svelte";
import HomeIcon from "./components/icons/HomeIcon.svelte";
import ListIcon from "./components/icons/ListIcon.svelte";
import PodiumIcon from "./components/icons/PodiumIcon.svelte";
import StatsIcon from "./components/icons/StatsIcon.svelte";
import StopwatchIcon from "./components/icons/StopwatchIcon.svelte";
import TrophyIcon from "./components/icons/TrophyIcon.svelte";
import TwitterIcon from "./components/icons/TwitterIcon.svelte";
import VsIcon from "./components/icons/VsIcon.svelte";
import YoutubeIcon from "./components/icons/YoutubeIcon.svelte";

export const store = {
  label: "Store",
  href: "https://mcsrranked.com/store",
  Icon: CartIcon,
} as const;

export const headerLinks = [
  {
    label: "Home",
    href: "/",
    Icon: HomeIcon,
  },
  {
    label: "Download",
    href: "/download",
    Icon: DownloadIcon,
  },
  {
    label: "Playoffs",
    href: "/playoffs",
    Icon: TrophyIcon,
  },
  {
    label: "Leaderboard",
    href: "/stats",
    Icon: StatsIcon,
  },
  {
    label: "Guidelines",
    href: "/guidelines",
    Icon: ListIcon,
  },
  store,
] as const;

export const sidebarLinks = [
  // {
  //   label: "Playoffs",
  //   href: "/stats/playoffs",
  //   Icon: TrophyIcon,
  // },
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
] as const;

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
      "Adds AntiResourceReload and StandardSettings, requires Java 17+",
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
      "Includes everything in Pro Pack plus all other RSG mods, requires Java 17+",
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
      label: "OSS Licenses",
      href: "/licenses",
    },
    {
      label: "API Docs",
      href: "https://docs.mcsrranked.com",
    },
  ],
];

export const guidelines = [
  "Do not modify the mod or attempt to cheat.",
  "All runs must follow the rules of the speedrun.com Minecraft Any% Glitchless leaderboard.",
  "Do not purposefully lose games or boost your account with the intention of queuing into players outside your skill level.",
  "Do not post toxic messages or NSFW content in chat.",
  "If you have had toxic tendencies recently in the MCSR community, your chat will be disabled for all opponents.",
  "Do not use alternate accounts.",
  "Only use <a href='https://gist.github.com/RedLime/bb1d3f49a01ff43f21bc218da964cdd8' target='_blank'>whitelisted mods</a>.",
];

export const licenses = [
  {
    title: "Java-WebSocket",
    href: "javawebsocket",
    license: "MIT License - Copyright © 2010-2020 Nathan Rajilich",
    sourceLink: "https://github.com/TooTallNate/Java-WebSocket/",
    licenseLink:
      "https://github.com/TooTallNate/Java-WebSocket/blob/master/LICENSE",
  },
  {
    title: "Fabric API",
    href: "fabricapi",
    license: "Apache License 2.0",
    sourceLink: "https://github.com/FabricMC/fabric/",
    licenseLink: "https://github.com/FabricMC/fabric/blob/1.20.1/LICENSE",
  },
  {
    title: "Fabric-ASM",
    href: "fabricasm",
    license: "Mozilla Public License 2.0",
    sourceLink: "https://github.com/Chocohead/Fabric-ASM/",
    licenseLink: "https://github.com/Chocohead/Fabric-ASM/blob/master/LICENSE",
  },
  {
    title: "SpeedRunIGT",
    href: "speedrunigt",
    license: "MIT License - Copyright © 2021 RedLime",
    sourceLink: "https://github.com/RedLime/SpeedRunIGT/",
    licenseLink: "https://github.com/RedLime/SpeedRunIGT/blob/1.16.1/LICENSE",
  },
  {
    title: "prettytime",
    href: "prettytime",
    license: "Apache License 2.0",
    sourceLink: "https://github.com/ocpsoft/prettytime/",
    licenseLink: "https://github.com/ocpsoft/prettytime/blob/master/LICENSE",
  },
  {
    title: "DiscordIPC",
    href: "discordipc",
    license: "Apache License 2.0",
    sourceLink: "https://github.com/CDAGaming/DiscordIPC/",
    licenseLink: "https://github.com/CDAGaming/DiscordIPC/blob/master/LICENSE",
  },
  {
    title: "ChunkCacher",
    href: "chunkcacher",
    license: "MIT License",
    sourceLink:
      "https://github.com/Minecraft-Java-Edition-Speedrunning/mcsr-chunkcacher-1.16-1.17.1/",
    licenseLink:
      "https://github.com/Minecraft-Java-Edition-Speedrunning/mcsr-chunkcacher-1.16-1.17.1/blob/main/LICENSE",
  },
];

export const socialLinks = [
  {
    href: "https://x.com/mcsr_ranked",
    icon: TwitterIcon,
    label: "Twitter",
  },
  {
    href: "https://www.youtube.com/@MCSR_Ranked",
    icon: YoutubeIcon,
    label: "YouTube",
  },
  {
    href: "https://mcsrranked.com/discord",
    icon: DiscordIcon,
    label: "Discord",
  },
] as const;
