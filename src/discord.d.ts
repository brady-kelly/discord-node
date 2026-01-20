import { Collection } from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, any>;
    cooldowns: Collection<string, Collection<string, number>>;
  }
}
