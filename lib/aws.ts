import AWS from "aws-sdk";

const { AWS_SECRET, AWS_ID } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET
});

export const upload = (config, stream) => {
  return s3
    .upload({
      ...config,
      ACL: "public-read",
      Bucket: "cdn.indegser.com",
      Body: stream,
      CacheControl: "max-age=31556952" // one year
    })
    .promise();
};
