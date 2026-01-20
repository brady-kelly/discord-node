import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_GUILD_ID,
  CLIENT_ID,
};
