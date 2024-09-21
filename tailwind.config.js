import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
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
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    }),
    require("@xpd/tailwind-3dtransforms"),
    plugin(({ addVariant }) => {
      // e.g. hover:bg-tint actually does hover:bg-tint and focus-visible:bg-tint
      addVariant("hover", ["@media(hover:hover){&:hover}", "&:focus-visible"]);
      // and active:bg-tint actually does active:hover:bg-tint and active:focus-visible:bg-tint
      // to avoid active styles being applied after you mouse down and drag off
      addVariant("active", ["&:active:hover", "&:active:focus-visible"]);
    }),
  ],
};
