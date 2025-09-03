// config/assetsConfig.ts

// --- Icon Imports ---
import chevronDown from "../assets/chevronDown.svg";
import left from "../assets/left.svg";
import bold from "../assets/bold.svg";
import italic from "../assets/italic.svg";
import underline from "../assets/underline.svg";
import strikethrough from "../assets/strikethrough.svg";
import inlineCode from "../assets/inlineCode.svg";
import clearFormatting from "../assets/clearFormatting.svg";
import bullet from "../assets/bullet.svg";
import number from "../assets/number.svg";
import attach from "../assets/attach.svg";
import image from "../assets/image.svg";
import video from "../assets/video.svg";
import blockCode from "../assets/blockCode.svg";
import quote from "../assets/quote.svg";
import line from "../assets/line.svg";
import link from "../assets/link.svg";

// --- Data Imports ---
import colorsData from "../assets/colors.json";

// --- Exported Asset Object ---
// We group assets by type for clean and predictable access.
export const ASSETS = {
  icons: {
    chevronDown,
    left,
    bold,
    italic,
    underline,
    strikethrough,
    inlineCode,
    clearFormatting,
    bullet,
    number,
    attach,
    image,
    video,
    blockCode,
    quote,
    line,
    link
  },
  data: {
    colors: colorsData
  }
};
