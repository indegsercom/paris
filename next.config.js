require("dotenv").config();
const { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID } = process.env;

module.exports = {
  ENV: {
    AWS_ACCESS_KEY,
    AWS_ACCESS_KEY_ID
  }
};
