import { z } from "zod";

export const GetPictureModel = z.object({
  icons: z.string().transform((icon) => icon.split(",")),
  theme: z.enum(["dark", "white"]).default("dark"),
  size: z
    .enum(["32", "48", "64"])
    .default("48")
    .transform((content) => parseInt(content)),
  spacing: z
    .enum(["0", "5", "10"])
    .default("5")
    .transform((content) => parseInt(content)),
  iconsPerLine: z
    .enum([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ])
    .default("15")
    .transform((content) => parseInt(content)),
});

export type GetPictureModel = z.infer<typeof GetPictureModel>;
