import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
import daisyui from "daisyui";
import { light as daisyLightTheme } from "daisyui/src/theming/themes";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...daisyLightTheme,
          primary: "#29B683",
          secondary: "#212121",
          accent: "#BBBBBB",
          info: "#0000ff",
          success: "#008A57",
          warning: "#FFC700",
          error: "#F44336",
        },
      },
    ],
  },
  plugins: [
    daisyui,
    function ({ addBase }: PluginAPI) {
      addBase({
        a: { color: "#808080" },
      });
    },
  ],
};

export default config;
