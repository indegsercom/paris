import AWS from "aws-sdk";

const { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY
});

export const upload = (key: string, stream) => {
  return s3
    .upload({
      Key: key,
      Bucket: "cdn.indegser.com",
      Body: stream
    })
    .promise();
};
