import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import request from "request";
import mime from "mime-types";
import { upload } from "../../../lib/aws";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { image, w, h } = req.query;
  const resizeOptions = {
    width: w ? Number(w) : null,
    height: h ? Number(h) : null,
    withoutEnlargement: true
  };

  const s = sharp();

  s.metadata().then(metadata => {
    const { width, height, size, format } = metadata;
    const contentType = mime.lookup(format);
    res.setHeader("content-type", contentType);
    res.setHeader("Cache-control", "max-age=2592000");
    res.setHeader("e-tag", `${width}x${height}-${size}`);
  });

  const resizer = s.resize(resizeOptions);

  const stream = request(image).pipe(resizer);

  const data = await upload("hello.jpg", stream);

  res.json(data);
};
