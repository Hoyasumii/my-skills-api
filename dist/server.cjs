"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_config = require("dotenv/config");
var import_hono3 = require("hono");

// src/routes/index.ts
var import_hono2 = require("hono");

// src/repositories/local-storage/picture-repository.ts
var import_node_process = __toESM(require("process"), 1);
var import_promises = require("fs/promises");
var import_node_path = __toESM(require("path"), 1);
var PictureRepository = class {
  pwd = import_node_process.default.env.PWD;
  async getPictures(...pictures) {
    pictures = pictures.map(
      (picture) => import_node_path.default.join(this.pwd, `data/${picture}.svg`)
    );
    return pictures;
  }
  async getAll() {
    let content = await (0, import_promises.readdir)(import_node_path.default.join(this.pwd, "data"));
    content = content.map((item) => item.split(".")[0]);
    return content;
  }
};

// src/utils/process-picture-buffer.ts
function processPictureBuffer(pictures, iconsPerLine, size, spacing) {
  const compositeContent = [];
  const baseWidth = pictures.length > iconsPerLine ? iconsPerLine : pictures.length;
  const totalRows = Math.ceil(pictures.length / iconsPerLine);
  const width = baseWidth * size + (baseWidth - 1) * spacing;
  const height = totalRows * size + (totalRows - 1) * spacing;
  pictures.forEach((picture, index) => {
    const row = Math.floor(index / iconsPerLine);
    const col = index % iconsPerLine;
    const top = row * (size + spacing);
    const left = col * (size + spacing);
    compositeContent.push({
      input: picture,
      top,
      left
    });
  });
  return {
    content: compositeContent,
    width,
    height
  };
}

// src/services/pictures/getting-pictures.ts
var import_node_fs = require("fs");
var import_sharp = __toESM(require("sharp"), 1);
var GettingPictures = class {
  constructor(repository) {
    this.repository = repository;
  }
  async run({
    icons,
    iconsPerLine,
    size,
    spacing,
    theme
  }) {
    const pictures = [];
    if (icons[0] === "all") icons = await this.repository.getAll();
    icons = await this.repository.getPictures(...icons);
    for (const picture of icons) {
      const selectedTheme = theme === "dark" ? "#1f2937" : "#e5e7eb";
      const fileExists = (0, import_node_fs.existsSync)(picture);
      const transparentPicture = await (0, import_sharp.default)({
        create: {
          width: 512,
          height: 512,
          channels: 4,
          background: { alpha: 0, r: 255, g: 255, b: 255 }
        }
      }).webp().toBuffer();
      const background = `<svg width="512" height="512">
        <rect x="0" y="0" width="512" height="512" rx="50" ry="50" fill="${selectedTheme}"/>
      </svg>`;
      const resizedImage = await (0, import_sharp.default)(
        fileExists ? picture : transparentPicture
      ).resize(size, size).toFormat("webp").toBuffer();
      pictures.push(
        await (0, import_sharp.default)(Buffer.from(background)).resize(size, size).composite([
          {
            input: resizedImage,
            blend: "over"
          }
        ]).toBuffer()
      );
    }
    const {
      content: compositeicons,
      height,
      width
    } = processPictureBuffer(pictures, iconsPerLine, size, spacing);
    return await (0, import_sharp.default)({
      create: {
        width,
        height,
        channels: 4,
        background: { alpha: 0, r: 255, g: 255, b: 255 }
      }
    }).composite(compositeicons).toFormat("webp").toBuffer();
  }
};

// src/services/pictures/list-pictures.ts
var ListPictures = class {
  constructor(repository) {
    this.repository = repository;
  }
  async run(_ = void 0) {
    return await this.repository.getAll();
  }
};

// src/generators/make-getting-picture.ts
function makeGettingPicture() {
  const repository = new PictureRepository();
  return new GettingPictures(repository);
}

// src/generators/make-list-pictures.ts
function makeListPictures() {
  const repository = new PictureRepository();
  return new ListPictures(repository);
}

// src/models/pictures/get-picture.ts
var import_zod = require("zod");
var GetPictureModel = import_zod.z.object({
  icons: import_zod.z.string().transform((icon) => icon.split(",")),
  theme: import_zod.z.enum(["dark", "white"]).default("dark"),
  size: import_zod.z.enum(["32", "48", "64"]).default("48").transform((content) => parseInt(content)),
  spacing: import_zod.z.enum(["0", "5", "10"]).default("5").transform((content) => parseInt(content)),
  iconsPerLine: import_zod.z.enum([
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
    "30"
  ]).default("15").transform((content) => parseInt(content))
});

// src/routes/picture-routes.ts
var import_zod_validator = require("@hono/zod-validator");
var import_hono = require("hono");
var pictureRoutes = new import_hono.Hono();
pictureRoutes.get("/gen", (0, import_zod_validator.zValidator)("query", GetPictureModel), async (c) => {
  const data = c.req.valid("query");
  const service = makeGettingPicture();
  return c.body(new Uint8Array(await service.run(data)), 200, { "Content-Type": "image/webp" });
});
pictureRoutes.get("/list", async (c) => {
  const service = makeListPictures();
  return c.json(await service.run());
});

// src/routes/index.ts
var routes = new import_hono2.Hono();
routes.route("/", pictureRoutes);
var routes_default = routes;

// src/app.ts
var app = new import_hono3.Hono();
app.route("/", routes_default);
var app_default = app;

// src/server.ts
var import_node_server = require("@hono/node-server");
(0, import_node_server.serve)(
  {
    fetch: app_default.fetch,
    port: parseInt(process.env.PORT)
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  }
);
