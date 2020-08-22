const redis = require("redis");

//redis://student:Nawaz@redis-16144.c13.us-east-1-3.ec2.cloud.redislabs.com:16144

const client = redis.createClient(
  "redis://student:Nawaz@redis-16144.c13.us-east-1-3.ec2.cloud.redislabs.com:16144"
);

module.exports = client;
