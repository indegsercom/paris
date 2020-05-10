import sharp from "sharp";
import axios from "axios";
import mime from "mime-types";
import { upload } from "../lib/aws";
import shortid from "shortid";
import { handleErrors, createError } from "micro-boom";
import compose from "micro-compose";
import { NowResponse } from "@now/node";

const getResizeOptions = (requestBody) => {
  const res = {};
  const whitelists = ["width", "height"];
  for (const key of whitelists) {
    const value = Number(requestBody[key]);
    if (isNaN(value) || value <= 0) {
      continue;
    }

    res[key] = value;
  }

  return res;
};

const handler = async (req, res: NowResponse) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    throw createError(405);
  }

  const { image } = req.body;
  const resizeOptions = {
    ...getResizeOptions(req.body),
    withoutEnlargement: true,
  };

  let info;
  const resizer = sharp()
    .resize(resizeOptions)
    .on("info", function (_info) {
      info = _info;
    });

  const response = await axios(image as string, {
    method: "get",
    responseType: "stream",
  });

  const contentType = response.headers["content-type"];
  const key = [shortid(), mime.extension(contentType)]
    .filter(Boolean)
    .join(".");

  const uploadConfig = {
    Key: key,
    ContentType: contentType,
  };
  const stream = response.data.pipe(resizer);
  const data = await upload(uploadConfig, stream);

  res.json({
    location: data.Location,
    info,
  });
};

export default compose(handleErrors)(handler);
