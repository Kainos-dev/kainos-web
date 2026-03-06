import { Outfit, DM_Sans } from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});