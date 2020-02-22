import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import axios from "axios";
import mime from "mime-types";
import { upload } from "../../../lib/aws";
import shortid from "shortid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { image, w, h } = req.query;
  const resizeOptions = {
    width: w ? Number(w) : null,
    height: h ? Number(h) : null,
    withoutEnlargement: true
  };

  let info;
  const resizer = sharp()
    .resize(resizeOptions)
    .on("info", function(_info) {
      info = _info;
    });

  const response = await axios(image as string, {
    method: "get",
    responseType: "stream"
  });

  const contentType = response.headers["content-type"];
  const key = [shortid(), mime.extension(contentType)]
    .filter(Boolean)
    .join(".");

  const uploadConfig = {
    Key: key,
    ContentType: contentType
  };
  const stream = response.data.pipe(resizer);
  const data = await upload(uploadConfig, stream);

  res.json({
    success: true,
    data: {
      location: data.Location,
      info
    }
  });
};
