import fs from "node:fs";
import path from "node:path";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from "node:url";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("Reloads a command.")
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("The command to reload.")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // ...
  const commandName = interaction.options
    .getString("command", true)
    .toLowerCase();
  const command = interaction.client.commands.get(commandName);
  if (!command) {
    return interaction.reply(
      `There is no command with name \`${commandName}\`!`,
    );
  }

  const commandFilePath = path.join(
    process.cwd(),
    "src",
    "commands",
    `${command.data.name}.ts`,
  );
  const moduleURL = `${pathToFileURL(commandFilePath).href}?update=${Date.now()}`;

  try {
    const newModule = await import(moduleURL);
    const newCommand = newModule.default ?? newModule;

    if (!newCommand.data || !newCommand.execute) {
      throw new Error(
        'The reloaded file is missing "data" or "execute" properties.',
      );
    }
    interaction.client.commands.set(newCommand.data.name, newCommand);

    await interaction.reply(
      `Command \`${newCommand.data.name}\` was reloaded!`,
    );
  } catch (error: any) {
    console.error(error);
    await interaction.reply(
      `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
    );
  }
}
