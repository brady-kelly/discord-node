import {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

function isGuildMember(
  member: GuildMember | APIInteractionGuildMember | null,
): member is GuildMember {
  return member instanceof GuildMember;
}

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Provides information about the user.");

export async function execute(interaction: CommandInteraction) {
  let reply = "This command can only be used in a server.";

  if (isGuildMember(interaction.member)) {
    const joinedDate =
      interaction.member.joinedAt?.toDateString() ?? "Unknown Date";
    reply = `This command was run by ${interaction.user.username}, who joined on ${joinedDate}.`;
  }

  await interaction.reply(reply);
}
