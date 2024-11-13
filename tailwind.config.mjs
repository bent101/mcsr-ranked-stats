import scrollbar from "tailwind-scrollbar";
import plugin from "tailwindcss/plugin";
// @ts-expect-error no typedefs for this package
import transforms from "@xpd/tailwind-3dtransforms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        zinc: {
          925: "#121214",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      screens: {
        "3xl": "1792px",
      },
      spacing: {
        "header-height": "var(--header-height)",
        "screen-minus-header": "calc(100vh - var(--header-height))",
      },
    },
  },
  plugins: [
    scrollbar,
    transforms,
    plugin(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    }),
    plugin(({ addVariant }) => {
      // e.g. hover:bg-tint actually does hover:bg-tint and focus-visible:bg-tint
      addVariant("hover", ["@media(hover:hover){&:hover}", "&:focus-visible"]);
      // e.g. group-hover:bg-tint actually does group-hover:bg-tint and group-focus-visible:bg-tint
      addVariant("group-hover", [
        "@media(hover: hover){.group:hover &}",
        ".group:focus-visible &",
      ]);
      // and active:bg-tint actually does active:hover:bg-tint and active:focus-visible:bg-tint
      // to avoid active styles being applied after you mouse down and drag off
      addVariant("active", ["&:active:hover", "&:active:focus-visible"]);
    }),
  ],
};
