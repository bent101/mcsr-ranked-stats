import CalendarIcon from "./components/icons/CalendarIcon.svelte";
import PodiumIcon from "./components/icons/PodiumIcon.svelte";
import StopwatchIcon from "./components/icons/StopwatchIcon.svelte";
import VsIcon from "./components/icons/VsIcon.svelte";

export const headerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Leaderboards",
    href: "/stats",
  },
  {
    label: "Playoffs",
    href: "/playoffs",
  },
  {
    label: "Download",
    href: "/download",
  },
  {
    label: "Guidelines",
    href: "/guidelines",
  },
  {
    label: "Shop",
    href: "https://mcsrranked.tebex.io/",
  },
];

export const sidebarLinks = [
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
