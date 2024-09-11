import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string),
});

export const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string),
});

pub.on("connect", () => {
  console.log("Redis Pub client connected");
});

sub.on("connect", () => {
  console.log("Redis Sub client connected");
});

pub.on("error", (err) => {
  console.error("Redis Pub connection error:", err);
});

sub.on("error", (err) => {
  console.error("Redis Sub connection error:", err);
});
